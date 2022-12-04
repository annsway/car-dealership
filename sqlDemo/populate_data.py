# Ref: https://pynative.com/python-mysql-database-connection/
# https://github.com/awesome5team/General-Resources-Box/issues/7
import mysql.connector
from mysql.connector import Error
import os

try:
    conn = mysql.connector.connect(
        host = 'localhost',
        database = 'cs6400_fa21_team012',
        user='root',
        password='Qwertyuiop$123'
    )
    if conn.is_connected():
        db_info = conn.get_server_info()
        print("Connected to MySQL Server version ", db_info)
        cursor = conn.cursor()

        folder = 'sqlDemo'

        names = []
        for filename in os.listdir(folder):
            if filename.endswith('.sql'):
                names.append(filename)
        names = sorted(names)

        for filename in names:
            print("Loading file..." + filename)
            fd = open(folder + "/" + filename, "r")
            sqlFile = fd.read()
            fd.close()
            sqlCommands = sqlFile.split(";")

            for command in sqlCommands:
                try:
                    if command.strip() != "":
                        cursor.execute(command)
                        conn.commit()
                        # print(command)
                        # print("++++++++++")
                except IOError as msg:
                    print("Command skipped: ", msg)

except Error as e:
    print("Error while connencting to MySQL ", e)

finally:
    if conn.is_connected():
        cursor.close()
        conn.close()
        print("MySQL connection is closed")