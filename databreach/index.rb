
# this code will grad wiki whole page
require 'open-uri'
require 'net/http'

starting = Process.clock_gettime(Process::CLOCK_MONOTONIC)

url = 'https://www.youtube.com/' 
# "https://github.com/Zain-ul-din/Algo-and-Data-Structures-Road-Map"

uri = URI.parse(url)

response = Net::HTTP.get_response(uri)
html = response.body

puts html

ending = Process.clock_gettime(Process::CLOCK_MONOTONIC)
elapsed = ending - starting

puts '\n Ruby took time in sec : '
puts elapsed