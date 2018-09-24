from flask import Flask, request

from api.restful.api_v1 import api_v1_blueprint

app = Flask(__name__)


@app.errorhandler(404)
@app.errorhandler(405)
def _handle_api_error(ex):
    if request.path.startswith('/api/'):

        return ex
    else:
        return ex


app.register_blueprint(api_v1_blueprint, url_prefix='/api/v1')
