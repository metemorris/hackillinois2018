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

# test
boop = Firebase() # initialize the firebase
boop.setUsers() 
