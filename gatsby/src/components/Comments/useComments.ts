import { useCallback } from 'react'
import { useLocalStorage } from 'react-use'

interface Comment {
  email: string
  comment: string
}

function useComments(path: string) {
  const [comments, setComments] = useLocalStorage<Comment[]>(
    `comments-${path}`,
    []
  )

  const postComment = useCallback(
    async (payload: Comment) => {
      const resp = await window.fetch(`/api/comments/${path}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      if (!resp.ok) {
        throw resp
      }

      setComments(currentComments => {
        return [...currentComments, payload]
      }, [])
    },
    [path, setComments]
  )

  return [comments, postComment]
}

export default useComments
