import React from 'react'

import styles from './index.module.scss'

const ContentWrapper: React.FC = ({ children }) => (
  <main className={styles.contentWrapper} role="main">
    {children}
  </main>
)

export default ContentWrapper
