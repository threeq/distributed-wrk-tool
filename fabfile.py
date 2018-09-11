import datetime
import os
import sys
import time
from threading import Lock, Thread
from multiprocessing import Process, Queue

import yaml
from fabric import Connection, task

import wrk
from config import read_config, read_nodes


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
def runtest(ctx):
    nodes = read_nodes().split(",")
    runners = []
    results = Queue()
    for node in nodes:
        conn = Connection(node)
        host_config = read_config(conn.host)
        t = Process(
            target=wrk.thread_builder(conn, host_config),
            args=(node, results)
        )
        runners.append(t)

    for t in runners:
        t.start()

    for t in runners:
        t.join()

    # if len(nodes) != results.qsize():
    #     print("部分客户机执行错误")
    #     exit(1)

    with open('outs/all.txt', 'w') as w:
        for i in range(len(nodes)):
            result = results.get()
            ret = wrk.parse_result(result['text'])
            print(result['host'], file=w)
            print("="*80, file=w)
            print(result['text'], file=w)
