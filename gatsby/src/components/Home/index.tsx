import React from 'react'
import styled, { css } from 'styled-components'
import GitHubCalendar from 'react-github-calendar'
import { GoodreadsBookshelf } from 'react-goodreads-shelf'
import { TwitterTimelineEmbed } from 'react-twitter-embed'

import Daylio from '../Daylio'

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

  @media (max-width: 768px) {
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
    <Section className="feeling">
      <h2>Feeling</h2>
      <Daylio variant="home" />
    </Section>
    <Section className="listening">
      <h2>Listening</h2>
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
      <GitHubCalendar username="eligundry" dateFormat="YYYY-MM-DD" />
    </Section>
    <Section className="reading">
      <h2>Reading</h2>
      <GoodreadsBookshelf
        userId="29665939"
        apiKey="TSX2BO7dC8AMZstT2H6MBg"
        shelf="currently-reading"
      />
    </Section>
    <Section className="tweets" fullWidth>
      <h2>Tweeting</h2>
      <TwitterTimelineEmbed
        sourceType="profile"
        screenName="eligundry"
        options={{ height: 400 }}
      />
    </Section>
  </Wrapper>
)

export default Home
