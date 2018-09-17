import re
from multiprocessing import Process, Queue

from fabric import Connection, task

import config
import wrk


@task
def installwrk(_):
    """
    deploy wrk to all client host
    """
    nodes = config.read_nodes().split(",")
    print(nodes)
    for h in nodes:
        c = Connection(h)
        print("\n")
        print("#" * 80)
        print("{} 开始安装 wrk".format(c.host))

        if wrk.exists(c):
            print("{} 已经安装 wrk".format(c.host))
            print("#" * 80)
            print("\n")
            continue

        result = c.run('cat /etc/*release*')
        output = result.stdout.strip()
        if "CentOS" in output:
            wrk.install_centos(c)
        elif "Ubuntu" in output:
            wrk.install_ubuntu(c)
        else:
            print("{} 系统版本不支持".format(c.host))

        if wrk.exists(c):
            print("{} 安装 wrk 成功".format(c.host))
        else:
            print("{} 安装 wrk 失败".format(c.host))
        print("#" * 80)
        print("\n")


@task
def runtest(_):
    """
    运行分布式测试
    :param _:
    :return:
    """
    nodes = config.read_nodes().split(",")
    runners = []
    results = Queue()
    for node in nodes:
        conn = Connection(node)
        host_config = config.read_config(conn.host)
        t = Process(
            target=wrk.thread_builder(conn, host_config),
            args=(node, results)
        )
        runners.append(t)

    for t in runners:
        t.start()

    for t in runners:
        t.join()

    all_result = []
    with open('outs/all.txt', 'w') as f:
        for i in range(len(nodes)):
            result = results.get()

            all_result.append(result)

            print(result['host'], file=f)
            print("=" * 80, file=f)
            print(result['text'], file=f)

        merged_ret = wrk.merge_result(all_result, config.read_result_conf())
        print(wrk.format_result(merged_ret))
        print(wrk.format_result(merged_ret), file=f)
