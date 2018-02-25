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
    lat.append(round(random.uniform(40.101252,40.105979), 6))
    long.append(round(random.uniform(-88.238295,-88.234862, ), 6))
    usrId.append(str(random.randrange(199)))

i = 0
incr = 0.0001
print(len(lat))
print(len(long))
print(len(usrId))

types = ["construction",
"crime",
"event",
"food",
"hazard",
"trash"]

while True:
    for j in range(100):
        print(j)
        rand = random.randrange(10)
        typeNum = random.randrange(len(types))
        current = (long[j],lat[j])
        if i%2 == 0:
            long[j] = long[j] + incr
            long[j] = round(long[j],6)
        else:
            lat[j] = lat[j]+ incr
            lat[j] = round(lat[j],6)
        if rand == 1:
            boop.addIncident(lat[j],long[j],types[typeNum])
        boop.addEntry(lat[j], long[j], usrId[j])
    i += 1

    print(current)
    #time.sleep(2)