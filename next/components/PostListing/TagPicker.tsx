import React, { useState, useEffect } from 'react'
import useLocation from 'react-use/lib/useLocation'
import tw, { styled } from 'twin.macro'
import Head from 'next/head'
import Link from 'next/link'

import EmojiText from '../Shared/EmojiText'

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

const TagWrapper = styled.nav`
  ${tw`mb-6`}

  & > * {
    ${tw`mr-2 mb-2 inline-block`}
  }
`

const Tag = styled.a<{ active?: boolean }>`
  ${tw`
    font-sans
    border-2 
    border-primary 
    border-solid 
    rounded-full 
    py-1 
    px-2 
    text-sm 
    hover:no-underline
    active:no-underline
    focus:no-underline
    hover:text-white hover:bg-primaryLite
  `}

  white-space: nowrap;

  ${(props) => props.active && tw`text-white bg-primary`}

  & span {
    vertical-align: middle;
  }
`

const TagPicker: React.FC<Props> = ({ tags, selectedTag }) => {
  const { pathname } = useLocation()

  return (
    <TagWrapper>
      {selectedTag && (
        <Head>
          <title>#{selectedTag} | Blog</title>
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
          <Tag>
            <EmojiText label="red x emoji to clear the filters" emoji="❌">
              clear
            </EmojiText>
          </Tag>
        </Link>
      )}
    </TagWrapper>
  )
}

export default TagPicker
