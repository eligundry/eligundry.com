import React from 'react'
import tw, { styled, theme } from 'twin.macro'
import GitHubCalendar from 'react-github-calendar'
import { Link } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'

import Daylio from '../Daylio/index'
import Paper from '../Shared/Paper'
import Reading from '../Reading'
import Listening from '../Listening'
import useIsPhone from '../../utils/useIsMobile'
import GatsbySuspense from '../Shared/GatsbySuspense'
import Tooltip from '../Shared/Tooltip'
import EmojiText from '../Shared/EmojiText'
import vimSVG from './assets/vim.svg'
import brownsSVG from './assets/cleveland-browns.svg'

const DaylioChart = React.lazy(async () => import('../Daylio/Chart'))

interface SectionProps {
  className?: string
}

const Section = styled<React.FC<SectionProps>>(Paper.section)`
  ${tw`mb-4`}

  & h2 {
    ${tw`text-4xl text-primary font-extrabold`}
  }

  & h3 {
    ${tw`font-semibold text-primary`}
  }

  &.introduction-hero {
    display: block;

    & .vim-icon,
    & .browns-icon {
      height: 1.5rem;
      width: 1.5rem;
      display: inline;
      vertical-align: top;
    }
  }

  & .headshot {
    min-width: 200px;
    width: 200px;
    height: 250px;

    ${tw`float-right ml-8 sm:hidden`}
  }

  & .under-construction {
    ${tw`inline-block`}
  }

  & .react-activity-calendar {
    ${tw`font-mono`}
  }

  & .bookshelf {
    & .books {
      display: grid;
      align-items: center;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      column-gap: 1vw;
      margin: 0 1vw 1vw;
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
`

const Home: React.FC = () => {
  const isMobile = useIsPhone()

  return (
    <>
      <Section className="introduction-hero">
        <h2>Glad To Meet You!</h2>
        <StaticImage
          src="../../../static/img/eli-gundry-headshot.jpg"
          alt="Eli Gundry's Headshot"
          className="headshot"
          width={200}
          height={250}
        />
        <p>My name is Eli I only really write in lists, so here's my deal.</p>
        <ul>
          <li>
            I am a{' '}
            <EmojiText emoji="🧑‍💻" label="computer programmer emoji">
              <strong>full stack web engineer</strong>
            </EmojiText>
            .
          </li>
          <li>
            I love to plan and{' '}
            <EmojiText emoji="👨‍🍳" label="chef emoji">
              <strong>cook elaborate meals</strong>
            </EmojiText>
            . It really activates the engineering part of my brain!
          </li>
          <li>
            I have a{' '}
            <EmojiText emoji="🤓" label="geek emoji">
              <strong>non-traditional computer science education</strong>
            </EmojiText>
            . I attended a vocational school in high school, taught myself web
            programming, bounced around colleges for computer science while
            working the entire time before deciding to go pro!
          </li>
          <li>
            I am a{' '}
            <img
              src={vimSVG}
              className="vim-icon"
              alt="Vim logo"
              width={544}
              height={545}
            />{' '}
            <strong>Vim user</strong> but I actively encourage everyone to use
            something else. Using Vim in {new Date().getFullYear()} is a cool
            bar trick.
          </li>
          <li>
            Die hard{' '}
            <img
              src={brownsSVG}
              className="browns-icon"
              alt="Cleveland Browns logo"
              width={286}
              height={221}
            />{' '}
            <strong>Cleveland Browns</strong> fan and am convinced that we will
            win a Super Bowl one of these years.
          </li>
          <li>
            I currently live in{' '}
            <EmojiText emoji="📍" label="pin emoji to denote location">
              <strong>Astoria, Queens</strong>
            </EmojiText>
            . I didn't think I would settle down in Queens and love it as much
            as I do, but life is like that sometimes.
          </li>
          <li>
            I have a{' '}
            <EmojiText
              emoji="😼"
              label="smirking cat emoji because Fonzie is a stinker"
            >
              <strong>fat cat named Fonzie</strong>
            </EmojiText>{' '}
            and I sorta have{' '}
            <a href="https://twitter.com/EliGundry/status/1055933062125703168">
              a tattoo of him on my arm
            </a>
            .
          </li>
        </ul>
      </Section>
      <Section className="feeling">
        <h2>How I'm Feeling</h2>
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
        <h2>Do You Code?</h2>
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
        <GitHubCalendar
          username="eligundry"
          dateFormat="yyyy-MM-dd"
          color={theme`colors.primary`}
          hideColorLegend
        >
          <Tooltip html />
        </GitHubCalendar>
      </Section>
      <Section className="reading">
        <h2>What I'm Reading</h2>
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
        <p className="summary">
          By the way,{' '}
          <a href="https://www.npmjs.com/package/@eligundry/gatsby-source-goodreads">
            I wrote the Gatsby source that is rendering these bookshelves
          </a>
          !
        </p>
        <div className="bookshelf">
          <Reading />
        </div>
      </Section>
      <Section className="listening">
        <h2>What I'm Listening To</h2>
        <p className="summary">
          I listen to way too much music and I love to listen to full albums. I
          mainly listen to hip hop, indie rock and{' '}
          <abbr title="Ask me about the fun 5th wave emo bands I love">
            emo
          </abbr>{' '}
          music.
        </p>
        <Listening spotifyEmbedURL="https://open.spotify.com/embed/playlist/0hIUs71p6xdZfQEZZmEHtj" />
      </Section>
    </>
  )
}

export default Home
