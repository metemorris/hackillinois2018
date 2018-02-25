import time, random
from authentication import Firebase
boop = Firebase()

long = 60.70546
lat = 43.810708

long = []
lat = []
usrId = []
for _ in range(101):
    #lat.append(random.randrange(-90,90))
    #long.append(random.randrange(-180,180))
    lat.append(round(random.uniform(40.115421, 40.117), 6))
    long.append(round(random.uniform(-88.24338, -89.2431), 6))
    usrId.append(str(random.randrange(199)))

i = 0
incr = 0.0001
print(len(lat))
print(len(long))
print(len(usrId))
while True:
    for j in range(100):
        current = (long[j],lat[j])
        if i%2 == 0:
            long[j] = long[j] + incr
            long[j] = round(long[j],6)
        else:
            lat[j] = lat[j]+ incr
            lat[j] = round(lat[j],6)
        boop.addEntry(lat[j], long[j], usrId[j])
    i += 1

    print(current)
    #time.sleep(2)