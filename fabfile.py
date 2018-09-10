import datetime
import os
import re
import sys
import time
from gettext import textdomain
from threading import Lock, Thread

import yaml
from fabric import Connection, task


def current_milli_time(): return int(round(time.time() * 1000))


def read_config(host):
    with open("wrk.yaml", "r") as stream:
        configs = yaml.load(stream)
        if "all" not in configs:
            print("")
            return
        base_config = configs["all"]
        if host in configs:
            host_config = configs[host]
            for k, v in host_config.items():
                base_config[k] = v
    threads = base_config.get('threads', 1)
    connections = base_config.get('connections', 1)
    durations = base_config.get('durations', 3)
    time = base_config.get('time', 1)
    url = base_config.get('url', None)
    script = base_config.get('script', None)

    threads = threads if threads is not None else 1
    connections = connections if connections is not None else 1
    durations = durations if durations is not None else 3
    time = time if time is not None else 1

    return {
        'threads': threads,
        'connections': connections,
        'durations': durations,
        'time': time,
        'url': url,
        'script': script,
    }


def read_nodes():
    with open("wrk.yaml", "r") as stream:
        configs = yaml.load(stream)
        nodes = configs.get('nodes', None)

    if nodes == None:
        print("nodes not found!")
        exit(1)

    return nodes


@task
def installwrk(ctx):
    '''
    deploy wrk to all client host
    '''
    nodes = read_nodes().split(",")
    print(nodes)
    for h in nodes:
        c = Connection(h)
        print("\n")
        print("#" * 80)
        print("{} 开始安装 wrk".format(c.host))

        if wrk_exists(c):
            print("{} 已经安装 wrk".format(c.host))
            print("#" * 80)
            print("\n")
            continue

        result = c.run('cat /etc/*release*')
        output = result.stdout.strip()
        if "CentOS" in output:
            wrk_install_centos(c)
        elif "Ubuntu" in output:
            wrk_install_ubuntu(c)
        else:
            print("{} 系统版本不支持".format(c.host))

        if wrk_exists(c):
            print("{} 安装 wrk 成功".format(c.host))
        else:
            print("{} 安装 wrk 失败".format(c.host))
        print("#" * 80)
        print("\n")


def wrk_exists(c):
    result = c.run("./wrk/wrk --help", warn=True)
    return result.exited != 127


def wrk_install_ubuntu(c):
    c.run("sudo apt-get install build-essential libssl-dev git -y")
    c.run("git clone https://github.com/wg/wrk.git wrk")
    c.run("cd wrk && sudo make")


def wrk_install_centos(c):
    c.run("sudo yum groupinstall 'Development Tools'")
    c.run("sudo yum install -y openssl-devel git")
    c.run("git clone https://github.com/wg/wrk.git wrk")
    c.run("cd wrk && sudo make")


def thread_wrapper(conn, host_config, results, lock):
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
        CMD = "./wrk/wrk -t{th} -c{con} -d{dur}s -T{t}s --script={script} --latency {test_url}".format(
            th=threads, con=connections, dur=durations, t=time, script=script, test_url=url)
    else:
        CMD = './wrk/wrk -t{th} -c{con} -d{dur}s -T{t}s --latency {test_url}'.format(
            th=threads, con=connections, dur=durations, t=time, test_url=url)

    def t():
        print(("%s : "+CMD) % (conn.host))

        start = current_milli_time()
        conn.run(CMD + ">wrk_%s_%s.result" % ("test_name", conn.host))
        end = current_milli_time()

        ret = conn.run("cat wrk_%s_%s.result" % ("test_name", conn.host))

        with lock:
            results.append({
                'host': conn.host,
                'start': start,
                'end': end,
                'text': ret.stdout
            })

    return t


@task
def runtest(ctx):
    nodes = read_nodes().split(",")
    lock = Lock()
    threads = []
    results = []
    for h in nodes:
        conn = Connection(h)
        host_config = read_config(conn.host)
        t = Thread(target=thread_wrapper(conn, host_config, results, lock))
        t.start()
        threads.append(t)

    for t in threads:
        t.join()

    if len(nodes) != len(results):
        print("部分客户机执行错误")
        exit(1)

    with open('outs/all.txt', 'w') as w:
        for result in results:
            ret = parse_wrk_result(result['text'])
            print(result['host'], file=w)
            print("="*80, file=w)
            print(result['text'], file=w)


def parse_wrk_result(text):
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

# count 90Percent Latancy average
# def count_LTC(resultfile):
#     with open(resultfile, 'r') as f:
#         reslist = f.readlines()
#         reslist = [s[0] for s in [
#             (res.split('Latancy:')[1].split('] [TPS')) for res in reslist]]
#     total = 0
#     for time in reslist:
#         if time.count('us'):
#             total = total + float(time.split('.')[0])/1000
#     else:
#         if time.count('ms'):
#             total = total + float(time.split('ms')[0])
#         else:
#             total = total + float(time.split('m')[0])*1000
#     return str(round(total/len(reslist), 2)) + 'ms'

# # count total TPS
# def count_TPS(resultfile):
#     with open(resultfile, 'r') as f:
#         reslist = f.readlines()
#         reslist = [s[0] for s in [
#             (res.split('[TPS:')[1].split('] [IO')) for res in reslist]]
#         total = 0
#         for tps in reslist:
#             total = total + float(tps)
#         return total

# # count total IO
# def count_IO(resultfile):
#     with open(resultfile, 'r') as f:
#         reslist = f.readlines()
#         reslist = [s[0] for s in [
#             (res.split('[IO:')[1].split('] [URL')) for res in reslist]]
#         total = 0
#         containMB = False
#         for io in reslist:
#             if io.count('MB'):
#                 containMB = True
#         if containMB:
#             for io in reslist:
#                 if io.count('MB'):
#                     total = total + float(io.split('MB')[0])
#                 else:
#                     if io.count('KB'):
#                         total = total + float(io.split('KB')[0])/1024
#                     else:
#                         for io in reslist:
#                             if io.count('KB'):
#                                 total = total + float(io.split('KB')[0])
#                 if containMB:
#                     return str(round(total, 2)) + 'MB'
#                 else:
#                     return str(round(total, 2)) + 'KB'
