from api.domain.user import UserStorage, User
from api.storage.mongo import MgoDefaultDB, MgoCrud

user_collection = MgoDefaultDB['users']


class UserStorageMgo(MgoCrud, UserStorage):
    def doc2entity(self, doc):
        return User(**doc)

    def __init__(self):
        MgoCrud.__init__(self, user_collection)
