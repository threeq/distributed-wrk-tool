

import wrk


def test_get_dir():
    assert wrk.get_dir('') == None
    assert wrk.get_dir('/') == '/'
    assert wrk.get_dir('/aaa') == '/'
    assert wrk.get_dir('aaa') == None
    assert wrk.get_dir('aaa/bbb') == 'aaa'


test_get_dir()
