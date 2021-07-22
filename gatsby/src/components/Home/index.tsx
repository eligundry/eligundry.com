import React from 'react'
import tw, { styled } from 'twin.macro'
import GitHubCalendar from 'react-github-calendar'
import { Link } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'

import Daylio from '../Daylio/index'
import Paper from '../Shared/Paper'
import Reading from '../Reading'
import Listening from '../Listening'
import underConstructionGif from '../../../static/img/under-construction.gif'
import useIsPhone from '../../utils/useIsMobile'
import GatsbySuspense from '../Shared/GatsbySuspense'
import Tooltip from '../Shared/Tooltip'
import RecentBlogPosts from '../PostListing/RecentBlogPosts'

const DaylioChart = React.lazy(async () => import('../Daylio/Chart'))

interface SectionProps {
  className?: string
  fullWidth?: boolean
}

const Section = styled<React.FC<SectionProps>>(Paper.section)`
  ${tw`sm:mx-2 md:mx-2`}

  & h2 {
    ${tw`text-orange font-extrabold`}
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

  & .under-construction {
    ${tw`inline-block`}
  }

  & .bookshelf {
    h3 {
      ${tw`font-semibold text-orange`}
    }

    & .books {
      display: grid;
      align-items: center;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      column-gap: 1vw;
      margin: 1vw;
      margin-left: 0;
      text-align: center;

      & a {
        flex: 1;
      }

      & img {
        min-width: 75px;
      }
    }
  }

  &.tweets {
    & .content {
      ${tw`flex flex-row sm:flex-col`}
    }
  }
`

const Home: React.FC = () => {
  // const { width } = useWindowSize()
  // const twitterTimelineHeight = width >= style.breakPoints.tabletPx ? 600 : 375
  const twitterTimelineHeight = 450
  const isMobile = useIsPhone()

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
          <li>Full stack web engineer.</li>
          <li>Has a non-traditional computer science education.</li>
          <li>Loves planning and cooking elaborate meals.</li>
          <li>
            Vim user but actively encourages everyone to use something else.
            Using Vim in {new Date().getFullYear()} is a cool bar trick.
          </li>
          <li>
            Die hard Cleveland Browns fan and am convinced that we will win a
            Super Bowl one of these years.
          </li>
          <li>
            Currently lives in Astoria, Queens. Loves the food and the
            neighborhood.
          </li>
          <li>
            Has fat cat named Fonzie and has{' '}
            <a href="https://twitter.com/EliGundry/status/1055933062125703168">
              a tattoo of him on his arm
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
        <a
          href="http://textfiles.com/underconstruction/"
          className="under-construction"
        >
          <img
            src={underConstructionGif}
            alt="90s style under construction gif"
            width={356}
            height={105}
          />
        </a>
      </Section>
      <Section className="feeling">
        <h2>Feeling</h2>
        <p className="summary">
          A while ago, I decided to start journaling my feelings. Being a
          software engineer,{' '}
          <Link to="/blog/feelings-api">
            I made an API out of it and put it on my website
          </Link>
          . The favicon for the site the emoji for my latest entry.
        </p>
        <Daylio />
        {/* Don't show the chart on mobile because it looks terrible, functions poorly and impacts performance on an outsized basis */}
        {!isMobile && (
          <GatsbySuspense fallback={null}>
            <DaylioChart />
          </GatsbySuspense>
        )}
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
          GitHub contribution calendars are not a good indicator of whether or
          not someone is a good developer, but they are very pretty.
        </p>
        <GitHubCalendar username="eligundry" dateFormat="yyyy-MM-dd">
          <Tooltip />
        </GitHubCalendar>
      </Section>
      <Section className="blogging">
        <h2>Blogging</h2>
        <RecentBlogPosts />
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
        <Listening spotifyEmbedURL="https://open.spotify.com/embed/playlist/1cm6mo8oxk8axeEhQZff8Z" />
      </Section>
    </>
  )
}

export default Home
