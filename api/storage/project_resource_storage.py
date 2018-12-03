from api.domain.project import ProjectResource
from api.storage.mongo import MgoCrud, MgoDefaultDB

project_resources_collection = MgoDefaultDB['project_resources']


class ProjectResourceStorageMgo(MgoCrud):
    def __init__(self):
        MgoCrud.__init__(self, project_resources_collection)

    def doc2entity(self, doc):
        return ProjectResource(**doc)
