from flask import Flask, jsonify
from flask_cors import CORS

from api.common.code_def import Code
from api.restful.common.api_models import ResponseEntity

app = Flask(__name__)
CORS(app)


@app.errorhandler(404)
@app.errorhandler(405)
@app.errorhandler(500)
def _handle_api_error(ex):
    error = ResponseEntity(code=Code.ERROR)
    return jsonify(error.dict())


