import datetime
from firebase import firebase
class Firebase:
    DATABASE_URL = "https://hackill-b8ec1.firebaseio.com/"

    def __init__(self):
        self.firebase = firebase.FirebaseApplication(self.DATABASE_URL, None)

    def addEntry(self, lat, long):
        lat = (lat+90)*100000
        long = (long+180)*100000
        user_id = str(int(lat))+'-'+str(int(long))
        dt = datetime.datetime.now()
        self.firebase.put('/location', user_id, data={'loc': user_id})
        self.firebase.post(str(dt.year)+'/'+str(dt.month)+'/'+str(dt.day)+'/'+str(dt.hour)+'/'+user_id,
                           data={'lat': lat, 'long': long})


boop = Firebase()
locations = [(41.835461, -87.624957),
             (41.835593, -87.624914),
             (41.835673, -87.625193),
             (41.835194, -87.625108),
             (41.835082, -87.624893),
             (60.70546, -43.810708),
             (90.709179, -53.820574)]

for i in locations:
    boop.addEntry(i[0], i[1])
