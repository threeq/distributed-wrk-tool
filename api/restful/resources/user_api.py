from flask import request
from flask_restful import Resource, marshal_with, fields

from api.domain.user import User, UserService
from api.restful.common.api_models import ResponseEntity, marshal_wrapper, RollPage, Code, page_marshal_wrapper
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

page_marshal = marshal_wrapper(page_marshal_wrapper(fields.Nested(base_fields, allow_null=False)))


class UsersApi(Resource):

    def __init__(self):
        self.user_service = UserService(UserStorageMgo())

    @marshal_with(detail_marshal)
    def get(self, user_id=None):
        if user_id is None:
            l = self.user_service.find_by_filter()

            return ResponseEntity(data=RollPage(list=l))

        user = self.user_service.detail(user_id)
        if user is None:
            return ResponseEntity(code=Code.NO_DATA)

        return ResponseEntity(data=user)

    @marshal_with(detail_marshal)
    def put(self, user_id):
        data = request.get_json()
        data['_id'] = user_id
        user = self.user_service.save(User(**data))

        return ResponseEntity(data=self.user_service.detail(user.id()))

    @marshal_with(marshal_wrapper())
    def delete(self, user_id):
        self.user_service.delete(user_id)
        return ResponseEntity()

    @marshal_with(detail_marshal)
    def post(self):
        data = request.get_json()
        user = self.user_service.save(User(**data))
        return ResponseEntity(data=self.user_service.detail(user.id()))
