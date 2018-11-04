from flask_restful import Resource, fields

from api.domain.project import ProjectService, Project
from api.domain.scene import SceneService, Scene
from api.restful.common.api_models import marshal_wrapper, page_marshal_wrapper
from api.restful.resources import BaseResourceApi
from api.storage.project_storage import ProjectStorageMgo
from api.storage.scene_storage import SceneStorageMgo

base_fields = {
    '_id': fields.String(attribute='_id'),
    'created': fields.Integer,
    'updated': fields.Integer,
    'active': fields.Integer,

    'name': fields.String,
    'projectId': fields.String,
    'threads': fields.Integer,
    'connections': fields.Integer,
    'durations': fields.Integer,
    'timeout': fields.Integer,
    'script': fields.String,

    'testUrls': fields.List(fields.Nested({
        "url": fields.String,
        "method": fields.String,
        "headers": fields.List(fields.Nested({
            "name": fields.String,
            "value": fields.String
        }, allow_null=False)),
        "body": fields.String,
        # "checkPoints": fields.String,
        "thresholds": {
            "sr": fields.Float,
            "tps": fields.Float,
            "rt_avg": fields.Float,
            "rt_99": fields.Float,
            "rt_95": fields.Float,
            "rt_90": fields.Float,
            "rt_75": fields.Float,
            "rt_50": fields.Float
        }
    }, allow_null=False)),
    'testModels': fields.List(fields.Nested({
        "sort": fields.Integer,
        "name": fields.String,
        "url": fields.String,
        "loadRate": fields.Float
    }, allow_null=False)),
}

detail_marshal = marshal_wrapper(base_fields)
list_marshal = marshal_wrapper(fields.List(fields.Nested(base_fields, allow_null=False)))
page_marshal = marshal_wrapper(page_marshal_wrapper(fields.Nested(base_fields, allow_null=False)))


class ScenesApi(BaseResourceApi):

    def __init__(self):
        BaseResourceApi.__init__(self, SceneService(SceneStorageMgo()),
                                 detail_marshal=detail_marshal,
                                 list_marshal=list_marshal,
                                 page_marshal=page_marshal)

    def json2entity(self, json):
        return Scene(**json)
