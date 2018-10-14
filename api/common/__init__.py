def assert_ok_code(code):
    assert 400 > code >= 200


def assert_fail_code(code):
    assert 200 > code or code >= 400
