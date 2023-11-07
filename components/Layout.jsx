import React from 'react'
import Head from 'next/head' //same as Head in Html(gives some metadata about your website)
import Navbar from './Navbar'
import Footer from './Footer'
////////////////////////We will use this "Layout" component inside "/studios/_app.js"
const Layout = ({children}) => {
  return (
    <div className='layout'>
      <Head>
        <title>Abhisek's Store</title>
      </Head>

      <header>
        <Navbar />
      </header>

      <main className='main-container'>
        {children}{/*this is the children we are receiving from _app.js (here "children" = <Component {...pageProps} /> because we are passing this inside <Layout></Layout> component)*/}
      </main>
      
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default Layout