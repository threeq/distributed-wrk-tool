from flask import Flask
from flask.json import jsonify

from api.common.exception import DomainException
from api.restful.api_v1 import api_v1_blueprint
from api.restful.common import app_utils
from api.restful.common.api_models import ResponseEntity

app = Flask(__name__)


@app.errorhandler(DomainException)
def _domain_exception(ex: DomainException):
    error = ResponseEntity(code=ex.code, msg=ex.msg)
    print(error.dict())
    response = jsonify(error.dict())
    response.status_code = 500
    return response


app_utils.register_blueprint(app, api_v1_blueprint, '/api/v1')
