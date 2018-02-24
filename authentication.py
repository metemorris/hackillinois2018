import datetime
from firebase import firebase
import pysal
from pysal.cg.kdtree import KDTree

class Firebase:
    DATABASE_URL = "https://hackill-b8ec1.firebaseio.com/"

    def __init__(self):
        self.firebase = firebase.FirebaseApplication(self.DATABASE_URL, None)

    def main(self):
        pass

    def addEntry(self, lat, long,user_id):
        lat = (lat+90)*100000
        long = (long+180)*100000
        lat_long_key = str(int(lat))+'-'+str(int(long))
        dt = datetime.datetime.now()
        if self.isUserActive(user_id):
            self.deleteTimeShit(user_id)
            self.deleteLocation(self.getPastLoc(user_id))

        self.setUser(user_id,lat_long_key)
        self.firebase.put('/location/'+lat_long_key, user_id, data={'loc': user_id})
        self.firebase.post(str(dt.year)+'/'+str(dt.month)+'/'+str(dt.day)+'/'+str(dt.hour)+'/'+user_id,
                           data={'lat': lat, 'long': long, 'locKey':lat_long_key})

    def getTraffic(self,current_point):
        locations_result = self.firebase.get("location",None)
        locations = []
        for i in locations_result:
            locations.append(self.decryptLocation(i))
        tree = KDTree(locations, distance_metric='Arc', radius=pysal.cg.RADIUS_EARTH_MILES)

        # get all points within 1 mile of 'current_point'
        indices = tree.query_ball_point(current_point, 5)
        count = 0
        dt = datetime.datetime.now()
        year = dt.year
        month = dt.month
        day = dt.day
        hour = dt.hour
        result = self.firebase.get(str(year) +'/'+str(month)+'/'+str(day)+'/'+str(hour), None)
        if result == None:
            return 0
        else:
            return len(result)

    def decryptLocation(self,user_id):
        lolz = user_id.split("-")
        lat = lolz[0]
        long = lolz[1]
        lat = (float(lat)/100000)-90
        long = (float(long)/100000)-180
        return (lat,long)

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
        print(obj)
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

    def getPastLoc(self,userId):
        result = self.firebase.get('user/'+userId, None)
        return list(result.keys())[0]
