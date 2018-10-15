from abc import ABC

from api.common.code_def import Code
from api.common.exception import DomainException
from api.domain import Entity, Storage, ApplicationService


class Scene(Entity):
    def __init__(self, **kwargs):
        Entity.__init__(self, **kwargs)

        self.name = kwargs.get('name', None)
        self.project_id = kwargs.get('project_id', None)

    def save(self, storage):
        if self.name is None:
            raise DomainException(Code.NO_DATA, 'scene name is empty')

        if self.project_id is None:
            raise DomainException(Code.NO_DATA, 'project id is empty')

        return super().save(storage)


class SceneStorage(Storage, ABC):
    pass


class SceneService(ApplicationService):
    def __init__(self, storage: SceneStorage):
        ApplicationService.__init__(self, storage)
