

import wrk


def test_get_dir():
    assert wrk.get_dir('') is None
    assert wrk.get_dir('/') == '/'
    assert wrk.get_dir('/aaa') == '/'
    assert wrk.get_dir('aaa') is None
    assert wrk.get_dir('aaa/bbb') == 'aaa'


test_get_dir()
