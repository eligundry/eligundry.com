import React from 'react'
import { GatsbyBrowser } from 'gatsby'
import { UserInterfaceProvider } from '../src/components/State/UserInterfaceState'

export const wrapRootElement: GatsbyBrowser['wrapPageElement'] = ({
  element,
}) => <UserInterfaceProvider>{element}</UserInterfaceProvider>
