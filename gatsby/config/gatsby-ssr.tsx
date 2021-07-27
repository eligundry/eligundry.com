import React from 'react'
import { GatsbySSR } from 'gatsby'
import { UserInterfaceProvider } from '../src/components/State/UserInterfaceState'

export const wrapRootElement: GatsbySSR['wrapRootElement'] = ({ element }) => (
  <UserInterfaceProvider>{element}</UserInterfaceProvider>
)
