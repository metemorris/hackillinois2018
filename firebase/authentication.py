import datetime
from firebase import firebase
class Firebase:
    DATABASE_URL = "https://hackill-b8ec1.firebaseio.com/"

    def __init__(self):
        self.firebase = firebase.FirebaseApplication(self.DATABASE_URL, None)

    def getUsers(self):
        return self.firebase.get('/users', None)

    def setUsers(self):
        result = self.firebase.post('/2018/02/24/00/40', data={"fucku":"hamza"}, params={'print': 'pretty'})
        if result != None:
            return True
        else:
            return False

    def addEntry(self, lat, long):
        lat = (lat+90)*10000
        long = (long+180)*10000
        user_id = str(int(lat))+'-'+str(int(long))
        dt = datetime.datetime.now()
        self.firebase.put('/location', user_id, data={'loc': user_id})
        self.firebase.post(str(dt.year)+'/'+str(dt.month)+'/'+str(dt.day)+'/'+str(dt.hour)+'/'+user_id,
                           data={'lat': lat, 'long': long})


boop = Firebase()
boop.setUsers()
boop.addEntry(76.3, -77)
