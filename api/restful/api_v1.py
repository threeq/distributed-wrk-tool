from flask import Blueprint
from flask_restful import Api

from api.restful.resources.projects_api import ProjectsApi
from api.restful.resources.scenes_api import ScenesApi
from api.restful.resources.sys_api import LoginApi
from api.restful.resources.users_api import UsersApi

api_v1_blueprint = Blueprint('api_v1_blueprint', __name__, url_prefix='/api/v1')

api_v1 = Api(api_v1_blueprint)

api_v1.add_resource(LoginApi, '/sys/login')
api_v1.add_resource(UsersApi, '/users', '/users/<user_id>')
api_v1.add_resource(ProjectsApi, '/projects', '/projects/<_id>')
api_v1.add_resource(ScenesApi, '/scenes', '/scenes/<_id>')
api_v1.add_resource(ScenesApi, '/machines', '/machines/<_id>')
