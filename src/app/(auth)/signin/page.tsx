import Header from '@/components/layout/Header'
import Case from '@/components/sections/auth/signin'
import React from 'react'

const page = () => {
  return (
      <main className='h-full bg-auth bg-cover' >
        
          <Header/>
          <Case/>
    </main>
  )
}

export default page