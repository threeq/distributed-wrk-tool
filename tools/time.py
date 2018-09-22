import time


def now_milli_time():
    return int(round(time.time() * 1000))


def now():
    return time.time()


def milli_time_2_time(mill_time):
    return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(mill_time / 1000))
