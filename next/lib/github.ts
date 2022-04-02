import { Day } from 'react-activity-calendar'
import { cacheAxios } from './axios'

export interface GitHubApiResponse {
  total: {
    [year: number | string]: number
  }
  contributions: Day[]
}

const fetchData = async (username: string) =>
  cacheAxios
    .get<GitHubApiResponse>(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
    )
    .then((resp) => resp.data)

const api = { fetchData }

export default api