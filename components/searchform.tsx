"use client"
import React from 'react'
import SearchFormReset from './searchformreset'
import { Search } from 'lucide-react'

const searchform = ({query}:{query?: string}) => {
  return (
      <form action="/" className='search-form'>
        <input name='query' type="text" defaultValue={query} className="search-input" placeholder='Search startups'
        />
        <div className='flex gap-5'>
            {query && <SearchFormReset/>}
            <button type='submit' className='search-btn text-white hover: cursor-pointer'><Search className='size-5px'/></button>
        </div>
      </form>
  )
}

export default searchform
