import datetime

from bson import ObjectId

from api.restful.app import app
from api.restful.common.api_models import Code


def assert_ok_code(code):
    assert 400 > code >= 200


def assert_fail_code(code):
    assert 200 > code or code >= 400


def test_api_user_add():
    with app.test_client() as c:
        rv = c.post('/api/v1/users', json=dict(
            name='abababa2',
            email='abababa2',
            pwd='abababa2'
        ))
        json_data = rv.get_json()
        print(json_data)
        assert_ok_code(rv.status_code)

        rv = c.delete('/api/v1/users/' + json_data['data']['user_id'])
        json_data = rv.get_json()
        print(json_data)
        assert_ok_code(rv.status_code)


def test_api_user_get():
    with app.test_client() as c:
        rv = c.get('/api/v1/users/5ba611167a8e2551bae466ba')
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
        rv = c.get('/api/v1/users/' + str(_id))
        json_data = rv.get_json()
        print(json_data)
        assert 400 > rv.status_code >= 200

        assert Code.NO_DATA == json_data['code']


def test_api_user_list():
    with app.test_client() as c:
        rv = c.get('/api/v1/users')
        json_data = rv.get_json()
        print(json_data)
        assert 400 > rv.status_code >= 200

        assert Code.OK == json_data['code']
