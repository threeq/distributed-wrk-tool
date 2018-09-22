import datetime

import bson

from api.domain.user import User
from api.storage.user_storage import UserStorageMgo


def test_get_user():
    storage = UserStorageMgo()

    user = storage.get('5ba5e8c27a8e2546cb774dd6')

    print(vars(user))
    assert isinstance(user, User)
    assert len(user.name) > 0

    gen_time = datetime.datetime(1992, 1, 1)
    user = storage.get(bson.ObjectId.from_datetime(gen_time))
    assert user is None
