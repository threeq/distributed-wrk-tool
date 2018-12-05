from api.domain.project import ProjectStorage, Project, ProjectResource
from api.storage.mongo import MgoCrud, MgoDefaultDB
from api.storage.project_resource_storage import ProjectResourceStorageMgo

project_collection = MgoDefaultDB['projects']


class ProjectStorageMgo(MgoCrud, ProjectStorage):

    def __init__(self):
        MgoCrud.__init__(self, project_collection)
        self.project_resource_storage = ProjectResourceStorageMgo()

    def del_resource(self, project_id, resource_id):
        docs = self.project_resource_storage.find({'project_id': project_id, 'resource_id': resource_id})
        if len(docs) == 0:
            return
        docs = docs[0]
        return self.project_resource_storage.delete(docs._id)

    def add_resource(self, project_resource: ProjectResource):
        return self.project_resource_storage.save(project_resource)

    def doc2entity(self, doc):
        return Project(**doc)

    def resources(self, project_id):
        return self.project_resource_storage.find({'project_id': project_id})
