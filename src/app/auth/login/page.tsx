import { Metadata } from 'next'

import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Login',
}

const Page = () => {
  return (
    <div className="flex flex-col h-dvh justify-center items-center">
      <LoginForm />
    </div>
  )
}

export default Page
