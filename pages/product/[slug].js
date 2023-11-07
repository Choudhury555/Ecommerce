//[slug].js is inside square brackets means it is dynamic(file based routing)
//This is called file based Routing (in Product.jsx , <Link href={`product/${slug.current}`}>)
//Here also we are inside /product/[slug].js (i.e. inside product folder -> then inside [slug].js which is dynamic that is slug.current)
import React,{useState} from 'react'
import {client,urlFor} from '../../lib/client'//first ../ will be out side product folder then, second ../ will be out side pages folder
import { AiOutlineMinus,AiOutlinePlus,AiFillStar,AiOutlineStar } from 'react-icons/ai'
import { Product } from '../../components'
import { useStateContext } from '../../context/StateContext'

const ProductDetails = ({product,products}) => {//receiving from below 
  //destructuring the props
  const {image,name,details,price} = product//shortcut of product.image,product.name etc...
  const [index,setIndex] = useState(0);
  const {decQty,incQty,qty,onAdd,setShowCart} = useStateContext();
  
  const handleBuyNow = () => {
    onAdd(product,qty);
    setShowCart(true);
  }

  return (
    <div>
      <div className='product-detail-container'>
        
        <div>
          <div className='image-container'>
            <img src={urlFor(image && image[index])} className='product-detail-image'/>
          </div>
          <div className='small-images-container'>
            {image?.map((item,idx) => {
              return <img key={idx} src={urlFor(item)} className={idx===index ? "small-image selected-image" : "small-image"} 
              onMouseEnter={()=>setIndex(idx)}/>
            })}
          </div>
        </div>

        <div className='product-detail-desc'>
          <h1>{name}</h1>
          <div className='reviews'>
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details :</h4>
          <p>{details}</p>
          <p className='price'>${price}</p>

          <div className='quantity'>
            <h3>Quantity</h3>
            <p className='quantity-desc'>
              <span className='minus' onClick={decQty}><AiOutlineMinus/></span>
              <span className='num'>{qty}</span>
              <span className='plus' onClick={incQty}><AiOutlinePlus/></span>
            </p>
          </div>

          <div className='buttons'>
            <button type='button' className='add-to-cart' onClick={()=>onAdd(product,qty)}>Add to Cart</button>
            <button type='button' className='buy-now' onClick={handleBuyNow}>Buy Now</button>
          </div>
        </div>
      </div>


      {/*////////////Similar Products////////////*/}
      <div className='maylike-products-wrapper'>
        <h2>You may also like</h2>
        <div className='marquee'>
          <div className='maylike-products-container   track'>
            {products.map((item) => (//This is "products" not "product"
              <Product key={item._id} product={item}/>
            ))}
          </div>
        </div>
      </div>

      
    </div>
  )
}


//In the pages directory, the getStaticPaths function is used to define the dynamic paths that should be pre-rendered at build time.
//if you export a function called "getStaticPaths" from a page that uses dynamic routes(e.g. [slug].js),Next.js will statcally pre-rendered all the paths specified by "getStaticPaths"
/////Simply if a page has dynamic routes(e.g. [slug].js) and using "getStaticProps" then we will use "getStaticPaths"
export const getStaticPaths = async () => {
  //here inside query we are getting  current slug of each product
  const query = `*[_type == "product"]{
    slug {
      current
    }
  }`;

  const products=await client.fetch(query);
  //then generate all the paths
  const paths = products.map((product) => ({//implicitly returning so inside a parenthesis ()
      params: {
        slug: product.slug.current
      }
  }))

  return {
    paths,
    fallback: 'blocking'//This property can be set to "true" to show a fallback page while the page is being generated, "false" to show a 404 page, or "blocking" to generate the page at request time.
  }
}


//if you export a function called "getStaticProps" from a page,Next.js will pre-render this page at build time using the props returned by "getStaticProps"
//we should use "getStaticProps" ==> if data is already available(e.g. here in our <Home /> component i.e. inside /pages/index.js) before users request
//e.g. if we are at Home page inside /pages/index.js(where already product details are stored),then when we click on any product ==> here in this page the details should populated instantly
export const getStaticProps = async({params :{slug}}) => {
  //here we can destructure the params and get the current slug(we can use the current slug here because [slug].js is dynamic) e.g. slug = headphones_new
  //////////////to get the indivisual product//////////////
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;//[0] means the first product
  const product = await client.fetch(query);

  //////////////for similar product//////////////
  const productsQuery = '*[_type == "product"]';
  const products = await client.fetch(productsQuery);

  return {
    props: {product,products}//this props will be recevied by the above functional component "ProductDetails"
  }
}

export default ProductDetails