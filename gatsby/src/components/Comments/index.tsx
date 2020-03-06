import React from 'react'
import { useLocation } from 'react-use'

import useComments from './useComments'

const Comments: React.FC = () => {
  const { path } = useLocation()
  const [comments, postComment] = useComments(path)

  return (
    <div>
      <form>
        <label htmlFor="email">
          Email: <input type="email" id="email" name="email" required />
        </label>
        <label htmlFor="comment">
          Comment: <textarea id="comment" name="comment" required />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Comments
