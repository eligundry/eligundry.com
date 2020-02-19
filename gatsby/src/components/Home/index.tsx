import React from 'react'
import styled, { css } from 'styled-components'
import GitHubCalendar from 'react-github-calendar'
import { GoodreadsBookshelf } from 'react-goodreads-shelf'
import { TwitterTimelineEmbed } from 'react-twitter-embed'

import config from '../../../data/SiteConfig'
import style from '../../../data/styleConfig'
import Daylio from '../Daylio/index'

const Wrapper = styled.main`
  display: flex;
  flex-flow: row wrap;
`

interface SectionProps {
  fullWidth?: boolean
}

const Section = styled.section<SectionProps>`
  width: 50%;

  & .listening-img {
    width: 100%;
  }

  & .headshot {
    width: 150px;
  }

  & .bookshelf > div > div {
    grid-template-columns: repeat(auto-fit, minmax(80px, 100px)) !important;
  }

  @media (${style.breakPoints.tablet}) {
    width: 100%;
  }

  ${props =>
    props.fullWidth &&
    css`
      width: 100%;
    `}
`

const Home: React.FC = () => (
  <Wrapper className="about">
    <Section className="introduction-hero" fullWidth>
      <h2>Hello there!</h2>
      <img
        src="/img/eli-gundry-headshot.jpg"
        alt="Eli Gundry's Headshot"
        className="headshot"
      />
    </Section>
    <Section className="feeling">
      <h2>Feeling</h2>
      <p className="summary">
        Recently, I decided to start journaling my feelings. Being a software
        engineer, I made an API out of it and put it on my website. You can read
        more about this project <a href="/blog/feelings-api">here</a>.
      </p>
      <Daylio variant="home" />
    </Section>
    <Section className="listening">
      <h2>Listening</h2>
      <p className="summary">
        I listen to way too much music. Here are the albums I've had on repeat
        this week.
      </p>
      <a href="https://www.last.fm/user/eli_pwnd">
        <img
          className="listening-img"
          src="/img/last.fm.jpg"
          alt="My top 9 albums for the past 7 days"
        />
      </a>
    </Section>
    <Section className="coding">
      <h2>Coding</h2>
      <p className="summary">
        I make a living developing web applications. I jump all around the stack
        and will do whatever it takes to ship. Need me to do some devops to get
        this feature out? I gotcha. Some CSS is making a button look bad? I'll
        do my best. A query running to slow? Stop, I can't deal with all this
        excitment.
      </p>
      <GitHubCalendar username="eligundry" dateFormat="YYYY-MM-DD" />
    </Section>
    <Section className="reading">
      <h2>Reading</h2>
      <p className="summary">
        I wish I read more, but there are only so many hours in the day. These
        are the books that I'm reading right now.
      </p>
      <div className="bookshelf">
        <GoodreadsBookshelf
          userId={config.goodreads.userID}
          apiKey={config.goodreads.apiKey}
          shelf="currently-reading"
        />
      </div>
    </Section>
    <Section className="triva">
      <h2>Trivia</h2>
      <p>Here are some fun facts about me!</p>
      <ul>
        <li>
          Vim user but I actively encourage everyone to use something else.
          Using Vim in {new Date().getFullYear()} is a cool bar trick.
        </li>
        <li>
          Die hard Cleveland Browns fan and am convinced that we will win a
          Super Bowl one of these years.
        </li>
      </ul>
    </Section>
    <Section className="tweets">
      <h2>Twitter</h2>
      <p className="summary">
        Twitter is my <del>vice</del> social network of choice. It's been
        instrumental in developing my career. I started following other
        developers years ago, read their blog posts, followed the people they
        retweeted, and stayed up to date with the latest technologies. It also
        has funny memes, which are equally important to keeping up to date with
        tech.
      </p>
      <TwitterTimelineEmbed
        sourceType="profile"
        screenName={config.userTwitter}
        options={{ height: 400 }}
      />
    </Section>
  </Wrapper>
)

export default Home
