from abc import ABC

from api.base import Entity, Storage
from api.domain.code_def import Code
from api.domain.exception import DomainException


class UserStorage(Storage, ABC):
    pass


class User(Entity):
    """
    用户对象
    """

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)

        self.name = kwargs.get("name", None)
        self.pwd = kwargs.get("pwd", None)
        self.email = kwargs.get("email", None)
        self.phone = kwargs.get("phone", None)
        self.nick_name = kwargs.get("nick_name", None)

    def save(self, storage):

        if self.id() is None and self.phone is None and self.email is None:
            raise DomainException('phone and email cannot be null at same time.')

        only_phone = self.phone is None or self.enable_only_field(storage, {'phone': self.phone})
        only_email = self.email is None or self.enable_only_field(storage, {'email': self.email})

        if not only_phone:
            raise DomainException(Code.EXIST_PHONE)

        if not only_email:
            raise DomainException(Code.EXIST_EMAIL)

        if self.id() is not None and storage.get(self.id()) is None:
            raise DomainException(Code.NO_DATA, 'user not exist')

        return Entity.save(self, storage)

    def enable_only_field(self, storage, field_filter):
        field_objs = storage.find_by_filter(field_filter)
        if self.id() is None and len(field_objs) > 0:
            # 增加校验
            return False

        elif self.id() is not None and len(field_objs) == 0 and field_objs[0].id() != self.id():
            # 修改校验
            return False
        else:
            return True


class UserService:
    def __init__(self, storage):
        self.storage = storage

    def login(self, name, pwd):
        pass

    def register(self, user):
        return user.save(self.storage)
