import os
import re
import time
from macpath import dirname
from warnings import warn
from fabric import Connection


def current_milli_time(): return int(round(time.time() * 1000))


def thread_builder(conn, host_config):
    """
    wrk 多进程、多线程并行处理工程函数
    """
    threads = host_config.get('threads')
    connections = host_config.get('connections')
    durations = host_config.get('durations')
    time = host_config.get('time')
    url = host_config.get('url')
    script = host_config.get('script')

    if url == None:
        print("%s: test url must provide." % conn.host)
    if threads > connections:
        print("%s: number of connections must be >= threads" % conn.host)
        return

    if script != None:
        put_script(conn, script)
        CMD = "./wrk/wrk -t{th} -c{con} -d{dur}s -T{t}s --script={script} --latency {test_url}".format(
            th=threads, con=connections, dur=durations, t=time, script=script, test_url=url)
    else:
        CMD = './wrk/wrk -t{th} -c{con} -d{dur}s -T{t}s --latency {test_url}'.format(
            th=threads, con=connections, dur=durations, t=time, test_url=url)

    def t(h, results):
        conn = Connection(h)
        print(("%s : "+CMD) % (conn.host))

        start = current_milli_time()
        conn.run(CMD + ">wrk_%s_%s.result" % ("lb_test", conn.host))
        end = current_milli_time()

        ret = conn.run("cat wrk_%s_%s.result" % ("lb_test", conn.host))

        results.put({
            'host': conn.host,
            'start': start,
            'end': end,
            'text': ret.stdout
        })

    return t


def runner_thread(host, cmd, results):
    conn = Connection(host)
    print(("%s : "+cmd) % (conn.host))

    start = current_milli_time()
    conn.run(cmd + ">wrk_%s_%s.result" % ("lb_test", conn.host))
    end = current_milli_time()

    ret = conn.run("cat wrk_%s_%s.result" % ("lb_test", conn.host))

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
    dirname = get_dir(script)
    if dirname != None:
        conn.run("mkdir -p %s" % get_dir(script), warn=True)

    conn.put(script, script)


def parse_result(text):
    """
    解析 wrk 输入结果
    """
    p1 = '.+?90%\s+(?P<latancy90>\d+\.?\d+\w+)'
    p2 = 'Requests/sec:\s+(?P<tps>\d+\.?\d+)'
    p3 = 'Transfer/sec:\s+(?P<tps_io>\d+\.?\d+\w+)'
    ret = {}
    m1 = re.search(p1, text)
    m2 = re.search(p2, text)
    m3 = re.search(p3, text)
    if m1:
        ret['latancy90'] = m1.group("latancy90")
        ret['tps'] = m2.group("tps")
        ret['io'] = m3.group("tps_io")
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
    (dirname, _) = os.path.split(p)
    return dirname if dirname != '' else None
