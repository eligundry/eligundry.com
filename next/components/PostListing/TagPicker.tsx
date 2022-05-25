import React, { useState, useEffect } from 'react'
import useLocation from 'react-use/lib/useLocation'
import Head from 'next/head'
import Link from 'next/link'
import clsx from 'clsx'

import EmojiText from '@/components/Shared/EmojiText'
import styles from './index.module.scss'

interface Props {
  selectedTag: string | undefined
  tags: Set<string>
}

export function useSelectedTag(): string | undefined {
  const [tag, setTag] = useState<string | undefined>(undefined)
  const { hash } = useLocation()

  useEffect(() => {
    if (hash?.slice(1)) {
      setTag(hash.slice(1))
    }

    if (!hash) {
      setTag(undefined)
    }
  }, [hash])

  return tag
}

const Tag = React.forwardRef<
  HTMLAnchorElement,
  { active: boolean } & React.HTMLAttributes<HTMLAnchorElement>
>(({ active, className, ...props }, ref) => (
  <a
    className={clsx(styles.tag, active && styles.activeTag, className)}
    ref={ref}
    {...props}
  />
))

const TagPicker: React.FC<Props> = ({ tags, selectedTag }) => {
  const { pathname } = useLocation()

  return (
    <nav className={styles.tagWrapper}>
      {selectedTag && (
        <Head>
          <title>#{selectedTag} | Blog | Eli Gundry</title>
        </Head>
      )}
      {[...tags].sort().map((tag) => (
        <Link href={`#${tag}`} key={tag} passHref>
          <Tag active={tag === selectedTag}>
            <EmojiText emoji="🏷" label="tag emoji to denote filtering by tag">
              #{tag}
            </EmojiText>
          </Tag>
        </Link>
      ))}
      {selectedTag && (
        <Link href={pathname ?? ''} passHref>
          <Tag active={false}>
            <EmojiText label="red x emoji to clear the filters" emoji="❌">
              clear
            </EmojiText>
          </Tag>
        </Link>
      )}
    </nav>
  )
}

export default TagPicker
