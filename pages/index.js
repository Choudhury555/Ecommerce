import React from 'react'

import {client} from '../lib/client';//Same as Other Api(or Here our Back-End is sanity)
import {HeroBanner,FooterBanner,Product} from '../components'

const Home = ({products,bannerData}) => {
  return (
    <>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]}/>{/*we will only pass the first element of that array as props*/}
      {/* {console.log(bannerData)} */}
      <div className='products-heading'>
        <h2>Best Selling Products</h2>
        <p>Speakers of Many Types</p>
      </div>

      <div className='products-container'>
        {products.map((product) => <Product key={product._id} product={product}/>)}
      </div>

      <FooterBanner footerBanner={bannerData && bannerData[0]}/>{/*If bannerData exist the pass bannerData[0]*/}
    </>
  )
}

//When  we are fecting data from an Api or a CMS(client management
//system i.e sanity) in Next.js we will use "getServerSideProps"  and in React.js we should have used useEffect
//getServerSideProps is an asynchronous function
export const getServerSideProps = async() => {//whatever "getServerSideProps" return that will populated in Home function above
  const query = '*[_type == "product"]'//means let's grab all our product from our sanity dashboard
  const products = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]'//means let's grab all our banner from our sanity dashboard
  const bannerData = await client.fetch(bannerQuery);

  return {
    props: {products,bannerData}//this props will be recevied by the above functional component "Home"
  }
}
export default Home