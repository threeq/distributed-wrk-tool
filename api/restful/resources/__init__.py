import abc
import json
from urllib.parse import urlencode

from flask import request
from flask_restful import marshal, Resource

from api.domain import ApplicationService
from api.common.code_def import Code
from api.restful.common.api_models import RollPage, marshal_wrapper, ResponseEntity


class BaseResourceApi(Resource):
    def __init__(self, service: ApplicationService, detail_marshal, list_marshal, page_marshal):
        self.service = service

        self.detail_marshal = detail_marshal
        self.list_marshal = list_marshal
        self.page_marshal = page_marshal

    # list search
    # TODO 支持分页
    # TODO 支持过滤参数
    def search(self):
        q = json.loads(urlencode(request.args.get('_q', default=None)))
        sorts = json.loads(urlencode(request.args.get('sorts', default=None)))
        page = json.loads(urlencode(request.args.get('page', default=None)))

        page = self.service.find(filter=q, sort=sorts, page=page)

        return marshal(ResponseEntity(data=RollPage(list=page)), self.page_marshal)

    def get(self, _id=None):

        if _id is None:
            return self.search()

        # get detail
        entity = self.service.detail(_id)
        if entity is None:
            return marshal(ResponseEntity(code=Code.NO_DATA), marshal_wrapper())

        return marshal(ResponseEntity(data=entity), self.detail_marshal)

    def put(self, _id):
        data = request.get_json()
        data['_id'] = _id
        entity = self.service.save(self.json2entity(data))

        return marshal(ResponseEntity(data=self.service.detail(entity.id())), self.detail_marshal)

    def delete(self, _id):
        self.service.delete(_id)
        return marshal(ResponseEntity(), marshal_wrapper())

    def post(self):
        data = request.get_json()
        entity = self.service.save(self.json2entity(data))
        print(entity.id())
        return marshal(ResponseEntity(data=self.service.detail(entity.id())), self.detail_marshal)

    @abc.abstractmethod
    def json2entity(self, json):
        pass
