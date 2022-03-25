import React from 'react'
import tw, { styled, theme } from 'twin.macro'
import GitHubCalendar from 'react-github-calendar'
import Link from 'next/link'
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'

import Daylio from '@/components/Daylio'
import Paper from '@/components/Shared/Paper'
import Reading, { ReadingProps } from '@/components/Reading'
import Listening from '@/components/Listening'
import useIsPhone from '@/utils/useIsMobile'
import GatsbySuspense from '@/components/Shared/GatsbySuspense'
import Tooltip from '@/components/Shared/Tooltip'
import EmojiText from '@/components/Shared/EmojiText'
import type { LastFMCoverItem } from '@/lib/lastfm'
import vimSVG from './assets/vim.svg'

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
`

export interface HomeDataProps {
  reading: ReadingProps
  lastfmCover: LastFMCoverItem[]
  daylioChartData: {
    x: string
    y: string
  }[]
}

const Home: React.FC<HomeDataProps> = ({
  reading,
  lastfmCover,
  daylioChartData,
}) => {
  const isMobile = useIsPhone()

  return (
    <>
      <Section className="introduction-hero">
        <h2>Glad To Meet You!</h2>
        <img
          src="/img/eli-thumbs-up-memoji.PNG"
          alt="Eli Gundry's Memoji Headshot"
          className="headshot"
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
          <Link href="/blog/feelings-api">
            <a>I made an API out of it and put it on my website</a>
          </Link>
          . The favicon for the site the emoji for my latest entry.
        </p>
        <Daylio />
        {/* Don't show the chart on mobile because it looks terrible, functions poorly and impacts performance on an outsized basis */}
        {!isMobile && (
          <GatsbySuspense fallback={<Skeleton height={153} width="100%" />}>
            <DaylioChart data={daylioChartData} />
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
          <Reading current={reading.current} read={reading.read} />
        </div>
      </Section>
      <Section className="listening">
        <h2>What I'm Listening To</h2>
        <p className="summary">
          I listen to way too much music and I love to listen to full albums. I
          mainly listen to hip hop, indie rock and{' '}
          <Link href="/blog/icymi-glocca-morra-just-married">
            <a>
              <abbr title="Ask me about the fun 5th wave emo bands I love">
                emo
              </abbr>
            </a>
          </Link>{' '}
          music. I occasionally write reviews of old albums that I love but
          aren't well known in a series called{' '}
          <Link href="/blog#icymi">
            <a>
              <abbr title="I See You Missed It">ICYMI</abbr>
            </a>
          </Link>
          .
        </p>
        <Listening
          spotifyEmbedURL="https://open.spotify.com/embed/playlist/0hIUs71p6xdZfQEZZmEHtj"
          lastfmCover={lastfmCover}
        />
      </Section>
    </>
  )
}

export default Home
