import React from 'react'
import tw, { styled } from 'twin.macro'

import UserLinks from '../components/UserLinks/UserLinks'

const FooterContainer = styled.footer`
  ${tw`bg-white shadow print:hidden`}

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

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <div className="container">
        <section className="about">
          <h3>About</h3>
          <p>
            <a href="https://hipsum.co/">
              I'm baby crucifix bespoke tote bag, mumblecore flannel chambray
              typewriter before they sold out
            </a>
            . Tbh butcher iceland art party pitchfork humblebrag wayfarers
            iPhone air plant. Taxidermy iceland +1 dreamcatcher, tacos live-edge
            brunch raclette fam gastropub pok pok bushwick. Scenester fanny pack
            retro single-origin coffee seitan franzen.
          </p>
        </section>
        <section className="social">
          <h3>Social</h3>
          <UserLinks />
        </section>
      </div>
    </FooterContainer>
  )
}

export default Footer
