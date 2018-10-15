from flask_restful import Resource, fields

from api.domain.project import ProjectService, Project
from api.domain.scene import SceneService, Scene
from api.restful.common.api_models import marshal_wrapper, page_marshal_wrapper
from api.restful.resources import BaseApi
from api.storage.project_storage import ProjectStorageMgo
from api.storage.scene_storage import SceneStorageMgo

base_fields = {
    '_id': fields.String(attribute='_id'),
    'created': fields.Integer,
    'updated': fields.Integer,
    'active': fields.Integer,

    'name': fields.String,
    'project_id': fields.String,
}

detail_marshal = marshal_wrapper(base_fields)
list_marshal = marshal_wrapper(fields.List(fields.Nested(base_fields, allow_null=False)))
page_marshal = marshal_wrapper(page_marshal_wrapper(fields.Nested(base_fields, allow_null=False)))


class ScenesApi(BaseApi):

    def __init__(self):
        BaseApi.__init__(self, SceneService(SceneStorageMgo()),
                         detail_marshal=detail_marshal,
                         list_marshal=list_marshal,
                         page_marshal=page_marshal)

    def json2entity(self, json):
        return Scene(**json)
