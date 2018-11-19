from abc import ABC

from api.domain import Entity, Storage, ApplicationService


class Machine(Entity):
    def __init__(self, **kwargs):
        Entity.__init__(self, **kwargs)

        self.name = kwargs.get("name", None)
        self.ip = kwargs.get("ip", None)

    def save(self, storage):
        return super().save(storage)


class MachineStorage(Storage, ABC):
    pass


class MachineService(ApplicationService):
    def __init__(self, storage: MachineStorage):
        ApplicationService.__init__(self, storage)
