from api.domain.scene import SceneStorage, Scene
from api.storage.mongo import MgoCrud, MgoDefaultDB

scene_collection = MgoDefaultDB['scenes']


class SceneStorageMgo(MgoCrud, SceneStorage):

    def doc2entity(self, doc):
        return Scene(**doc)

    def __init__(self):
        MgoCrud.__init__(self, scene_collection)
