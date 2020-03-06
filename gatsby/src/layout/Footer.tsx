import React from 'react'
import styled from 'styled-components'

import UserLinks from '../components/UserLinks/UserLinks'

const StyledFooter = styled.footer`
  margin-bottom: 1em;
`

const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <UserLinks />
    </StyledFooter>
  )
}

export default Footer
