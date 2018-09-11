from fabric import Connection

import fabfile


def test_deploywrk():
    c = Connection("root@115.159.143.62")
    fabfile.installwrk(c)
