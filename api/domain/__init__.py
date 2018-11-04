import abc

from tools import time


class Storage:
    @abc.abstractmethod
    def save(self, entity):
        pass

    @abc.abstractmethod
    def get(self, _id):
        pass

    @abc.abstractmethod
    def overwrite(self, entity):
        pass

    @abc.abstractmethod
    def delete(self, _id):
        pass

    @abc.abstractmethod
    def find_by_filter(self, *args, **kwargs):
        pass


class Entity:
    def __init__(self, **kwargs):
        _id = kwargs.get("_id", None)
        self._id = None if _id is None else str(_id)
        self.created = kwargs.get("created", time.now_milli_time())
        self.updated = kwargs.get("updated", time.now_milli_time())

        # 1 ；2 删除
        self.active = kwargs.get("active", 1)

    def id(self):
        return self._id

    def save(self, storage):
        self._id = str(storage.save(self))
        return self

    def delete(self, storage):
        if self.id() is not None:
            storage.delete(self.id())


class ApplicationService:
    def __init__(self, storage):
        self.storage = storage

    def detail(self, _id):
        return self.storage.get(_id)

    def save(self, entity):
        return entity.save(self.storage)

    def find(self, filter=None, sort=None, page=None):
        return self.storage.find(filter=filter, sorts=sort, page=page)

    def delete(self, user_id):
        self.storage.delete(user_id)
