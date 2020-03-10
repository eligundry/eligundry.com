---
title: New Computer, Who This?
description: The obligatory blog post about my new computer
date: 2020-03-09T05:00
slug: new-computer
cover: 5.jpg
category: tech
---

# Outline

* I work from home quite often, so having a decent desktop is a must.
* My old setup was:
  * A Thinkpad T430
      * Bought refurbished and off-lease
      * Linux, Debian testing
      * Always on, used it like a home server and a Linux dev machine
      * Hooked up to a dock
  * A bulky desktop
      * Windows
      * Usually off, only used for gaming
  * All hooked up to a KVM
      * KVMs are not cheap
  * Which is then hooked up to two monitors
* This setup served me well for 6 years
* It started breaking down:
  * First, one of the KVM inputs broke
  * Then, the Thinkpad started overheating
* I live in NYC, so I am space constrained
* Requirements:
  * Small
  * Lower power consumption so I don't feel bad leaving it on all the time
  * Would be nice to play games sometimes
  * Would be nice to use my existing GPU in Linux so I can do some fun graphics/AI stuff
* New setup
  * Intel NUC 8th Gen + 32 GB RAM + 1TB SSD
      * I realized after I got this that it wasn't the newest generation. I was briefly upset but then realized that
        I saved $300 on something that I think is just as good at the margins.
  * Razer Core X eGPU enclosure
  * Nvidia 960 GTX
* I've been obsessed with Intel NUCs for a very long time. I wanted to get one to make a media center, but I always had
  trouble justifying the cost for something I would use so infrequently.
* I did some research and realized that a NUC would meet all my requirements
* It has Thunderbolt, which I hooked up to the Razer Core X to run my GPU in all modes
* I set it up to dual boot Windows 10 and Debian Testing
  * Did you know that you can use a Windows 7 key to activate Windows 10? Now you know.
* Debian Testing woes
  * Setting up Windows was easy and Linux was also easy EXCEPT for the external GPU
  * It took me like 2 weeks to figure out how to get the eGPU
  * Turns out that eGPUs are not plug and play in Linux, you must edit your `xorg.conf`
      * https://egpu.io/forums/thunderbolt-linux-setup/a-script-to-change-xorg-config/
* So Much Faster
  * My Docker builds are blazing fast and node builds that took like 30 seconds before take like under 5
* Future
  * Eventually, I might get an AMD GPU so I can use the eGPU with my Macbooks
  * I'm currently using 2 1080p monitors, but I think I want to get a curved ultra wide. I found this nice one with
    a built in KVM that would allow me to easily switch to my Macbooks.
      * https://smile.amazon.com/Philips-346B1C-Adjustable-PowerSensor-Replacement/dp/B07Y5ZZW3Y?sa-no-redirect=1
