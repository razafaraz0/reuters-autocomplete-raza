import React, { useState, useMemo } from 'react'

import { debounce } from '../utils/debounce'
import { useGetWord } from '../hooks/useGetWords'
import { DEBOUNCE_LIMIT } from '../utils/constant'

function WordSearch() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounced setter
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), DEBOUNCE_LIMIT),
    []
  )

  const { data, isLoading, isError } = useGetWord({ query: debouncedSearch, limit: 10 })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)           
    debouncedSetSearch(value)  
  }

  return (
    <div>
      <input
        value={search}
        onChange={handleChange}
        placeholder="Type to search..."
        className="border p-2 rounded w-full"
      />

      {isLoading && <p>Loading...</p>}
      {isError && <p>Failed to fetch words</p>}

      {data?.length === 0 && (
        <p>No Matching word found</p>
      )}

      <ul>
        {data?.map((word: string, idx: number) => (
          <li key={idx} onClick={()=>console.log('Word clicked is', word)}>{word}</li>
        ))}
      </ul>
    </div>
  )
}

export default WordSearch
