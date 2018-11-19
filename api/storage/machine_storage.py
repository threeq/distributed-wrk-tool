from api.domain.machine import MachineStorage, Machine
from api.storage.mongo import MgoCrud, MgoDefaultDB

machine_collection = MgoDefaultDB['machines']


class MachineStorageMgo(MgoCrud, MachineStorage):

    def doc2entity(self, doc):
        return Machine(**doc)

    def __init__(self):
        MgoCrud.__init__(self, machine_collection)
