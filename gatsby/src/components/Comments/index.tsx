import React from 'react'
import { useLocation } from 'react-use'
import styled from 'styled-components'

import useComments from './useComments'

const CommentForm = styled.form`
  & label {
    display: block;
  }

  & input,
  & textarea {
    display: block;
  }
`

const Comments: React.FC = () => {
  const { pathname } = useLocation()
  const [comments, postComment] = useComments(pathname)

  return (
    <div>
      <CommentForm
        onSubmit={e => {
          // @TODO I can do so much better than this
          e.preventDefault()

          const payload = Array.from(
            e.currentTarget.querySelectorAll('input, textarea')
          ).reduce((acc, current: HTMLInputElement | HTMLTextAreaElement) => {
            acc[current.name] = current.value
            return acc
          }, {})

          postComment(payload)
        }}
      >
        <label htmlFor="email">
          Email: <input type="email" id="email" name="email" required />
        </label>
        <label htmlFor="comment">
          Comment: <textarea id="comment" name="comment" required />
        </label>
        <button type="submit">Submit</button>
      </CommentForm>
    </div>
  )
}

export default Comments
