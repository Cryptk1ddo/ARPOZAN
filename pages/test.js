import { useState } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'

export default function Home() {
  const [test, setTest] = useState('Hello World')

  return (
    <Layout>
      <Head>
        <title>ARPOZAN - Test</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl text-white">{test}</h1>
      </div>
    </Layout>
  )
}
