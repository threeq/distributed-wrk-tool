
import wrk
import config


def test_get_dir():
    assert wrk.get_dir('') is None
    assert wrk.get_dir('/') == '/'
    assert wrk.get_dir('/aaa') == '/'
    assert wrk.get_dir('aaa') is None
    assert wrk.get_dir('aaa/bbb') == 'aaa'


def test_result_parse():
    text = """Running 3s test @ https://www.baidu.com/
  1 threads and 2 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    15.30ms  540.23us  15.68ms  100.00%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%   10.68ms
     75%   15.68ms
     90%   17.68ms
     99%   25.68ms
  2 requests in 3.01s, 30.26KB read
Requests/sec:      0.67
Transfer/sec:     10.07KB"""

    conf = config.read_result_conf()
    ret = wrk.parse_result(text, conf)
    print(ret)


if __name__ == '__main__':
    test_get_dir()
    test_result_parse()
