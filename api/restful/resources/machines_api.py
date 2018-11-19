from flask_restful import Resource, fields

from api.domain.machine import Machine, MachineService
from api.domain.project import ProjectService, Project
from api.restful.common.api_models import marshal_wrapper, page_marshal_wrapper
from api.restful.resources import BaseResourceApi
from api.storage.machine_storage import MachineStorageMgo
from api.storage.project_storage import ProjectStorageMgo

base_fields = {
    '_id': fields.String(attribute='_id'),
    'created': fields.Integer,
    'updated': fields.Integer,
    'active': fields.Integer,

    'name': fields.String,
    'ip': fields.String,
}

detail_marshal = marshal_wrapper(base_fields)
list_marshal = marshal_wrapper(fields.List(fields.Nested(base_fields, allow_null=False)))
page_marshal = marshal_wrapper(page_marshal_wrapper(fields.Nested(base_fields, allow_null=False)))


class MachinesApi(BaseResourceApi):

    def __init__(self):
        BaseResourceApi.__init__(self, MachineService(MachineStorageMgo()),
                                 detail_marshal=detail_marshal,
                                 list_marshal=list_marshal,
                                 page_marshal=page_marshal)

    def json2entity(self, json):
        return Machine(**json)
