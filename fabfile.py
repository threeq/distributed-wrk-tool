from multiprocessing import Process, Queue

import yaml
from fabric import Connection, task

import config
import wrk


@task
def installwrk(_):
    """
    deploy wrk to all client host
    """
    nodes = config.read_nodes()
    print(nodes)
    for h in nodes:
        with Connection(h) as c:
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
    nodes = config.read_nodes()
    runners = []
    results = Queue()
    for node in nodes:
        with Connection(node) as conn:
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


@task
def installprometheusdocker(_):
    ctx = Connection("127.0.0.1")
    ctx.local('docker run -d --name prometheus \
                    -p 9090:9090 \
                    -v /prometheus-data:/prometheus-data \
                    prom/prometheus \
                    --config.file=/prometheus-data/prometheus.yml')


@task
def installprometheus(_):
    ctx = Connection("127.0.0.1")
    version = '2.4.1'
    os = 'darwin'
    arch = 'amd64'
    name = 'prometheus-{version}.{os}-{arch}'.format(version=version, os=os, arch=arch)

    download = 'https://github.com/prometheus/prometheus/releases/download/v{0}/{1}.tar.gz'.format(version, name)

    ctx.local('rm -rf run-tools/prometheus')
    ctx.local('mkdir -p run-tools/download')
    # ctx.local('wget {download} -P run-tools/download'.format(download=download))
    ctx.local('tar -zxvf run-tools/download/{name}.tar.gz -C run-tools'.format(name=name))
    ctx.local('mv run-tools/{name} run-tools/prometheus'.format(name=name))


@task
def runprometheus(_):
    monitor = config.read_monitor()
    if monitor is None:
        return
    prometheus = monitor.get('prometheus', None)
    if prometheus is None:
        return

    with open('run-tools/prometheus/prometheus.yml', 'w') as conf:
        conf.write(yaml.safe_dump(prometheus, allow_unicode=True, default_flow_style=False))

    ctx = Connection("127.0.0.1")
    ctx.local('cp scripts/prometheus.sh run-tools/prometheus/prometheus.sh')
    ctx.local('sh run-tools/prometheus/prometheus.sh restart')


@task
def stopprometheus(_):
    ctx = Connection("127.0.0.1")
    ctx.local('sh run-tools/prometheus/prometheus.sh stop')


@task
def installexporterdocker(_):
    nodes = config.read_nodes()
    for h in nodes:
        ctx = Connection(h)
        ctx.run('docker run -d \
                  --net="host" \
                  --pid="host" \
                  quay.io/prometheus/node-exporter')


@task
def installexporter(_):
    nodes = config.read_nodes()
    for node in nodes:
        with Connection(node) as ctx:
            print(node)
            version = '0.16.0'
            os = 'linux'
            arch = 'amd64'
            name = 'node_exporter-{version}.{os}-{arch}'.format(version=version, os=os, arch=arch)

            download = 'https://github.com/prometheus/node_exporter/releases/download/v{0}/{1}.tar.gz'.format(version,
                                                                                                              name)
            # ctx.local('wget {download} -P run-tools/download'.format(download=download))

            ctx.run('rm -rf run-tools/node_exporter')
            ctx.run('mkdir -p run-tools/download')
            ctx.run('rm -rf run-tools/download/*')

            put_path = 'run-tools/download/{name}.tar.gz'.format(name=name)
            ctx.put(put_path, put_path)
            ctx.run('tar -zxvf run-tools/download/{name}.tar.gz -C run-tools'.format(name=name))
            ctx.run('mv run-tools/{name} run-tools/node_exporter'.format(name=name))
            ctx.put('scripts/node_exporter.sh', 'run-tools/node_exporter/node_exporter.sh')


@task
def runexporter(_):
    nodes = config.read_nodes()
    for node in nodes:
        with Connection(node) as ctx:
            ctx.run('sh run-tools/node_exporter/node_exporter.sh restart')


@task
def stopexporter(_):
    nodes = config.read_nodes()
    for node in nodes:
        with Connection(node) as ctx:
            ctx.run('sh run-tools/node_exporter/node_exporter.sh  stop')
