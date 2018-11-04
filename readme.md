# distributed-wrk-tool

wrk 分布式多机压测支持工具。使用 Prometheus 作为测试工程中服务器监控工具

## TODO
- [x] wrk 多机部署
- [x] wrk 多机运行控制
- [x] wrk 多机运行配置文件支持
- [x] 支持 ubuntu
- [x] 支持 centos
- [x] 支持 wrk 测试脚本
- [x] wrk 多机运行结果统计
- [x] 测试客户机指标收集
- [x] 测试服务器指标收集
- [ ] web UI
- [ ] 实现更合理、更准确的统计


## 使用

### 依赖基础环境

1. python3
2. pipenv

### 获取代码库

```
git clone https://github.com/threeq/distributed-wrk-tool.git
cd distributed-wrk-tool
```

### 配置运行环境

```
pipenv install
```

### 安装 wrk

```
pipenv run fab installwrk
```

### 编写压测配置文件和压测脚本

1. 压测配置文件名称必须是 `wrk.yaml`, 并且放到 fabfile.py 同目录下。内容如下：

```
# 压测客户机节点配置
nodes: root@127.0.0.1,root@localhost

# 所有压测客户机节点通用配置
all:
  script:                # 测试脚本
  threads:      1        # 每台压力机启动线程数，最好和机器的CPU个数保持一致
  connections:  1        # 每台压力机创建的连接数，必须大于或者等于启动线程数
  durations:    3        # 测试脚本运行时长，单位秒
  time:         1        # 单位秒
  url:          https://www.baidu.com/   # 请求发送的地址

# 单个压测客户机节点特定配置
127.0.0.1:
  connections: 2
```

2. wrk 压测脚本请参考 https://github.com/wg/wrk/tree/master/scripts[https://github.com/wg/wrk/tree/master/scripts]

### 运行压测

```
pipenv run fab runtest
```

3. 本地 prometheus 监控服务器安装和运行

在 `wrk.yaml` 里面配置监控信息。

```yaml
# 监控配置
monitor:
  # 服务器机器监控
  prometheus:
    codemirrorConfig
    global:
      scrape_interval:     5s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
      evaluation_interval: 5s # Evaluate rules every 15 seconds. The default is every 1 minute.
      # scrape_timeout is set to the global default (10s).

    # Alertmanager configuration
    alerting:
      alertmanagers:
      - static_configs:
        - targets:
          # - alertmanager:9093

    # Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
    rule_files:
    # - "first_rules.yml"
    # - "second_rules.yml"

    # A scrape configuration containing exactly one endpoint to scrape:
    # Here it's Prometheus itself.
    scrape_configs:
    codemirrorConfig
    - job_name: 'client-nodes'

      # metrics_path defaults to '/metrics'
      # scheme defaults to 'http'.

      static_configs:
      - targets: ['115.159.143.62:9100']
```

> 在 `monitor.prometheus` 下的配置信息和原始 `pprometheus` 配置信息完全相同，
> 具体配置可以参考 [Prometheus官方文档](https://prometheus.io/)

安装
```bash
pipenv run fab installprometheus
```

运行
```bash
pipenv run fab runprometheus
```

停止
```bash
pipenv run fab stopprometheus
```


4. 测试客户机监控代理客户端安装和运行

服务器性能指标收集使用 `node-exporter`

安装
```bash
pipenv run fab installexporter
```

运行
```bash
pipenv run fab runexporter
```

停止
```bash
pipenv run fab stopexporter