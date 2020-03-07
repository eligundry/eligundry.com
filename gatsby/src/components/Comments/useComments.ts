import { useCallback } from 'react'
import { useLocalStorage } from 'react-use'

export interface CommentPayload {
  email: string
  comment: string
}

interface Comment extends CommentPayload {
  id: number
  path: string
  posted_at: string
}

/* useComments is modeled after [echo-chamber-js][1], only I decided to
 * re-create it using hooks and I am silently syncing the comments to the API so
 * that I can view them and display them if they have any value, down the road.
 *
 * [1]: https://github.com/tessalt/echo-chamber-js
 */
function useComments(
  path: string
): [Comment[], (payload: CommentPayload) => Promise<void>] {
  const [comments, setComments] = useLocalStorage<Comment[]>(
    `comments-${path}`,
    []
  )

  const postComment = useCallback(
    async (payload: CommentPayload) => {
      const resp = await window.fetch(`/api/comments/path${path}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      if (!resp.ok) {
        throw resp
      }

      const comment = await resp.json()

      setComments(currentComments => {
        return [...currentComments, comment]
      }, [])
    },
    [path, setComments]
  )

  return [comments, postComment]
}

export default useComments
