from flask import request
from flask_restful import Resource, fields, marshal

from api.domain.project import ProjectService, Project, ProjectResource
from api.restful.common.api_models import marshal_wrapper, page_marshal_wrapper, ResponseEntity
from api.restful.resources import BaseResourceApi
from api.storage.machine_storage import MachineStorageMgo
from api.storage.project_storage import ProjectStorageMgo
import api.restful.resources.machines_api as machine_marshal


base_fields = {
    '_id': fields.String(attribute='_id'),
    'created': fields.Integer,
    'updated': fields.Integer,
    'active': fields.Integer,

    'name': fields.String,
}

detail_marshal = marshal_wrapper(base_fields)
list_marshal = marshal_wrapper(fields.List(fields.Nested(base_fields, allow_null=False)))
page_marshal = marshal_wrapper(page_marshal_wrapper(fields.Nested(base_fields, allow_null=False)))


class ProjectsApi(BaseResourceApi):

    def __init__(self):
        BaseResourceApi.__init__(self, ProjectService(ProjectStorageMgo(), MachineStorageMgo()),
                                 detail_marshal=detail_marshal,
                                 list_marshal=list_marshal,
                                 page_marshal=page_marshal)

    def json2entity(self, json):
        return Project(**json)


class ProjectResourceApi(Resource):

    def __init__(self):
        self.service = ProjectService(ProjectStorageMgo(), MachineStorageMgo())

    def get(self, project_id=None):
        if project_id is None:
            return self.search()

        resources = self.service.project_resource(project_id)

        return marshal(ResponseEntity(data=resources), machine_marshal.list_marshal)

    def put(self):
        return self.not_allow_method()

    def delete(self, _id):
        self.service.del_resource(_id)
        return marshal(ResponseEntity(), marshal_wrapper())

    def post(self, project_id=None):
        data = request.get_json()
        pr = ProjectResource(**data)
        pr.project_id = project_id
        self.service.add_resource(pr)
        return marshal(ResponseEntity(), marshal_wrapper())
