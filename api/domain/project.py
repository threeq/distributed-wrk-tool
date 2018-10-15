from abc import ABC

from api.domain import Storage, Entity, ApplicationService
from api.common.code_def import Code
from api.common.exception import DomainException


class Project(Entity):
    def __init__(self, **kwargs):
        Entity.__init__(self, **kwargs)

        self.name = kwargs.get("name", None)

    def save(self, storage):
        if self.name is None:
            raise DomainException(Code.NO_DATA, 'project name is empty')

        docs = storage.find_by_filter({'name': self.name})
        if len(docs) != 0:
            raise DomainException(Code.EXIST_DATA, 'project name exist')

        return super().save(storage)


class ProjectStorage(Storage, ABC):
    pass


class ProjectService(ApplicationService):
    def __init__(self, storage: ProjectStorage):
        ApplicationService.__init__(self, storage)
