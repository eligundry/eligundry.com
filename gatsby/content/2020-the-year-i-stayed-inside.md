---
title: "2020: The Year I Stayed Inside"
description: My reflections on this crazy year
date: 2020-12-16T05:00
slug: 2020-the-year-i-stayed-inside
cover: 5.jpg
---

This year was crazy. I want to write down some feelings and memories so I don't forget them as time passes. Overall,
it's been a decent year for me, challenges aside.

## COVID-19

> I never stayed in a dorm, so I didn't experience the "Freshman 15", but I have put on about COVID-19.

All jokes aside, this global pandemic really threw a wrench in everything, huh? I went from going to an office every day
in Union Square, having varied lunches, and generally having freedom to living at home constantly. I was in the last
years of my 20s living in a party city and instead of savoring that last year of youth, I just cooked a lot.

Do I have some anger about this whole situation? Yes, but I'm not mad at other people really. Sure, I have some
disappointment in people that refuse to wear masks or take this seriously, but honestly, everyone is trying their best
with the rules that have been provided. 

No, my real anger is reserved for the government that made this happen. Why did we [slash funding for CDC offices in
China][1] that would allow us to detect and contain this earlier? How did we end up politicizing wearing masks? Why didn't
we promote the voices of experts and instead prioritized quick fixes and miracle cures instead of doing the work?

And look, I've had it easy. I'm over here getting angry about a year of lost youth while people in my neighborhood are
starving and unable to work and dying. My heart breaks for them and I'm doing what I can to help with that, but it's
a poor substitute for proper government handling of disease. Government, when operated competently, can be unbelievable
force multiplier for good and to see it run so incompetently and vindictively for years is just exhausting.

But hey, the finish line is in sight! There is a meme on leftist Twitter about liberals wanting to be able to tune out
and go back to brunch, but for real, brunch with some friends sounds great and I look forward to being able to go to it
at some point next year.

Enough about that, though.

## Cohabitation

In March, my partner of three years and I moved in together in Astoria, Queens. We found a nice two bedroom on Ditmars
that is always happening.

Moving in with someone is always an adjustment where you must be open to change. Moving in together during COVID is
another level of complexity because we've had to be around each other 24/7 with no ability to see our friends or choose
to not be around the other person. 

My partner is a Medicare shift counselor who is very loud and on the phone all day with old people that can't hear well.
I'm very happy that I pushed for us to get a two bedroom so I can have a home office and not listen to her all day, but
I will say that I have learned quite a bit about Medicare and I have a lot of appreciation for the work that she does
and the help she provides. I wouldn't have gotten to experience that without this and I have very grateful for it.

Shortly after moving in together, we adopted a new cat, Laverne. She is a very sassy and high energy lady baby from
Harlem. She is not getting along with my old cat, Fonzie, but they are working on it and maybe in 2021, they will start
cuddling?

### Cooking

In 2019, I got really into cooking and boy that couldn't have happened at a better time. This year, I have cooked half
of our meals weekly and have really enjoyed it. For years, I have to fine a hobby to compliment some of the programming
that I do on the side and I finally realized that I'm spending about 8 hours a week cooking and meal planning that this
is as good a hobby as I'm going to find.

Some of my favorite recipies I made this year:

1. [Braised Chickpeas](https://smittenkitchen.com/2020/09/tangy-braised-chickpeas/)
2. [Prime Rib](https://www.foodnetwork.com/recipes/ina-garten/sunday-rib-roast-recipe-1941847) and [Horseradish Mashed Potatoes](https://www.delish.com/holiday-recipes/thanksgiving/a22646726/horseradish-mashed-potatoes-recipe/)
3. [Buttermilk Turkey Breast](https://cooking.nytimes.com/recipes/1021522-buttermilk-brined-turkey-breast) 
    * I got to make Thanksgiving for the first time and it was so much fun.
4. [Spinach Artichoke Pasta](https://cooking.nytimes.com/recipes/1020080-baked-spinach-artichoke-pasta)
5. [Café Salle Pleyel Burger](https://cooking.nytimes.com/recipes/1018105-cafe-salle-pleyel-burger)
    * This recipe calls for ground sirloin, which it's good with, but it's way better with Beyond Meat.

## Professional Developments

I spent the year working at [Talent Inc][2] and boy was it eventful! For those that don't know, my company sells resume
writing and other professional services for job seekers, I have been there for about three years now and it's now
getting to the point that the companies technologies are starting to match my ideal stack. More important than that,
though, is that my team is full of very kind and talented people that I'm honored to work with.

Below are some cool projects that I got to work on this year.

### Expert Dashboard

I kicked off the year with a bang! My main team at Talent Inc. works on technologies for our experts to write resumes
faster. In the course of two years, we have completely rewritten that application for a hand rolled PHP monolith to
a web application powered by a Go backend and a React frontend. We did the big rewrite last year but we didn't make
a nice homepage for the experts.

Enter the Expert Dashboard! It gives the expert a high level overview of how they are doing and easy access to see
messages and events from their clients. It's full of emojis, which I think you can tell, based upon my site, I am
tickled by.

<video autoplay controls loop>
  <source src="https://cdn.eligundry.com/blog-media/expert-dashboard-demo.webm">
</video>

### Customer Portal

I spent most of my year working on a new application is a part of the post purchase experience. Up until this point,
a customer would interface with out web applications for a critique of their resume, purchase, and fill out an
onboarding questionnaire and then we would tell them that all communication with their expert would be done via email,
where we have next to no control of context the customer would be communicating with their expert. I have so many horror
stories about email that I shudder thinking about them.

That couldn't stand so we decided to make a new web application for our customers to communicate with their expert. And
hey, if the communication goes well and they decide to buy some upsells in there, everyone wins, right?

@TODO Make a video of a completely filled in Portal

This was on a different team than the one that I had been working with, so this project was frustrating at times. Also,
we started developing this 💯 remotely because of COVID, which didn't help things at all. At the end of the day,
though, the project got done, our customers love it, and communication with the experts is going much smoother.

### Various Devops Improvements

I played less of a part than I would have liked, but I do consider myself an agent of change around this part of the
stack.

1. We have fully embraced Docker in production. I think next year we're going to pull the trigger on some sort of
   orchestration around it, right now it's just containers running on EC2 instances.
2. We deprecated our old Jenkins box and now have everything in Github Actions. Shouts out to my devops teammates for
   putting in the dirty work here while I just write fun CI pipelines in Github Actions.

[1]: https://www.reuters.com/article/us-health-coronavirus-china-cdc-exclusiv/exclusive-u-s-slashed-cdc-staff-inside-china-prior-to-coronavirus-outbreak-idUSKBN21C3N5
[2]: https://www.talentinc.com/
