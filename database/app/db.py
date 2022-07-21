import mysql.connector

class database:
    def __init__(self):
        self.db = None
        
    def __def__(self):
        self.disconnect()
    
    def connect_db(self):
        self.db = mysql.connector.connect(
            user="root",
            password="password",
            database="twonedb",
            host= "db",
            buffered=True
        )
    
    def disconnect_db(self):
        if self.db != None:
            self.db.disconnect();
            self.db.shutdown();
        self.db = None
        
    def query(self, sql, params=None):
        if self.db == None:
            self.connect_db()
        cursor = self.db.cursor(dictionary=True)
        cursor.execute(sql, params)
        return cursor.fetchall()
    
    def commit(self):
        self.db.commit();