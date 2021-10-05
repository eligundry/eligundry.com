import React from 'react'
import tw, { styled } from 'twin.macro'

import UserLinks from '../components/UserLinks/UserLinks'

const FooterContainer = styled.footer`
  ${tw`bg-white shadow print:hidden`}

  & .container {
    ${tw`max-w-4xl mx-auto flex py-8`}

    & .about {
      ${tw`flex w-2/3 flex-col mr-2`}
    }

    & .social {
      ${tw`flex w-1/3 flex-col`}
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
            I'm baby crucifix bespoke tote bag, mumblecore flannel chambray
            typewriter before they sold out. Tbh butcher iceland art party
            pitchfork humblebrag wayfarers iPhone air plant. Taxidermy iceland
            +1 dreamcatcher, tacos live-edge brunch raclette fam gastropub pok
            pok bushwick. Scenester fanny pack retro single-origin coffee seitan
            franzen.
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
