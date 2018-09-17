import os
import re
import time
from fabric import Connection


def current_milli_time():
    return int(round(time.time() * 1000))


def thread_builder(conn, host_config):
    """
    wrk 多进程、多线程并行处理工程函数
    返回线程安全执行函数
    """
    threads = host_config.get('threads')
    connections = host_config.get('connections')
    durations = host_config.get('durations')
    timeout = host_config.get('timeout')
    url = host_config.get('url')
    script = host_config.get('script')

    if url is None:
        print("%s: test url must provide." % conn.host)
    if threads > connections:
        print("%s: number of connections must be >= threads" % conn.host)
        return

    if script is not None:
        put_script(conn, script)
        cmd = "./wrk/wrk -t{th} -c{con} -d{dur}s --timeout={timeout}s --script={script} --latency {test_url}".format(
            th=threads, con=connections, dur=durations, timeout=timeout, script=script, test_url=url)
    else:
        cmd = './wrk/wrk -t{th} -c{con} -d{dur}s --timeout={timeout}s --latency {test_url}'.format(
            th=threads, con=connections, dur=durations, timeout=timeout, test_url=url)

    return lambda node, results: runner_cmd("wrk_lb_test", node, cmd, results)


def runner_cmd(name, node, cmd, results):
    """
    运行命令
    """
    conn = Connection(node)
    print(("%s : " + cmd) % conn.host)

    start = current_milli_time()
    conn.run(cmd + ">run_%s_%s.out" % (name, conn.host))
    end = current_milli_time()

    ret = conn.run("cat run_%s_%s.out" % (name, conn.host))

    results.put({
        'host': conn.host,
        'start': start,
        'end': end,
        'text': ret.stdout
    })


def put_script(conn, script):
    """
    上传脚本文件
    传入到相同的相对目录路径
    """
    dir_name = get_dir(script)
    if dir_name is not None:
        conn.run("mkdir -p %s" % get_dir(script), warn=True)

    conn.put(script, script)


def parse_result(text, conf, group=None):
    """
    解析 wrk 输入结果

        Running 3s test @ https://www.baidu.com/
          1 threads and 2 connections
          Thread Stats   Avg      Stdev     Max   +/- Stdev
            Latency    15.30ms  540.23us  15.68ms  100.00%
            Req/Sec     0.00      0.00     0.00    100.00%
          Latency Distribution
             50%   15.68ms
             75%   15.68ms
             90%   15.68ms
             99%   15.68ms
          2 requests in 3.01s, 30.26KB read
        Requests/sec:      0.67
        Transfer/sec:     10.07KB
    """
    ret = {}

    for field, field_conf in conf.items():
        field = str(field)
        if 'regex' in field_conf:
            g = field if group is None else group + '_' + field
            match = re.search(field_conf['regex'], text)
            if match is not None:
                ret[field] = match.group(g)
            else:
                ret[field] = None
        else:
            ret[field] = parse_result(text, field_conf, field)

    return ret


def exists(c):
    """
    判断 wrk 是否存在
    """
    result = c.run("./wrk/wrk --help", warn=True)
    return result.exited != 127


def install_ubuntu(c):
    """
    在 ubuntu 系统中安装 wrk
    """
    c.run("sudo apt-get install build-essential libssl-dev git -y")
    c.run("git clone https://github.com/wg/wrk.git wrk")
    c.run("cd wrk && sudo make")


def install_centos(c):
    """
    在 centos 系统中安装 wrk
    """
    c.run("sudo yum groupinstall 'Development Tools'")
    c.run("sudo yum install -y openssl-devel git")
    c.run("git clone https://github.com/wg/wrk.git wrk")
    c.run("cd wrk && sudo make")


def get_dir(p):
    """
    获取路径目录，不包含路径返回 None
    """
    (dir_name, _) = os.path.split(p)
    return dir_name if dir_name != '' else None


