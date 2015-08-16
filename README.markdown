# What's it all about
This project started slightly after I bought a sail boat, an Amigo 27 to be precisely.
At the time I bought the boat I did notice that the log (speed indicator) was not working
but that didn't bother me much. There where much, more important things, that needed my
attention. It is a mechanical VDO SumLog. There where two reasons for the log not to function.

1. a broken inner cable
2. a rusted impeller that does not turn

These two causes combined with the fact that replacement parts are hard to get your hands on
and the fact that I had a spare GPS Bluetooth dongle started me thinking. What if I can use
the GPS dongle for determining the speed and have a small (like a Raspberry PI) computer
control a electronic motor that drives the speed gauge?

# Components
I needed some different components to get everything working

## Hardware
* a small computer
* a Bluetooth GPS dongle
* a USB Bluetooth dongle, for connecting the GPS to the computer
* a motor control unit that is capable of driving the electronic motor
* a electronic motor that is capable of runnning at 800-900 RPM with enough torque that will
be attached to the remainder of the inner cable
* a speed sensor for determining the RPM of the electronic motor

## Software
* a program that reads the speed information from the GPS dongle and adjusts the speed of
the electronic motor

# Putting it all together
Back in highschool I played a lot around with electronic components and used a soldering iron
for repairing TVs, radios etc. so with I little luck I should still be able to get the
hardware connected. The software would be the easiest part since I am a software engineer by
trade.

# TODO
* add architectural overview
* add more info to the readme file
* restructure the whole code base
* introduce a NMEA bus to which modules can subribe for receiving messages (events)
