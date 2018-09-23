import pymongo

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["test-cloud"]

user_collection = mydb['user']
project_collection = mydb['project']


class MongoCrud:
    def __init__(self, collection):
        self.collection = collection
