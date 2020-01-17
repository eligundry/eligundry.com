import React from 'react'
import styled from 'styled-components'
import GitHubCalendar from 'react-github-calendar'
import { GoodreadsBookshelf } from 'react-goodreads-shelf'
import { TwitterTimelineEmbed } from 'react-twitter-embed'

// import './About.css'

const Wrapper = styled.main`
  display: flex;
  flex-flow: row wrap;
`

const Coding = styled.section`
  width: 50%;

  & > h2 {
    color: 'red';
  }
`

const Reading = styled.section`
  width: 50%;
`

const Listening = styled.section`
  width: 50%;

  & img {
    max-width: 33rem;
  }
`

const Tweeting = styled.section`
  width: 100%;

  & iframe {
    min-height: 30rem !important;
  }
`

const About: React.FC = () => (
  <Wrapper className="about">
    <Reading className="reading">
      <h2>Reading</h2>
      <GoodreadsBookshelf
        userId="29665939"
        apiKey="TSX2BO7dC8AMZstT2H6MBg"
        shelf="currently-reading"
      />
    </Reading>
    <Listening className="listening">
      <h2>Listening</h2>
      <a href="https://www.last.fm/user/eli_pwnd">
        <img src="/img/last.fm.jpg" alt="My top 9 albums for the past 7 days" />
      </a>
    </Listening>
    <Coding className="coding">
      <h2>Coding</h2>
      <GitHubCalendar username="eligundry" dateFormat="YYYY-MM-DD" />
    </Coding>
    <Tweeting className="tweets">
      <h2>Tweeting</h2>
      <TwitterTimelineEmbed
        sourceType="profile"
        screenName="eligundry"
        options={{ height: 400 }}
      />
    </Tweeting>
  </Wrapper>
)

export default About
