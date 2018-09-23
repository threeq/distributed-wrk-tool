from flask import request
from flask_restful import Resource, marshal_with, fields

from api.domain.user import User
from api.restful.api_models import ResponseEntity, marshal_wrapper, RollPage, Code, page_marshal_wrapper
from api.storage.user_storage import UserStorageMgo

base_fields = fields.Nested({
    'user_id': fields.String(attribute='_id'),
    'created': fields.Integer,
    'updated': fields.Integer,
    'active': fields.Integer,

    'name': fields.String,
    'pwd': fields.String,
    'email': fields.String,
    'phone': fields.String,
    'nick_name': fields.String,
}, allow_null=False)

detail_marshal = marshal_wrapper(base_fields)

page_marshal = marshal_wrapper(page_marshal_wrapper(base_fields))


class UserApi(Resource):

    def __init__(self):
        self.storage = UserStorageMgo()

    @marshal_with(detail_marshal)
    def get(self, user_id):
        user = self.storage.get(user_id=user_id)
        if user is None:
            return ResponseEntity(code=Code.NO_DATA)

        return ResponseEntity(data=user)

    @marshal_wrapper(detail_marshal)
    def put(self, user_id):
        data = request.get_json()
        data['_id'] = user_id
        user = User(**data).save(self.storage)

        return ResponseEntity(data=self.storage.get())


class UserListApi(Resource):
    def __init__(self):
        self.storage = UserStorageMgo()

    @marshal_with(page_marshal)
    def get(self):
        l = self.storage.find_by_filter()

        return ResponseEntity(data=RollPage(list=l))
