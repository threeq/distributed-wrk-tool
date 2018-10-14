import abc

from flask import request
from flask_restful import marshal, Resource

from api.domain import ApplicationService
from api.common.code_def import Code
from api.restful.common.api_models import RollPage, marshal_wrapper, ResponseEntity


class BaseApi(Resource):
    def __init__(self, service: ApplicationService, detail_marshal, list_marshal, page_marshal):
        self.service = service

        self.detail_marshal = detail_marshal
        self.list_marshal = list_marshal
        self.page_marshal = page_marshal

    def get(self, _id=None):
        # list search
        # TODO 支持分页
        # TODO 支持过滤参数
        if _id is None:
            page = self.service.find_by_filter()

            return marshal(ResponseEntity(data=RollPage(list=page)), self.page_marshal)

        # get detail
        user = self.service.detail(_id)
        if user is None:
            return marshal(ResponseEntity(code=Code.NO_DATA), marshal_wrapper())

        return marshal(ResponseEntity(data=user), self.detail_marshal)

    def put(self, _id):
        data = request.get_json()
        data['_id'] = _id
        user = self.service.save(self.json2entity(data))

        return marshal(ResponseEntity(data=self.service.detail(user.id())), self.detail_marshal)

    def delete(self, _id):
        self.service.delete(_id)
        return marshal(ResponseEntity(), marshal_wrapper())

    def post(self):
        data = request.get_json()
        user = self.service.save(self.json2entity(data))
        print(user.id())
        return marshal(ResponseEntity(data=self.service.detail(user.id())), self.detail_marshal)

    @abc.abstractmethod
    def json2entity(self, json):
        pass
