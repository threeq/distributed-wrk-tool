import copy

from flask_restful import fields

from api.common.code_def import Code, Code_Msg


class ResponseEntity:
    def __init__(self, **kwargs):
        self.code = kwargs.get('code', Code.OK)
        self.msg = kwargs.get('msg', Code_Msg.get(self.code, '【{0}】No description'.format(self.code)))
        self.data = kwargs.get('data', None)


class RollPage:
    def __init__(self, **kwargs):
        self.total = kwargs.get('total', 0)
        self.page = kwargs.get('page', 1)
        self.size = kwargs.get('size', 10)
        self.list = kwargs.get('list', None)


def marshal_merge(marshal_def, envelope=None):
    if isinstance(marshal_def, fields.List):
        marshal_def.attribute = envelope
        marshal_def.container = marshal_merge(marshal_def.container, None)

    elif isinstance(marshal_def, fields.Nested):
        marshal_def.attribute = envelope
        marshal_def.nested = marshal_merge(marshal_def.nested, envelope)

    elif isinstance(marshal_def, fields.Raw):
        marshal_def.attribute = envelope

    elif isinstance(marshal_def, dict):
        kv = marshal_def.items()
        for f, item_def in kv:
            prefix = (envelope + '.') if envelope is not None else ''
            if isinstance(item_def, fields.Raw):
                item_envelope = prefix + (f if item_def.attribute is None else item_def.attribute)
            else:
                item_envelope = prefix + f

            marshal_def[f] = marshal_merge(item_def, item_envelope)
    elif issubclass(marshal_def, fields.Raw):
        marshal_def = marshal_def()
        marshal_def.attribute = envelope

    return marshal_def


def marshal_wrapper(marshal_def=None):
    if marshal_def is None:
        return {
            'code': fields.Integer,
            'msg': fields.String,
        }

    marshal_def = copy.deepcopy(marshal_def)
    return {
        'code': fields.Integer,
        'msg': fields.String,
        'data': marshal_merge(marshal_def, 'data')
    }


def page_marshal_wrapper(marshal_def):
    marshal_def = copy.deepcopy(marshal_def)
    return {
        'total': fields.Integer,
        'size': fields.Integer,
        'page': fields.Integer,
        'list': fields.List(marshal_merge(marshal_def, None))
    }
