import React from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
const searchformreset = () => {
    const reset = () => {
  const form = document.querySelector('.search-form') as HTMLFormElement | null;
  if (form) {
    form.reset();
  }
};
  return (
    <button type='reset' onClick={reset}>
<Link href="/" className='search-btn text-white hover:cursor-pointer'><X className="size-5px"/></Link>
                </button>
  )
}

export default searchformreset
