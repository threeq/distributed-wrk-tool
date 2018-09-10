# distributed-wrk-tool

wrk 分布式多机压测支持工具。使用 fabric 库支持。

## TODO
- [*] wrk 多机部署
- [*] wrk 多机运行控制
- [*] wrk 多机运行配置文件支持
- [*] wrk 多机运行结果统计
- [*] 支持 ubuntu
- [*] 支持 centos
- [ ] 支持 jenkins pipeline 发布流程

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

