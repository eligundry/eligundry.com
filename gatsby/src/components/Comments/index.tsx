import React from 'react'
import { useLocation } from 'react-use'
import styled from 'styled-components'
import gravatar from 'gravatar'

import useComments, { CommentPayload } from './useComments'

const CommentForm = styled.form`
  margin-bottom: 1em;

  & label {
    display: block;
    margin-bottom: 1em;
  }

  & input,
  & textarea {
    display: block;
  }
`

const Comments: React.FC = () => {
  const { pathname } = useLocation()
  const [comments, postComment] = useComments(pathname)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    const payload = Array.from(form.querySelectorAll('input, textarea')).reduce(
      (acc, current: HTMLInputElement | HTMLTextAreaElement) => {
        acc[current.name] = current.value
        return acc
      },
      {}
    ) as CommentPayload

    await postComment(payload)
    form.reset()
  }

  let title = 'No Comments'

  if (comments.length === 1) {
    title = '1 Comment'
  } else if (comments.length > 1) {
    title = `${comments.length} Comments`
  }

  return (
    <div className="comments-section">
      <h4>{title}</h4>
      <div className="comments">
        {comments.map(comment => (
          <div key={comment.id} className="comment">
            <img
              src={gravatar.url(comment.email)}
              alt={`${comment.email}'s avatar from Gravatar.com'`}
            />
            <div className="body">{comment.comment}</div>
            <p>
              from {comment.email} at {comment.posted_at}
            </p>
          </div>
        ))}
      </div>
      <CommentForm onSubmit={handleSubmit}>
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
