from pymongo import MongoClient
from pathlib import Path
import os
from datetime import datetime
import logging
import sys
sys.path.append(Path.cwd())
from logger_setup import logger

#db_name = imageDatabase
#collection_name = salamander_drop

class Mongo:
    def __init__(self, db_name:str, collection_name: str):
        self.db_name = db_name
        self.collection_name = collection_name
        self.client= None
        self.db = None
        self.collection = None
        self.attach()
        if self.client:
            self.get_db()
            self.get_collection()
    def attach(self):
        try:
            self.client = MongoClient(os.environ['MONGO_URI'])
            logger.debug(f'successfully connected to logger client at {os.environ["MONGO_URI"]}')
        except Exception as e:
            logger.error(f'failed to connect to logger client error: {e}')
    def get_db(self):
        if self.db_name not in self.client.list_database_names():
            self.client.admin.command("createDatabase", self.db_name)
        self.db = self.client[self.db_name]
        logger.debug(f'logger database loaded: {self.db_name}')
    def get_collection(self):
        if self.collection_name not in self.db.list_collection_names():
            self.collection = self.db.create_collection(self.collection_name)
        else:
            self.collection = self.db[self.collection_name]
        logger.debug(f'logger collection loaded: {self.collection_name}')
    def add_dataset(self, imageData: dict, imageSetData: dict):
        # compile data entry
        data_entry = {
            "imageData":imageData,
            "imageSetData":imageSetData,
            "dateTime":datetime.now()
            }
        logger.info(f'insert data entry: {data_entry["imageSetData"]}')
        try:
            # self.collection add data entry
            insert_id = self.collection.insert_one(data_entry)
            logger.debug(f'data entry insert succeeded, insert id: {insert_id}')
        except Exception as e:
            logger.error(f'failed to insert data_entry into collection error: {e}')

    
if __name__ == "__main__":
    db_name = "imageDatabase"
    collection_name = "salamander_drop"
    mongo = Mongo(db_name, collection_name)
    mongo.add_dataset({},{})

