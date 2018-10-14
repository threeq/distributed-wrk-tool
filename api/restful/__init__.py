from flask import Flask, jsonify
from flask_cors import CORS

from api.common.code_def import Code
from api.restful.app import app
from api.restful.common.api_models import ResponseEntity as __ResponseEntity

CORS(app)


@app.errorhandler(500)
def _handle_api_error_50x(ex):
    print(ex)
    error = __ResponseEntity(code=Code.ERROR, msg=str(ex))
    return jsonify(error.dict()), 500


@app.errorhandler(404)
def _handle_api_error_404(ex):
    error = __ResponseEntity(code=Code.NOT_FOUND, msg=str(ex))
    return jsonify(error.dict()), 404


@app.errorhandler(405)
def _handle_api_error_405(ex):
    error = __ResponseEntity(code=Code.NOT_FOUND, msg=str(ex))
    return jsonify(error.dict()), 405
