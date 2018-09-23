from collections import namedtuple

__Code = namedtuple('Code', [
    'OK', 'ERROR', 'NO_DATA', 'EXIST_PHONE', 'EXIST_EMAIL'
])

Code = __Code(
    OK=10000,
    ERROR=00000,
    NO_DATA=40000,
    EXIST_PHONE=50001,
    EXIST_EMAIL=50002,
)

Code_Msg = {
    Code.OK: 'Success',
    Code.ERROR: 'Unknown ERROR',
    Code.NO_DATA: 'not found data',
    Code.EXIST_PHONE: 'phone has exist',
    Code.EXIST_EMAIL: 'email has exist',
}
