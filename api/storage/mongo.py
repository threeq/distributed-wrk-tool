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

    def find(self, filter=None, sorts=None, page=None):
        """
        - `filter` 过滤参数
        - `sorts` 排序参数 [{'field1':1}, {'field2':-1}]
           1: 正序；-1: 倒序
        - `page` 分页参数 { num: 1, size: 10 }
           num: 页数
           size: 页大小
        :param filter:
        :param sorts:
        :param page:
        :return:
        """

        # 过滤
        docs = self.collection.find(filter)

        # 排序
        if sorts is not None:
            sorts = [(field, direction if direction == pymongo.ASCENDING else pymongo.DESCENDING)
                     for s in sorts for (field, direction) in s.items()]
            docs = docs.sort(sorts)

        # 分页
        if page is not None:
            page_num = page.num if page.num >= 1 else 1
            offset = (page_num - 1) * page.size
            docs = docs.skip(offset).limit(page.size)

        return [self.doc2entity(doc) for doc in docs]

    def count(self, filter=None):
        return self.collection.count_documents(filter)

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