def merge_result(all_result, result_conf):
    """
    TODO 这个只是对 wrk 统计结果的简单聚合，本身是不合理的，需要将 wrk 的每个请求信息拉取出来重新实现统计
    合并各个节点测试结果
    :param result_conf:
    :param all_result:
    :return:
    """

    parsed_results = [parse_result(result['text'], result_conf) for result in all_result]

    merged_result = merge_fields(parsed_results, result_conf)
    merged_result['nodes'] = [result['host'] for result in all_result]
    return merged_result


def merge_fields(all_result, result_conf):
    """
    合并结果中各个字段
    :param all_result:
    :param result_conf:
    :return:
    """
    merged_result = {}
    for field, field_conf in result_conf.items():
        field = str(field)
        if 'regex' in field_conf:
            merged_result[field] = merge_field(all_result, field, field_conf)
        else:
            merged_result[field] = merge_fields([r[field] for r in all_result], field_conf)
    return merged_result


def merge_field(all_result, field, field_conf):
    """
    根据字段规则合并单个字段结果
    :param all_result:
    :param field:
    :param field_conf:
    :return:
    """
    all_val = [unified_unit(result[field], field_conf) for result in all_result if result[field] is not None]

    merge = field_conf['merge'].lower()
    if merge == 'avg':
        merge_val = sum(all_val) / len(all_val)
    elif merge == 'one':
        merge_val = all_val[0]
    elif merge == 'max':
        merge_val = max(all_val)
    elif merge == 'min':
        merge_val = min(all_val)
    else:
        merge_val = sum(all_val)

    return format_unit(merge_val, field_conf)


def unified_unit(value, field_conf):
    """
    统一字段单位，并且根据不同单位对字段值进行缩放
    :param value:
    :param field_conf:
    :return:
    """
    vector = re.findall(r'[0-9]+\.?[0-9]*|\w+', value)
    val = float(vector[0])

    if field_conf['type'] == 'time':
        return unified_time_us(val, vector[1])
    elif field_conf['type'] == 'network_traffic':
        return unified_network_b(val, vector[1])
    else:
        return val


def unified_time_us(val, unit):
    unit = unit.lower()
    if unit == 'ms':
        return val * 1000
    if unit == 's':
        return val * 1000 * 1000
    if unit == 'us':
        return val


def unified_network_b(val, unit):
    unit = unit.lower()
    if unit == 'b':
        return val
    if unit == 'kb':
        return val * 1024
    if unit == 'mb':
        return val * 1024 * 1024


def format_unit(merge_val, field_conf):
    """
    格式化单位值
        时间：ms、s
        流量：KB、MB、GB
    :param merge_val:
    :param field_conf:
    :return:
    """
    if field_conf['type'] == 'time':
        units = ['us', 'ms', 's', 'm', 'h', 'd']
        steps = [1000, 1000, 60, 60, 24]
    elif field_conf['type'] == 'network_traffic':
        units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
        steps = [1024, 1024, 1024, 1024, 1024]
    else:
        units = []
        steps = []

    return beautiful_unit(merge_val, units, steps)


def beautiful_unit(val, units, steps):
    if len(units) == 0:
        return "%g" % val

    unit_index = 0
    while val > steps[unit_index] and unit_index < len(units) - 1:
        val = val / steps[unit_index]
        unit_index += 1
    unit = units[unit_index]

    return "%g%s" % (round(val, 2), unit)


#  Thread Stats   Avg      Stdev     Max   +/- Stdev
#    Latency    33.12ms    1.17ms  41.35ms   96.55%
#    Req/Sec    29.48      2.79    30.00     96.55%
#

def format_result(merged_ret):
    s = """
************************************ Statistics ************************************
Use {d[node_num]} nodes Running {d[duration]} test
  {d[threads]} threads and {d[connections]} connections

  Latency Distribution
     50%   {d[latency][p50]}
     75%   {d[latency][p75]}
     90%   {d[latency][p90]}
     99%   {d[latency][p99]}
  {d[requests]} requests in {d[spend_time]}, {d[traffic_statistics]} read
  Non-2xx or 3xx responses: {d[error][response]}
Requests/sec:    {d[tps]}
Transfer/sec:    {d[tps_io]}
"""
    merged_ret['node_num'] = len(merged_ret['nodes'])
    return s.format(d=merged_ret)