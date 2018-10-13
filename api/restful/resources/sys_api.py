from flask import request
from flask_restful import Resource, fields, marshal_with

from api.domain.user import UserService
from api.restful import ResponseEntity
from api.restful.common.api_models import marshal_wrapper
from api.storage.user_storage import UserStorageMgo

base_fields = {
    'user_id': fields.String(attribute='_id'),
    'created': fields.Integer,
    'updated': fields.Integer,
    'active': fields.Integer,

    'name': fields.String,
    'pwd': fields.String,
    'email': fields.String,
    'phone': fields.String,
    'nick_name': fields.String,
}

detail_marshal = marshal_wrapper(base_fields)


class LoginApi(Resource):
    def __init__(self):
        self.user_service = UserService(UserStorageMgo())

    @marshal_with(detail_marshal)
    def post(self):
        data = request.get_json()
        user = self.user_service.login(data['email'], data['pwd'])
        return ResponseEntity(data=user)
