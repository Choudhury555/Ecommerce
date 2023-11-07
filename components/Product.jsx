import React from 'react'
import Link from 'next/link';
import { urlFor } from '../lib/client';

const Product = ({product: {image,name,slug,price}}) => {//here we are de-structuring our props
  // console.log(slug)
  return (
    <div>
      <Link href={`/product/${slug.current}`}>{/*that product image is a link it self*/}
        <div className='product-card'>
          <img
            src={urlFor(image && image[0])}//means if we have an image present then show the first imgae(image[0]) because we have multiple imgaes for a single product
            width={250}
            height={250}
            className='product-image'
          />
          <p className='product-name'>{name}</p>
          <p className='product-price'>${price}</p>
        </div>
      </Link>
    </div>
  )
}

export default Product