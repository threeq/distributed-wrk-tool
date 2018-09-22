from api.domain.user import User
from api.storage.user_storage import UserStorageMgo


def test_user_save():
    storage = UserStorageMgo()
    user = User(name='test', pwd='xxx', phone='123', email='456')

    user.save(storage)
    print(user.id)

    user.delete(storage)


def test_user_update():
    storage = UserStorageMgo()
    user = User(name='insert', pwd='insert', phone='123', email='456')

    user.save(storage)

    assert user.id() is not None
    assert len(user.id()) == 24

    update = User(_id=user.id(), name='update', pwd='update')
    update.save(storage)

    new = storage.get(user.id())
    assert new is not update
    assert new.id() == user.id()
    assert new.name == update.name
    assert new.phone == user.phone
    assert new.email != update.email

    new.delete(storage)
