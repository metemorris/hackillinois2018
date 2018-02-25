from authentication import Firebase
boop = Firebase()

incident_locations = [(41.835461, -87.624957),
             (41.835593, -87.624914),
             (41.835673, -87.625193),
             (41.835194, -87.625108),
             (41.835082, -87.624893),
             (60.70546, -43.810708),
             (90.709179, -53.820574)]


locations = [(41.835461, -87.624957),
             (41.835593, -87.624914),
             (41.835673, -87.625193),
             (41.835194, -87.625108),
             (41.835082, -87.624893),
             (60.70546, -43.810708),
             (90.709179, -53.820574)]

users = ["18","2","3","4","5","6","7"]

for y,i in enumerate(locations):
    boop.addIncident(i[0], i[1],"trash")
# test

print(boop.getIncidents((41.835461, -87.624957)))
data = [(41.835461, -87.624957),
     (41.835593, -87.624914),
     (41.835673, -87.625193),
     (41.835194, -87.625108),
     (41.835082, -87.624893),
     (41.835082, -87.624893),
     (60.70546, -43.810708),
     (90.709179, -53.820574)]

print(boop.getTraffic((60.70546, -43.810708)))
print(boop.isUserActive("1"))
