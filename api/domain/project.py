import abc
from abc import ABC

from api.domain import Storage, Entity, ApplicationService
from api.common.code_def import Code
from api.common.exception import DomainException
from api.domain.machine import MachineStorage


class Project(Entity):
    def __init__(self, **kwargs):
        Entity.__init__(self, **kwargs)

        self.name = kwargs.get("name", None)

    def save(self, storage):
        if self.name is None:
            raise DomainException(Code.NO_DATA, 'project name is empty')

        docs = storage.find({'name': self.name})
        if len(docs) != 0:
            raise DomainException(Code.EXIST_DATA, 'project name exist')

        return super().save(storage)


class ProjectResource(Entity):
    def __init__(self, **kwargs):
        Entity.__init__(self, **kwargs)

        self.project_id = kwargs.get("project_id", None)
        self.resource_id = kwargs.get("resource_id", None)


class ProjectStorage(Storage, ABC):

    @abc.abstractmethod
    def resources(self, project_id):
        pass

    @abc.abstractmethod
    def add_resource(self, project_resource: ProjectResource):
        pass

    @abc.abstractmethod
    def del_resource(self, project_id, resource_id):
        pass


class ProjectService(ApplicationService):
    def __init__(self, storage: ProjectStorage, machine_storage: MachineStorage):
        ApplicationService.__init__(self, storage)
        self.machineStorage = machine_storage

    def project_resource(self, project_id):
        resourceIds = self.storage.resources(project_id)
        if len(resourceIds) == 0:
            return []

        machineIds = [self.machineStorage.id_wrapper(item.resource_id) for item in resourceIds]
        return self.machineStorage.find({"_id": {"$in": machineIds}})

    def add_resource(self, project_resource: ProjectResource):
        # TODO 判断是否重复
        return self.storage.add_resource(project_resource)

    def del_resource(self, project_id, resource_id):
        return self.storage.del_resource(project_id, resource_id)
