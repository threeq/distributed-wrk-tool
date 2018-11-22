from abc import ABC

from api.common.code_def import Code
from api.common.exception import DomainException
from api.domain import Entity, Storage, ApplicationService


class Machine(Entity):
    def __init__(self, **kwargs):
        Entity.__init__(self, **kwargs)

        self.name = kwargs.get("name", None)
        self.type = kwargs.get("type", None)
        self.ip = kwargs.get("ip", None)
        self.parent = kwargs.get("parent", None)

    def save(self, storage):
        if self.name is None:
            raise DomainException(Code.NO_DATA, 'machine name is empty')
        if self.ip is None:
            raise DomainException(Code.NO_DATA, 'machine ip is empty')
        if self.type is None:
            raise DomainException(Code.NO_DATA, 'machine type is empty')

        docs = storage.find({'name': self.name})
        if len(docs) != 0:
            raise DomainException(Code.EXIST_DATA, 'machine name exist')

        docs = storage.find({'ip': self.ip, 'type': self.type})
        if len(docs) != 0:
            raise DomainException(Code.EXIST_DATA, 'machine ip exist')

        if self.type is 0:
            docs = storage.find({'type': self.type})
            if len(docs) != 0:
                raise DomainException(Code.EXIST_DATA, 'root monitor node exist')

        return super().save(storage)


class MachineStorage(Storage, ABC):
    pass


class MachineService(ApplicationService):
    def __init__(self, storage: MachineStorage):
        ApplicationService.__init__(self, storage)
