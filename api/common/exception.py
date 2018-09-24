from api.common.code_def import Code


class DomainException(RuntimeError):
    def __init__(self, code=Code.ERROR, msg=None):
        self.code = code
        self.msg = msg

