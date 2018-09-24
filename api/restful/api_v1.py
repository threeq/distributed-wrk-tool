from flask import Blueprint
from flask_restful import Api

from api.restful.resources.user_api import UserApi, UserListApi

api_v1_blueprint = Blueprint('api_v1_blueprint', __name__, url_prefix='/api/v1')
api_v1 = Api(api_v1_blueprint)

api_v1.add_resource(UserApi, '/user/<user_id>')
api_v1.add_resource(UserListApi, '/user')
