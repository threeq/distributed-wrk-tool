import abc

import pymongo
from bson import ObjectId

MgoClient = pymongo.MongoClient("mongodb://localhost:27017/")
MgoDefaultDB = MgoClient["test-cloud"]


class MgoCrud:
    def __init__(self, collection):
        self.collection = collection

    @abc.abstractmethod
    def doc2entity(self, doc):
        pass

    def delete(self, _id):
        result = self.collection.delete_one({'_id': ObjectId(_id)})
        return result

    def find_by_filter(self, *args, **kwargs):
        docs = self.collection.find(*args)
        return [self.doc2entity(doc) for doc in docs]

    def save(self, user):
        data = {k: v for k, v in vars(user).items() if v is not None}  # loginStatus.__dict__

        return self.__do_write(user.id(), data)

    def get(self, user_id):
        doc = self.collection.find_one({'_id': ObjectId(user_id)})

        return self.doc2entity(doc) if doc is not None else None

    def overwrite(self, user):
        data = vars(user)

        return self.__do_write(user.id(), data)

    def __do_write(self, _id, data):
        if _id is None:
            result = self.collection.insert_one(data)
            return str(result.inserted_id)
        else:
            del data['_id']
            del data['created']
            result = self.collection.update({
                '_id': ObjectId(_id)
            }, {
                '$set': data
            }, upsert=False)
            # TODO 需要判断 result 成功与否

            return _id
