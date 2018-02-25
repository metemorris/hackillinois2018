import datetime, random
from firebase import firebase
import pysal
from pysal.cg.kdtree import KDTree
import pyodbc

class Firebase:
    DATABASE_URL = "https://hackill-b8ec1.firebaseio.com/"

    def __init__(self):
        self.firebase = firebase.FirebaseApplication(self.DATABASE_URL, None)

    def main(self):
        pass

    def addEntry(self, lat, long,user_id):
        oldLat = lat
        oldLong = long
        lat = (lat+90)*100000
        long = (long+180)*100000
        lat_long_key = str(int(lat))+'-'+str(int(long))
        dt = datetime.datetime.now()
        if self.isUserActive(user_id):
            self.deleteTimeShit(user_id)
            self.deleteLocation(self.getPastLoc(user_id))
            self.deleteUser(user_id)
        self.setUser(user_id,lat_long_key)
        self.firebase.put('/location/'+lat_long_key, user_id, data={'loc': user_id})
        self.firebase.post(str(dt.year)+'/'+str(dt.month)+'/'+str(dt.day)+'/'+str(dt.hour)+'/'+user_id,
                           data={'lat': lat, 'long': long, 'locKey':lat_long_key})

        server = 'walkablebiserver1.database.windows.net'
        database = 'walkable'
        username = 'walkable'
        password = 'walkhere123!'
        driver = '{ODBC Driver 13 for SQL Server}'
        cnxn = pyodbc.connect(
            'DRIVER=' + driver + ';PORT=1433;SERVER=' + server + ';PORT=1443;DATABASE=' + database + ';UID=' + username + ';PWD=' + password)
        cursor = cnxn.cursor()
        user_id = str(user_id)

        cursor.execute("INSERT INTO traffic VALUES (?,?,?,?)",(user_id,oldLat,oldLong,dt))
        cnxn.commit()

    def getIncidents(self,current_point):
        incident_result = self.firebase.get("incident", None)
        #print(incident_result)
        locations = []
        for i in incident_result:
            #print(i)
            locations.append(self.decryptLocation(i))
        #print(locations)
        tree = KDTree(locations, distance_metric='Arc', radius=pysal.cg.RADIUS_EARTH_MILES)

        # get all points within 1 mile of 'current_point'
        indices = tree.query_ball_point(current_point, 5)
        locationList = []
        for i in indices:
            key = self.encryptLocation(locations[i])
            locationStuff = dict()
            locationStuff['lat'] = locations[i][0]
            locationStuff['lng'] = locations[i][1]
            types = list(incident_result[key].keys())
            locationStuff['type'] = types[0]
            locationList.append(locationStuff)

        return locationList

    def addIncident(self, lat, long,type):
        oldLat = lat
        oldLong = long
        lat = (lat+90)*100000
        long = (long+180)*100000
        lat_long_key = str(int(lat))+'-'+str(int(long))
        dt = datetime.datetime.now()
        self.firebase.put('/incident/'+lat_long_key, type, data={'loc': type})
        self.firebase.post('/incidentType/'+type,
                           data={'lat': lat, 'long': long, 'locKey':lat_long_key, 'type': type})
        server = 'walkablebiserver1.database.windows.net'
        database = 'walkable'
        username = 'walkable'
        password = 'walkhere123!'
        driver = '{ODBC Driver 13 for SQL Server}'
        cnxn = pyodbc.connect(
            'DRIVER=' + driver + ';PORT=1433;SERVER=' + server + ';PORT=1443;DATABASE=' + database + ';UID=' + username + ';PWD=' + password)
        cursor = cnxn.cursor()
        cursor.execute("INSERT INTO incident VALUES (?,?, ?,?)",(oldLat,oldLong,type,dt))
        cnxn.commit()

    def getTraffic(self,current_point):
        locations_result = self.firebase.get("location", None)
        #print(locations_result)
        locations = []
        for i in locations_result:
            locations.append(self.decryptLocation(i))
        #print(locations)
        tree = KDTree(locations, distance_metric='Arc', radius=pysal.cg.RADIUS_EARTH_MILES)

        # get all points within 1 mile of 'current_point'
        indices = tree.query_ball_point(current_point, 5)
        #print(indices)
        count = 0
        dt = datetime.datetime.now()
        year = dt.year
        month = dt.month
        day = dt.day
        hour = dt.hour

        userid = []

        for i in indices:
            key = self.encryptLocation(locations[i])
            if key in locations_result:
                if isinstance(locations_result[key],dict):
                    userId = list(locations_result[key].keys())[0]
                    result = self.firebase.get(str(year) +'/'+str(month)+'/'+str(day)+'/'+str(hour) + '/' +userId, None)
                    if result != 0:
                        count += 1
        return count

    def getCrazyHeat(self,lat,lng):
        current_point = (lat,lng)
        locations_result = self.firebase.get("location", None)
        # print(locations_result)
        locations = []
        for i in locations_result:
            locations.append(self.decryptLocation(i))
        # print(locations)
        tree = KDTree(locations, distance_metric='Arc', radius=pysal.cg.RADIUS_EARTH_MILES)
        # get all points within 1 mile of 'current_point'
        indices = tree.query_ball_point(current_point, 40)
        # print(indices)
        count = 0
        dt = datetime.datetime.now()
        year = dt.year
        month = dt.month
        day = dt.day
        hour = dt.hour
        userid = []

        locationDict1 = dict()
        locationDict2 = dict()
        locationDict3 = dict()
        locationDict4 = dict()
        locationArr = []
        if len(indices) != 0:

            loc1 = random.randrange(len(indices))
            loc2 = random.randrange(len(indices))
            loc3 = random.randrange(len(indices))
            loc4 = random.randrange(len(indices))

            key1 = locations[indices[loc1]]
            key2 = locations[indices[loc2]]
            key3 = locations[indices[loc3]]
            key4 = locations[indices[loc4]]

            locationDict1['lat'] = key1[0]
            locationDict1['lng'] = key1[1]
            locationDict1['heat'] = self.getTraffic(key1)

            locationDict2['lat'] = key2[0]
            locationDict2['lng'] = key2[1]
            locationDict2['heat'] = self.getTraffic(key2)

            locationDict3['lat'] = key3[0]
            locationDict3['lng'] = key3[1]
            locationDict3['heat'] = self.getTraffic(key3)

            locationDict4['lat'] = key4[0]
            locationDict4['lng'] = key4[1]
            locationDict4['heat'] = self.getTraffic(key4)
            locationArr.append(locationDict1)
            locationArr.append(locationDict2)
            locationArr.append(locationDict3)
            locationArr.append(locationDict4)
        return locationArr

    def getEveryonePoits(self,current_point):
        locations_result = self.firebase.get("location", None)
        # print(locations_result)
        locations = []
        for i in locations_result:
            locations.append(self.decryptLocation(i))
        # print(locations)
        tree = KDTree(locations, distance_metric='Arc', radius=pysal.cg.RADIUS_EARTH_MILES)
        # get all points within 1 mile of 'current_point'
        indices = tree.query_ball_point(current_point, 40)

        usrIds = []
        for i in indices:
            lolz = self.encryptLocation(locations[i])
            if lolz in locations_result:
                if isinstance(locations_result[lolz], dict):
                    #print(locations_result[lolz])
                    booz = list(locations_result[lolz].keys())[0]
                    usrIds.append(booz)
        user_result = self.firebase.get("user",None)

        finalAns = []
        for i in usrIds:
            kiss = user_result[i].keys()
            for i in kiss:
                longLatDic = dict()
                loc = self.decryptLocation(i)
                longLatDic['lat'] = loc[0]
                longLatDic['lng'] = loc[1]
                finalAns.append(longLatDic)
        return finalAns


    def decryptLocation(self,user_id):
        lolz = user_id.split("-")
        lat = lolz[0]
        long = lolz[1]
        lat = round((float(lat)/100000)-90,6)
        long = round((float(long)/100000)-180,6)
        return (lat,long)

    def encryptLocation(self,latLong):
        lat,long = latLong[0],latLong[1]
        lat = round((lat + 90) * 100000,6)
        long = round((long + 180) * 100000,6)
        return str(int(lat)) + '-' + str(int(long))

    def getSomeShit(self):
        dt = datetime.datetime.now()
        year = dt.year
        month = dt.month
        day = dt.day
        hour = dt.hour
        user = "1"
        result = self.firebase.get(str(year) + '/' + str(month) + '/' + str(day) + '/' + str(hour) + '/' + user, None)
        key = list(result.keys())[0]
        obj = result[key]
        #print(obj)
        self.deleteLocation(obj["locKey"])
        self.deleteTimeShit(user)

    def deleteLocation(self,locKey):
        self.firebase.delete("location",locKey)

    def deleteTimeShit(self,userId):
        dt = datetime.datetime.now()
        year = dt.year
        month = dt.month
        day = dt.day
        hour = dt.hour
        self.firebase.delete(str(year) + '/' + str(month) + '/' + str(day) + '/' + str(hour),userId)

    def isUserActive(self, userId):
        result = self.firebase.get('user/' + userId,None)
        if result == None:
            return False
        else:
            return True

    def setUser(self,userId,locKey):
        self.firebase.put('user/' + userId,locKey,data={'boop':'boop'})

    def deleteUser(self,userId):
        self.firebase.delete('user/' + userId,None)

    def getPastLoc(self,userId):
        result = self.firebase.get('user/'+userId, None)
        return list(result.keys())[0]
