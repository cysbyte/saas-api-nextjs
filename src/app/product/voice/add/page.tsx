import ProductSideBar from '@/components/layout/ProductSideBar'
import Case from '@/components/sections/product/voice/add'
import Dialog from '@/components/shared/RecordModal'
import { authConfig, loginIsRequiredServer } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prismadb'
import { getUserFromDB } from '@/app/actions/actions'

const Voice = async () => {
  await loginIsRequiredServer();

  const user = await getUserFromDB();

  return (
    <main className='flex flex-row'>
          <ProductSideBar productName='Voice'/>
          <Case user={user}/>
    </main>
  )
}

export default Voice