from api.common import assert_ok_code
from api.restful import app

def test_add():
    scene = {"testUrls": [{
        "method": "GET", "headers": {}, "body": "", "checkPoints": [],
        "thresholds": {
            "sr": 1, "tps": 1, "rt_avg": 1, "rt_99": 1, "rt_95": 1, "rt_90": 1,
            "rt_75": 1, "rt_50": 1},
        "url": "www.baidu.com"}],
        "testModels": [{"sort": 0, "name": "1", "url": "www.baidu.com", "loadRate": 100}],
        "name": "scene 1",
        "threads": 1,
        "connections": 1,
        "durations": 1,
        "timeout": 1,
        "projectId": "1111"}
    with app.test_client() as c:
        rv = c.post('/api/v1/scenes', json=scene)
        json_data = rv.get_json()
        print(json_data)
        assert_ok_code(rv.status_code)
        assert json_data['code'] == 10000
        assert len(json_data['data']['_id']) > 0

        rv = c.delete('/api/v1/projects/' + json_data['data']['_id'])
        json_data = rv.get_json()
        print(json_data)
        assert_ok_code(rv.status_code)


sorts = [{'field1': 1}, {'field2': -1}]
print([(field, direction if direction == 1 else -1)
       for s in sorts for (field, direction) in s.items()])
