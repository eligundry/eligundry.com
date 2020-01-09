import React from 'react'
import GitHubCalendar from 'react-github-calendar'
import { GoodreadsBookshelf } from 'react-goodreads-shelf'
import { TwitterTimelineEmbed } from 'react-twitter-embed'

import './About.css'

const About = () => (
  <main className="about">
    <section className="coding">
      <h2>Coding</h2>
      <GitHubCalendar username="eligundry" dateFormat="YYYY-MM-DD" />
    </section>
    <section className="reading">
      <h2>Reading</h2>
      <GoodreadsBookshelf
        userId="29665939"
        apiKey="TSX2BO7dC8AMZstT2H6MBg"
        shelf="currently-reading"
      />
    </section>
    <section className="tweets">
      <h2>Tweeting</h2>
      <TwitterTimelineEmbed
        sourceType="profile"
        screenName="eligundry"
        options={{ height: 400 }}
      />
    </section>
    <section className="listening">
      <h2>Listening</h2>
      <a href="https://www.last.fm/user/eli_pwnd">
        <img src="/img/last.fm.jpg" alt="My top 9 albums for the past 7 days" />
      </a>
    </section>
  </main>
)

export default About
