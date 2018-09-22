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
