import React from 'react'
import tw, { styled } from 'twin.macro'

import UserLinks from '../components/UserLinks/UserLinks'

const FooterContainer = styled.footer`
  ${tw`bg-white shadow print:hidden`}

  & .container {
    ${tw`max-w-4xl mx-auto flex py-8`}

    & section {
      ${tw`flex w-full md:w-1/2 flex-col`}
    }
  }
`

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <div className="container">
        <section>
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
        <section>
          <h3>Social</h3>
          <UserLinks />
        </section>
      </div>
    </FooterContainer>
  )
}

export default Footer
