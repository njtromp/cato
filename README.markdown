# What's it all about
This project started slightly after I bought a sail boat, an Amigo 27 to be precisely.
At the time I bought the boat I did notice that the log (speed indicator) was not working
but that didn't bother me much. There where much, more important things, that needed my
attention. It is a mechanical VDO SumLog. There where two reasons for the log not to function.

1 a broken inner cable
2 a rusted impeller that does not turn

These two causes combined with the fact that replacement parts are hard to get your hands on
and the fact that I had a spare GPS Bluetooth dongle started me thinking. What if I can use
the GPS dongle for determining the speed and have a small (Raspberry PI) computer control a
electronic motor that drives the speed gauge?
# Components
I needed some different components that get everything working
## Hardware
* a small computer
* a USB Bluetooth dongle
* a motor power control
* a speed sensor for determining the RPM of the electronic motor 

## Software
* a program that reads the speed information from the GPS dongle and adjusts the speed of
the electronic motor.

# Putting it all together
Back In highschool I played a lot around with electronic components and used a soldering iron
for repairing TVs, radios etc. The software would be the easiest part since I am a software
engineer by trade.  

# TODO
* add architectural overview
* add more info to the readme file
* restructure the whole code base
* Introduce a NMEA bus to which modules can subribe for receiving messages (events)
