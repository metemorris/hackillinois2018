import datetime
from firebase import firebase
import pysal
from pysal.cg.kdtree import KDTree

class Firebase:
    DATABASE_URL = "https://hackill-b8ec1.firebaseio.com/"

    def __init__(self):
        self.firebase = firebase.FirebaseApplication(self.DATABASE_URL, None)


    def getTraffic(self,lat,long):
        locations_result = self.firebase.get("location",None)
        locations = []
        for i in locations_result:
            locations.append(self.decryptLocation(i))
        tree = KDTree(locations, distance_metric='Arc', radius=pysal.cg.RADIUS_EARTH_MILES)
        current_point = (41.83590, -87.624950)
        # get all points within 1 mile of 'current_point'
        indices = tree.query_ball_point(current_point, 5)
        count = 0
        dt = datetime.datetime.now()
        year = dt.year
        month = dt.month
        day = dt.day
        hour = 4#dt.hour
        result = self.firebase.get(str(year) +'/'+str(month)+'/'+str(day)+'/'+str(hour), None)
        print(len(result))



    def decryptLocation(self,user_id):
        lolz = user_id.split("-")
        lat = lolz[0]
        long = lolz[1]
        lat = (float(lat)/100000)-90
        long = (float(long)/100000)-180
        return (lat,long)

    def addUser(self, lat, long):
        lat = (lat+90)*10000
        long = (long+180)*10000
        user_id = str(int(lat))+'-'+str(int(long))
        result = self.firebase.put(('/location'), user_id,data={'loc':user_id})


# test
boop = Firebase() # initialize the firebase
boop.getTraffic(40,60)
#boop.decryptLocation("1306747-1061907")