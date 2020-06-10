import json
import sys
from sklearn.neighbors import KNeighborsClassifier

data = json.loads(sys.argv[1])
labels = json.loads(sys.argv[2])
search = json.loads(sys.argv[3])

knn = KNeighborsClassifier(1)
knn.fit(data, labels)
print(knn.predict(search))
