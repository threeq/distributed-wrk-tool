from abc import ABC

from api.common.code_def import Code
from api.common.exception import DomainException
from api.domain import Entity, Storage, ApplicationService


class Scene(Entity):
    def __init__(self, **kwargs):
        Entity.__init__(self, **kwargs)

        self.name = kwargs.get('name', None)
        self.projectId = kwargs.get('projectId', None)

        self.threads = int(kwargs.get('threads', None))
        self.connections = int(kwargs.get('connections', None))
        self.durations = int(kwargs.get('durations', None))
        self.timeout = int(kwargs.get('timeout', None))
        self.script = kwargs.get('script', None)

        self.testUrls = kwargs.get("testUrls", None)
        self.testModels = kwargs.get("testModels", None)

    def save(self, storage):
        if self.name is None:
            raise DomainException(Code.NO_DATA, 'scene name is empty')

        if self.projectId is None:
            raise DomainException(Code.NO_DATA, 'project id is empty')

        return super().save(storage)


class SceneStorage(Storage, ABC):
    pass


class SceneService(ApplicationService):
    def __init__(self, storage: SceneStorage):
        ApplicationService.__init__(self, storage)
