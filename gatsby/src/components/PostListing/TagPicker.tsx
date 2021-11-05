import React, { useState, useCallback, useEffect } from 'react'
import useLocation from 'react-use/lib/useLocation'
import tw, { styled } from 'twin.macro'
import EmojiText from '../Shared/EmojiText'

interface Props {
  selectedTag: string | undefined
  onSelectTag: (tag: string) => void
  tags: Set<string>
}

export function useSelectedTag(): [string | undefined, (tag: string) => void] {
  const [tag, setTag] = useState<string | undefined>(undefined)
  const { hash } = useLocation()

  console.log({ hash })

  useEffect(() => {
    if (hash?.substr(1)) {
      setTag(hash.substr(1))
    }

    if (!hash) {
      setTag(undefined)
    }
  }, [hash])

  return [tag, setTag]
}

const TagWrapper = styled.nav`
  ${tw`mb-6`}

  & > * {
    ${tw`mr-2`}
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

  ${(props) => props.active && tw`text-white bg-primary`}

  & span {
    vertical-align: middle;
  }
`

const TagPicker: React.FC<Props> = ({ tags, selectedTag, onSelectTag }) => {
  const { pathname } = useLocation()

  return (
    <TagWrapper>
      {[...tags].sort().map((tag) => (
        <Tag
          href={`#${tag}`}
          onClick={() => onSelectTag(tag)}
          active={tag === selectedTag}
          key={tag}
        >
          <EmojiText emoji="🏷" label="tag emoji to denote filtering by tag">
            {tag}
          </EmojiText>
        </Tag>
      ))}
      {selectedTag && (
        <Tag href={pathname}>
          <EmojiText label="red x emoji to clear the filters" emoji="❌">
            clear
          </EmojiText>
        </Tag>
      )}
    </TagWrapper>
  )
}

export default TagPicker
