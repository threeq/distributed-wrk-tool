from collections import namedtuple


# TODO code 定义需要优化，包含 http 状态

__Code = namedtuple('Code', [
    'NOT_FOUND',
    'OK', 'ERROR', 'NO_DATA', 'EXIST_PHONE', 'EXIST_EMAIL', 'ERR_EMAIL', 'ERR_PWD', 'EXIST_DATA'
])

Code = __Code(
    OK=10000,
    ERROR=00000,
    NOT_FOUND=404,
    NO_DATA=40004,
    EXIST_DATA=40000,
    EXIST_PHONE=50001,
    EXIST_EMAIL=50002,
    ERR_EMAIL=40001,
    ERR_PWD=40002,
)

Code_Msg = {
    Code.OK: 'Success',
    Code.ERROR: 'Unknown ERROR',
    Code.NOT_FOUND: 'Not found',
    Code.NO_DATA: 'not found data',
    Code.EXIST_DATA: 'data has exist',
    Code.EXIST_PHONE: 'phone has exist',
    Code.EXIST_EMAIL: 'email has exist',
    Code.ERR_EMAIL: 'email failure',
    Code.ERR_PWD: 'password failure',
}
