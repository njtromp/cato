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
* a speed sensor for determining the RPM of the electronic motor (needed for feedback loop)

After some Googling and browsing the internet I come to the following shoppinglist:

* a Raspberry PI B+ (small, low power consumption, 4 USB ports, capable of running Debian)
* a small Bluetooth dongle
* a powerfull electro motor (capble of running at 13000 RPM and a torque of about 0.15 Nm)
* a AdaFruit PWM board based upon a PCA9685 chip
* a power mosfet that will be driven by the AdaFruit board and that will drive the engine
* a good old power transistor 2N3055 and a 12V zener-diode that will ensure that the voltage that
is supplied to the electro motor will stay constant and within the allowed range
* a IR photomicrosensor that can be used for detecting the RPM of the electro motor

I also bought a USB WiFi dongle that will be used for providing a small local WiFi network.  

## Software
* a program that reads the speed information from the GPS dongle and adjusts the speed of
the electronic motor

Although I am a Java Software Engineer by trade I wanted to use a language that has a smaller
memory footprint. After experimenting with Python and NodeJS I chose NodeJS. There are a
lot of modules available for it that integrate with GPSD for example. An other thing that I
like is the fact that the JavaScript is compiled to native code by the V8 engine prior to
running the code.

# Putting it all together
Back in highschool I played a lot around with electronic components and used a soldering iron
for repairing TVs, radios etc. so with I little luck I should still be able to get the
hardware connected. The software proved to be quite easy although being used to a statically
typed language is challenging a loosely typed language needs more trial and error then I am
used to. After some experimenting and using the soldering iron after 25 years I had a prototype
that seemed to be working. During the first trials I discovered that the electro motor was
having a difficult time working at low speeds, typically below 200-300 RPM.

## First improvements (dual power setting)
The problems at low RPMs are caused by the low duty-cycle of the PWM. In order to get the
duty-cycle up the engine must run using a lower voltage. Because I already was using a very
simple voltage stabilizing component (the 2N3055 and the zener-diode) it was relatively easy
to add a extra transistor and a second zener-diode (5V this time) to the existing voltage
stabilizing circuit. This change needed a software counterpart as well. The program must be
able to switch between the voltages at which the engine is running. In order to prevent the
system from switching back and forth between the two different power settings some sort of
delay was needed between the moment the first switch was needed and the actual switching.
The first trials with this new power switching module showed a flaw in the motorcontrol
program. When the power setting was switched from low voltage (5V) to high voltage (12V)
the engine initially was spinning at around 900 RPM (which is equal to 9 knots!) while
prior to the switch is was running at around 300 RPM. Within seconds this was corrected by
the feedback loop but it was not the behavior I wanted. Measuring the duty-cycle at low
voltage and high voltage with the some target RPM showed that there seems to be a 10 to 3
ratio between the duty-cycles. With the control program correcting the duty-cycle when
switching between the power settings lead to a small jitter that is for now within
acceptable ranges.  

## Second improvements (wireless instruments application)
As mentioned before I also bought a USB WiFi dongle. The purpose of this dongle is to have
the Raspberry PI act as a WiFi hotspot that should provide internet connection (through USB
tethering) to everybody on board as long as my phone as a proper internet connection.
Besides provinding internet access this lead to the idea of a small web application that
would use the GPS information for showing the speed and location on any connected device.

# Where to go next
Up till now everything seems to be working. Everything is still in beta phase but for me it
is working fine. Because I was not very familiar with NodeJS and used a whole lot of mixed
quality examples and made some wrong design decisions in the early stages of the project
the whole project needs a major overhaul.

## Code overhaul
* write my own NMEA handling/parsing. I haven't found a NodeJS module that handles NMEA
messages in a way I like (mind you that I am coming from a statically typed language).
* introduce a easier extensible software architecture (NMEA event bus)
* get rid of the tightly coupling between NMEA parsing, motor control, powerswitching and
the instruments application

# TODO
* add some pictures
* add some electronic diagrams
* log the NMEA message on the Raspberry PI for later usage by other applications, OpenCPN
for example