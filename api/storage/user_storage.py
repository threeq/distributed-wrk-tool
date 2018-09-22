from bson import ObjectId

from api.storage.mongo import user_collection
from api.domain.user import UserStorage, User


class UserStorageMgo(UserStorage):
    def delete(self, _id):
        result = user_collection.delete_one({'_id': ObjectId(_id)})
        print(result)

    def find_by_filter(self, *args, **kwargs):
        docs = user_collection.find(*args)
        return [User(**doc) for doc in docs]

    def save(self, user):
        data = {k: v for k, v in vars(user).items() if v is not None}  # user.__dict__

        return self.__do_write(user.id(), data)

    def get(self, user_id):
        doc = user_collection.find_one({'_id': ObjectId(user_id)})

        return User(**doc) if doc is not None else None

    def overwrite(self, user):
        data = vars(user)

        return self.__do_write(user.id(), data)

    @staticmethod
    def __do_write(_id, data):
        if _id is None:
            result = user_collection.insert_one(data)
            return str(result.inserted_id)
        else:
            del data['_id']
            del data['created']
            result = user_collection.update({
                '_id': ObjectId(_id)
            }, {
                '$set': data
            }, upsert=False)
            # TODO 需要判断 result 成功与否

            return _id
