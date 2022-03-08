/* eslint-disable import/prefer-default-export, react/jsx-no-constructed-context-values */
import React from 'react'
import { IconContext } from 'react-icons'

import ThemeModeProvider from './src/layout/ThemeModeProvider'
import { FancyBackgroundPaintWorkletRegistration } from './src/layout/FancyBackground'

// @TODO Change this into a tsx file once it can work with gatsby-plugin-mdx. If
// this is not a regular JS file, it fails.

/**
 * @type {import('gatsby').GatsbySSR['wrapRootElement']}
 */
export const wrapRootElement = ({ element }) => (
  <ThemeModeProvider>
    <IconContext.Provider value={{}}>{element}</IconContext.Provider>
  </ThemeModeProvider>
)

/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <FancyBackgroundPaintWorkletRegistration key="fancy-background" />,
  ])
}
