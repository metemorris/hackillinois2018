import pyodbc
server='walkablebiserver1.database.windows.net'
database='walkable'
username='walkable'
password='walkhere123!'
driver='{ODBC Driver 13 for SQL Server}'
cnxn = pyodbc.connect('DRIVER='+driver+';PORT=1433;SERVER='+server+';PORT=1443;DATABASE='+database+';UID='+username+';PWD='+ password)
cursor = cnxn.cursor()
cursor.execute("INSERT INTO incident VALUES (40.7666,-90.8888, 'trash','2016-02-12 00:00:00')")
cursor.execute("INSERT INTO traffic VALUES ('aqueel', 40.7666,-90.8888, '2016-02-12 00:00:00')")
cnxn.commit()