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

    def id_wrapper(self, _id):
        return ObjectId(_id)

    def delete(self, _id):
        result = self.collection.delete_one({'_id': ObjectId(_id)})
        return result

    def find(self, search=None, sorts=None, page=None):
        """
        - `filter` 过滤参数
        - `sorts` 排序参数 [{'field1':1}, {'field2':-1}]
           1: 正序；-1: 倒序
        - `page` 分页参数 { num: 1, size: 10 }
           num: 页数
           size: 页大小
        :param search:
        :param sorts:
        :param page:
        :return:
        """

        # 过滤
        docs = self.collection.find(search)

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

    def count(self, search=None):
        return self.collection.count_documents(search)

    def save(self, entity):
        data = {k: v for k, v in vars(entity).items() if v is not None}  # loginStatus.__dict__

        return self.__do_write(entity.id(), data)

    def get(self, _id):
        doc = self.collection.find_one({'_id': ObjectId(_id)})

        return self.doc2entity(doc) if doc is not None else None

    def overwrite(self, entity):
        data = vars(entity)

        return self.__do_write(entity.id(), data)

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
