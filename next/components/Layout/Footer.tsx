import React from 'react'
import Link from 'next/link'

import UserLinks from '@/components/UserLinks'
import EmojiText from '@/components/Shared/EmojiText'
import styles from './Footer.module.scss'

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.container}>
      <section className={styles.about}>
        <h3>About</h3>
        <p>
          Eli Gundry is a full stack web developer that loves JavaScript, devops
          and web standards. When he isn't coding, he's{' '}
          <Link href="/blog#cooking">
            <a>
              <EmojiText emoji="👨‍🍳" label="chef cause I'm cooking">
                cooking up something mean in the kitchen
              </EmojiText>
            </a>
          </Link>
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
  </footer>
)

export default Footer
