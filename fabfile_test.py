from fabric import Connection

import fabfile


def test_install_wrk():
    c = Connection('root@115.159.143.62')
    fabfile.installwrk(c)


def test_run_test():
    c = Connection('root@115.159.143.62')
    fabfile.runtest(c)


if __name__ == '__main__':
    test_run_test()
