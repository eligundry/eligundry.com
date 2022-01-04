import React from 'react'
import tw, { styled } from 'twin.macro'
import { Link } from 'gatsby'

import UserLinks from '../components/UserLinks/UserLinks'
import EmojiText from '../components/Shared/EmojiText'

const FooterContainer = styled.footer`
  ${tw`bg-white dark:bg-typographyDark shadow print:hidden`}

  & .container {
    ${tw`
        max-w-3xl 
        w-full
        mx-auto 
        flex 
        py-8
        sm:flex-col-reverse
        sm:px-4
      `}

    & > * {
      ${tw`
        flex 
        flex-col
      `}
    }

    & .about {
      ${tw`
        w-2/3 
        sm:w-full
        mr-4
        sm:mr-0
      `}

      & p {
        ${tw`mt-0`}
      }
    }

    & .social {
      ${tw`
        w-1/3 
        sm:w-full
        sm:mb-4
      `}
    }
  }
`

const Footer: React.FC = () => (
  <FooterContainer>
    <div className="container">
      <section className="about">
        <h3>About</h3>
        <p>
          Eli Gundry is a full stack web developer that loves JavaScript, devops
          and web standards. When he isn't coding, he's{' '}
          <Link to="/blog#cooking">
            <EmojiText emoji="👨‍🍳" label="chef cause I'm cooking">
              cooking up something mean in the kitchen
            </EmojiText>
          </Link>{' '}
          ,{' '}
          <EmojiText
            emoji="🎾"
            label="tennis ball because that's what I'm playing"
          >
            playing tennis
          </EmojiText>{' '}
          or{' '}
          <EmojiText emoji="🐈🐈‍⬛" label="it's my cats!">
            annoying his cats
          </EmojiText>
          . He is also a{' '}
          <a href="/web0.html">
            <EmojiText
              emoji="✳️"
              label="green asterisk emoji for that pure html energy"
            >
              web0 evangelist
            </EmojiText>
          </a>{' '}
          and thinks everyone can benefit from writing some HTML.
        </p>
      </section>
      <section className="social">
        <h3>Social</h3>
        <UserLinks />
      </section>
    </div>
  </FooterContainer>
)

export default Footer
