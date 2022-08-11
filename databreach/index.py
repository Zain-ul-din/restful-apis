#hello
import requests
import time

start = time.time()

# https://github.com/Zain-ul-din/Algo-and-Data-Structures-Road-Map'


print ('start')
url = '' # checkout

res = requests.get (url)

end = time.time()
print (res.content)
print( 'Python took time in sec : ' , end - start)



