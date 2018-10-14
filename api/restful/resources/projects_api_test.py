from api.common import assert_ok_code
from api.restful import app


def test_api_project_add():
    with app.test_client() as c:
        rv = c.post('/api/v1/projects', json=dict(
            name='abababa2',
        ))
        json_data = rv.get_json()
        print(json_data)
        assert_ok_code(rv.status_code)
        assert json_data['code'] == 10000
        assert len(json_data['data']['_id']) > 0

        rv = c.delete('/api/v1/projects/' + json_data['data']['_id'])
        json_data = rv.get_json()
        print(json_data)
        assert_ok_code(rv.status_code)
