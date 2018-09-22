import yaml
from fabric import Connection

local_ip = 'localhost'


def local_install():
    ctx = Connection(local_ip)
    version = '2.4.1'
    os = 'darwin'
    arch = 'amd64'
    name = 'prometheus-{version}.{os}-{arch}'.format(version=version, os=os, arch=arch)

    download = 'https://github.com/prometheus/prometheus/releases/download/v{0}/{1}.tar.gz'.format(version, name)

    ctx.local('rm -rf run-tools/prometheus')
    ctx.local('mkdir -p run-tools/download')
    # TODO 判断当前是否已经下载
    # ctx.local('wget {download} -P run-tools/download'.format(download=download))
    ctx.local('tar -zxvf run-tools/download/{name}.tar.gz -C run-tools'.format(name=name))
    ctx.local('mv run-tools/{name} run-tools/prometheus'.format(name=name))


def local_run(conf):
    with open('run-tools/prometheus/prometheus.yml', 'w') as conf:
        conf.write(yaml.safe_dump(conf, allow_unicode=True, default_flow_style=False))

    with Connection(local_ip) as ctx:
        ctx.local('cp scripts/prometheus.sh run-tools/prometheus/prometheus.sh')
        ctx.local('sh run-tools/prometheus/prometheus.sh restart')


def local_stop():
    with Connection(local_ip) as ctx:
        ctx.local('sh run-tools/prometheus/prometheus.sh stop')


def local_install_by_docker(_):
    with Connection(local_ip) as ctx:
        ctx.local('docker run -d --name prometheus \
                    -p 9090:9090 \
                    -v /prometheus-data:/prometheus-data \
                    prom/prometheus \
                    --config.file=/prometheus-data/prometheus.yml')


def remote_install_node_exporter(ctx):
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


def remote_run_node_exporter(ctx):
    ctx.run('sh run-tools/node_exporter/node_exporter.sh restart')


def remote_stop_node_exporter(ctx):
    ctx.run('sh run-tools/node_exporter/node_exporter.sh  stop')