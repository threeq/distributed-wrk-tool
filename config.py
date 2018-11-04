import yaml

with open("wrk.yaml", "r") as stream:
    configs = yaml.load(stream)
    if "nodes" not in configs:
        print("nodes not found!")
        exit(1)

    if "all" not in configs:
        print("all codemirrorConfig not found!")
        exit(1)


def read_config(host):
    base_config = {k: v for k, v in configs["all"].items()}
    if host in configs:
        host_config = configs[host]
        for k, v in host_config.items():
            base_config[k] = v

    threads = base_config.get('threads', 1)
    connections = base_config.get('connections', 1)
    durations = base_config.get('durations', 3)
    timeout = base_config.get('timeout', 3)
    url = base_config.get('url', None)
    script = base_config.get('script', None)

    threads = threads if threads is not None else 1
    connections = connections if connections is not None else 1
    durations = durations if durations is not None else 3
    timeout = timeout if timeout is not None else 1

    return {
        'threads': threads,
        'connections': connections,
        'durations': durations,
        'timeout': timeout,
        'url': url,
        'script': script,
    }


def read_nodes():
    nodes = configs.get('nodes', None)
    return nodes


def read_result_conf():
    return configs.get('result', None)


def read_monitor():
    return configs.get('monitor', None)


def read_monitor_nodes():
    monitor = read_monitor()
    if monitor is None:
        return []
    server_nodes = monitor.get('nodes', None)
    if server_nodes is None:
        return []

    return [n for n in server_nodes]
