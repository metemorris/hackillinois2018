from firebase import firebase
class Firebase:
    DATABASE_URL = "https://hackilln-2e7ee.firebaseio.com/"

    def __init__(self):
        self.furr = firebase.FirebaseApplication(self.DATABASE_URL, None)

    def getUsers(self):
        return self.furr.get('/users', None)

    def setUsers(self):
        result = self.furr.post('/strings', data={"whatever":"data"}, params={'print': 'pretty'})
        if result != None:
            return True
        else:
            return False
