from pymongo import MongoClient
from pathlib import Path
import os
from datetime import datetime
import logging
from .logger_setup import logger
#from logger_setup import logger
#db_name = imageDatabase
#collection_name = salamander_drop

class Mongo:
    def __init__(self, db_name:str, collection_name: str):
        self.db_name = db_name
        self.collection_name = collection_name
        self.client= None
        self.db = None
        self.collection = None

        self.get_collection()

    
    def attach_to_client(self):
        try:
            mongo_uri = os.environ['MONGO_URI']
            username = os.environ['MONGO_USERNAME']
            password = os.environ['MONGO_PASSWORD']
            service = os.environ["MONGO_SERVICE_NAME"]
            port = os.environ["MONGO_PORT"]
            db_name = os.environ["DATABASE_NAME"]

            uri = f'mongodb://{username}:{password}@{service}:{port}/{db_name}'
            self.client = MongoClient(uri)
            #self.client = MongoClient(os.environ['MONGO_URI'])
            logger.debug(f'successfully connected to logger client at {os.environ["MONGO_URI"]}')
        except Exception as e:
            logger.error(f'failed to connect to logger client error: {e}')
    def get_db(self):
        try:
            self.db = self.client[self.db_name]
            logger.debug(f'logger database loaded: {self.db_name}')
        except Exception as e:
            logger.error(f'couldnt connect to database error: {e}')
        #if self.db_name not in self.client.list_database_names():
        #    self.db = self.client[self.db_name]
        
    
    def attach(func):
        def wrapper(self, *args, **kwargs):
            if self.db is None:
                self.attach_to_client()
                self.get_db()
            return func(self, *args, **kwargs)
        return wrapper
     
    @attach
    def get_collection(self):
        if self.collection_name not in self.db.list_collection_names():
            self.collection = self.db.create_collection(self.collection_name)
        else:
            self.collection = self.db[self.collection_name]
        logger.debug(f'logger collection loaded: {self.collection_name}')
    
    @attach
    def add_dataset(self, imageData: dict, imageSetData: dict, imageAttributes: dict):
        # compile data entry
        data_entry = {
            "imageData":imageData,
            "imageAttributes":imageAttributes,
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

