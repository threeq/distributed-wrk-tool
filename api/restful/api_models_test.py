import json

from flask_restful import fields, marshal

from api.restful.api_models import marshal_wrapper


def test_marshal_wrapper():
    d = {
        'user_id': fields.String(attribute='_id'),
        'created': fields.Integer(attribute='created'),
        'updated': fields.Integer,
        'active': fields.Integer,

        'name': fields.String,
        'pwd': fields.String,
        'email': fields.String,
        'phone': fields.String,
        'nick_name': fields.String,
    }

    dw = marshal_wrapper(d)

    assert 'code' in dw
    assert 'msg' in dw
    assert 'data' in dw

    assert 'data._id' == dw['data']['user_id'].attribute
    assert 'data.updated' == dw['data']['updated'].attribute


def test_marshal_wrapper_list():
    d = {
        'nested': fields.Nested({
            'name': fields.String,
            'pwd': fields.String,
            'email': fields.String,
            'phone': fields.String,
            'nick_name': fields.String,
        }),
        'list_nested': fields.List(fields.Nested({
            'name': fields.String,
            'pwd': fields.String,
            'email': fields.String,
            'phone': fields.String,
            'nick_name': fields.String,
        }))
    }

    dw = marshal_wrapper(d)

    assert 'code' in dw
    assert 'msg' in dw
    assert 'data' in dw


def test_marshal_wrapper_list_parse():
    m = marshal_wrapper({
        'page': fields.Integer,
        'list': fields.List(fields.Nested({
            'name': fields.String
        }))
    })
    m1 = {
        'code': fields.Integer,
        'msg': fields.String,
        'data': {
            'page': fields.Integer,
            'list': fields.List(fields.Nested({
                'name': fields.String(attribute='name')
            }), attribute='data.list')
        }
    }

    data = {
        'code': 1000,
        'msg': 'cccc',
        'data': {
            'page': 10,
            'aaa': 'ccc',
            'list': [{
                'name': 'aaa'
            }, {
                'name': 'bbb'
            }]
        }
    }

    print(json.dumps(marshal(data, m)))
