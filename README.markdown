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

## From RPM to knots and visa versa
I run some experiments using a cordless screwdriver for determining the RPM/knots settings.
It turned out to be about 100 RPM per knot :-). 

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

After some nights Googling and browsing the internet I settled decided that I would by the
following hardware:

* a Raspberry PI B+ (small, low powerconsumption, 4 USB ports, capable of running Debian)
* a small Bluetooth dongle
* a powerfull electro motor (capble of running at 13000 RPM and a torque of about 0.15 Nm)
* a AdaFruit PWM board based upon a PCA9685 chip
* a good old power transistor 2N3055 and a zener-diode that will ensure that the voltage that
is supplied to the electro motor will stay constant and within the allowed range
* a power mosfet that will be driven by the AdaFruit board and that will drive the engine
* a IR photomicrosensor that can be used for detecting the RPM of the electro motor

I also bought a USB WiFi dongle that will be used for providing a small local WiFi network.  

## Software
* a program that reads the speed information from the GPS dongle and adjusts the speed of
the electronic motor

Although I am a Java Software Engineer by trade I wanted to use a language that has a less
smaller footprint. After experimenting with Python and NodeJS I chose NodeJS. There are a lot
of modules available for it that integrate with GPSD for example. An other thing that I liked
is the fact that the JavaScript is compiled to native code prior to running by the V8 JavaScript
engine.  

# Putting it all together
Back in highschool I played a lot around with electronic components and used a soldering iron
for repairing TVs, radios etc. so with I little luck I should still be able to get the
hardware connected. The software proved to be quite easy although being used to a statically
typed language is challenging a loosely typed language needs more trial and error then I am
used to. After some experimenting and using the soldering iron after 25 years I had a prototype
that seemed to be working. During the first trials I discovered that the electro motor was
having a difficult time working at low speeds, typically below 200-300 RPM.

# TODO
* add architectural overview
* restructure the whole code base
* introduce a NMEA bus to which modules can subribe for receiving messages (events)
