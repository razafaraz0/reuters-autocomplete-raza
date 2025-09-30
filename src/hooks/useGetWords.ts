import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { DEFAULT_LIMIT, GET_WORD_URL } from '../utils/constant'

interface WordParams {
  query?: string
  limit?: number
}

const fetchWords = async ({ query, limit = DEFAULT_LIMIT }: WordParams) => {
  const params = query ? { query, limit } : { limit }
  const { data } = await axios.get(GET_WORD_URL, { params })

  return Array.isArray(data) ? data : [data]
}

export const useGetWord = ({ query = '', limit = DEFAULT_LIMIT }: WordParams) => {
  return useQuery({
    queryKey: ['words', query || 'no-query', limit],
    queryFn: () => fetchWords({ query, limit }),
    enabled: Boolean(query), 
    // cacheTime: 1000 * 60 * 5,x
    staleTime : 0,
  })
}
