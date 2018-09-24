import datetime

from bson import ObjectId

from api.restful.common.api_models import Code
from api.restful.app import app


def test_api_user_get():
    with app.test_client() as c:
        rv = c.get('/api/v1/user/5ba611167a8e2551bae466ba')
        json_data = rv.get_json()
        print(json_data)
        assert 400 > rv.status_code >= 200

        assert Code.OK == json_data['code']

        assert len(json_data['data']['user_id']) == 24
        assert json_data['data']['user_id'] == '5ba611167a8e2551bae466ba'


def test_api_user_get_not_found():
    with app.test_client() as c:
        gen_time = datetime.datetime(1992, 1, 1)
        _id = ObjectId.from_datetime(gen_time)
        rv = c.get('/api/v1/user/'+str(_id))
        json_data = rv.get_json()
        print(json_data)
        assert 400 > rv.status_code >= 200

        assert Code.NO_DATA == json_data['code']


def test_api_user_list():
    with app.test_client() as c:
        rv = c.get('/api/v1/user')
        json_data = rv.get_json()
        print(json_data)
        assert 400 > rv.status_code >= 200

        assert Code.OK == json_data['code']