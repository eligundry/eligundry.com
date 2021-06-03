import React from 'react'
import tw, { styled, theme } from 'twin.macro'
import GitHubCalendar from 'react-github-calendar'
import { TwitterTimelineEmbed } from 'react-twitter-embed'
import LazyLoad from 'react-lazyload'
import { Link } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'

import config from '../../../data/SiteConfig'
import Daylio from '../Daylio/index'
import DaylioChart from '../Daylio/Chart'
import Paper from '../Shared/Paper'
import Reading from '../Reading'
import underConstructionGif from '../../../static/img/under-construction.gif'

interface SectionProps {
  className?: string
  fullWidth?: boolean
}

const Section = styled<React.FC<SectionProps>>(Paper.section)`
  ${tw`sm:mx-2 md:mx-2`}

  & h2 {
    ${tw`text-teal-500 font-extrabold`}
  }

  &.introduction-hero {
    display: block;
  }

  & .headshot {
    min-width: 200px;
    width: 200px;
    height: 250px;

    ${tw`
      float-right 
      ml-8 
      sm:float-none 
      xs:float-none 
      sm:ml-0 
      sm:mt-4
      xs:ml-0
      xs:mt-4
    `}
  }

  & .bookshelf {
    display: grid;
    align-items: center;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    column-gap: 1vw;
    margin: 1vw;
    text-align: center;

    & img {
      min-width: 75px;
    }
  }

  &.listening {
    & > .listening-media {
      ${tw`flex flex-row xs:flex-col sm:flex-col`}

      & > iframe {
        ${tw`mr-4 xs:mb-4 sm:mb-4`}
        max-width: 100%;
      }
    }
  }

  &.tweets {
    & .content {
      ${tw`flex flex-row sm:flex-col`}

      & > * {
        ${tw`w-1/3 sm:w-full`}
      }
    }
  }
`

const Home: React.FC = () => {
  // const { width } = useWindowSize()
  // const twitterTimelineHeight = width >= style.breakPoints.tabletPx ? 600 : 375
  const twitterTimelineHeight = 400

  return (
    <>
      <Section className="introduction-hero">
        <h2>Hello there!</h2>
        <StaticImage
          src="../../../static/img/eli-gundry-headshot.jpg"
          alt="Eli Gundry's Headshot"
          className="headshot"
          width={200}
          height={250}
        />
        <p>I only really write in lists, so here's my deal.</p>
        <ul>
          <li>I'm a full stack web engineer.</li>
          <li>
            I love to plan and cook elaborate meals. It really activates the
            engineering part of my brain!
          </li>
          <li>I have a non-traditional computer science education.</li>
          <li>
            Vim user but I actively encourage everyone to use something else.
            Using Vim in {new Date().getFullYear()} is a cool bar trick.
          </li>
          <li>
            Die hard Cleveland Browns fan and am convinced that we will win a
            Super Bowl one of these years.
          </li>
          <li>
            I currently live in Astoria, Queens. I didn't think I would settle
            down in Queens and love it as much as I do, but life is like that
            sometimes, I guess.
          </li>
          <li>
            I have a fat cat named Fonzie and I sorta have{' '}
            <a href="https://twitter.com/EliGundry/status/1055933062125703168">
              a tattoo of him on my arm
            </a>
            .
          </li>
        </ul>
        <p>
          I don't think I'll ever truly be happy with the layout of style of
          this site. I know what looks good but am uterly powerless to make
          something that looks good. Until I am happy, the 90s under
          construction gif will stay up.
        </p>
        <a href="http://textfiles.com/underconstruction/">
          <img
            src={underConstructionGif}
            alt="90s style under construction gif"
          />
        </a>
      </Section>
      <Section className="feeling">
        <h2>Feeling</h2>
        <p className="summary">
          A while ago, I decided to start journaling my feelings. Being a
          software engineer,{' '}
          <Link to="blog/feelings-api">
            I made an API out of it and put it on my website
          </Link>
          . The favicon for the site the emoji for my latest entry.
        </p>
        <Daylio />
        <DaylioChart />
      </Section>
      <Section className="coding">
        <h2>Coding</h2>
        <p className="summary">
          I make a living developing web applications. I jump all around the
          stack and will do whatever it takes to ship. Need me to do some devops
          to get this feature out? I gotcha. Some CSS is making a button look
          bad? I'll do my best. A query running to slow? Stop, I can't deal with
          all this excitement.
        </p>
        <p>
          Github contribution calendars are not a good indicator of whether or
          not someone is a good developer, but they are very pretty.
        </p>
        <GitHubCalendar username="eligundry" dateFormat="yyyy-MM-dd" />
      </Section>
      <Section className="reading">
        <h2>Reading</h2>
        <p className="summary">
          I wish I read more, but there are only so many hours in the day. These
          are the books that I'm reading right now. You can find me on{' '}
          <a
            href="https://www.goodreads.com/user/show/29665939-eli-gundry"
            itemProp="sameAs"
          >
            Goodreads
          </a>
          .
        </p>
        <div className="bookshelf">
          <Reading />
        </div>
      </Section>
      <Section className="listening">
        <h2>Listening</h2>
        <p className="summary">
          I listen to way too much music and I love to listen to full albums.
          Below is my current playlist of songs I have on repeat and the top
          albums I've listened to this week.
        </p>
        <div className="listening-media">
          <iframe
            title="Spotify playlist that I have on repeat"
            src="https://open.spotify.com/embed/playlist/1cm6mo8oxk8axeEhQZff8Z"
            width="300"
            height="380"
            frameBorder="0"
            allowTransparency
            allow="encrypted-media"
          />
          <a href="https://www.last.fm/user/eli_pwnd">
            <img
              className="listening-img"
              src="https://www.tapmusic.net/collage.php?user=eli_pwnd&type=7day&size=3x3"
              alt="My top 9 albums for the past 7 days"
              width={900}
              height={900}
            />
          </a>
        </div>
      </Section>
      <Section className="tweets">
        <h2>Twitter</h2>
        <div className="content">
          <p className="summary">
            Twitter is my <del>vice</del> social network of choice. It's been
            instrumental in developing my career. I started following other
            developers years ago, read their blog posts, followed the people
            they retweeted, and stayed up to date with the latest technologies.
            It also has funny memes, which are equally important to keeping up
            to date with tech.
          </p>
          <LazyLoad>
            <TwitterTimelineEmbed
              sourceType="profile"
              screenName={config.userTwitter}
              options={{
                height: twitterTimelineHeight,
              }}
            />
          </LazyLoad>
          <LazyLoad>
            <TwitterTimelineEmbed
              sourceType="likes"
              screenName={config.userTwitter}
              options={{
                height: twitterTimelineHeight,
              }}
            />
          </LazyLoad>
        </div>
      </Section>
    </>
  )
}

export default Home
