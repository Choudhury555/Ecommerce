import React,{useRef} from 'react'
import Link from 'next/link'
import { AiOutlineMinus,AiOutlinePlus,AiOutlineLeft,shopp, AiOutlineShopping } from 'react-icons/ai'
import {TiDeleteOutline} from 'react-icons/ti'
import {toast} from 'react-hot-toast'

import { useStateContext } from '../context/StateContext'
import { urlFor } from '../lib/client'
import getStripe from '../lib/getStripe'

const Cart = () => {
  const cartRef = useRef();
  const {totalPrice,totalQuantities,cartItems,setShowCart,toggleCartItemQuantity,onRemove} = useStateContext();



  const handleCheckout = async () =>{//we will get an instance of Strie Promise from ./lib/getStripe.js
    const stripe = await getStripe();
    
    //Now we are going to make an api request to our own Next.js backend
    const response = await fetch('/api/stripe',{//here also file based routing
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItems),
    });//first parameter is our api route(under pages/api/stripe(our own backend)) and second parameter is an Object contain all the options

    if(response.statusCode === 500) return;

    const data = await response.json();
    console.log(data);
    toast.loading('Redirecting...');

    //at last call that stripe instance
    stripe.redirectToCheckout({ sessionId: data.id });
  }



  return (
    <div className='cart-wrapper' ref={cartRef}>
      <div className='cart-container'>
        <button type='button' className='cart-heading' onClick={()=>setShowCart(false)}>
          <AiOutlineLeft />
          <span className='heading'>Your Cart</span>
          <span className='cart-num-items'>({totalQuantities} items)</span>
        </button>
        
        {/*START /////If your cart is empty///// */}
        {cartItems.length < 1 && (
          <div className='empty-cart'>
            <AiOutlineShopping size={150}/>
            <h3>Your Shopping Bag is Empty</h3>
            <Link href='/'>
              <button type='button' className='btn' onClick={()=>setShowCart(false)}>Continue Shopping</button>
            </Link>
          </div>
        )}
        {/*END /////If your cart is empty///// */}


        {/*START /////If we do have items in our cart///// */}
        <div className='product-container'>
          {cartItems.length >= 1 && cartItems.map((item,index) => (
            <div className='product' key={item._id}>
              <img src={urlFor(item?.image[0])} className='cart-product-image'/>{/*item?.image[0] means if item present(?) then item's first image*/}
              <div className='item-desc'>
                <div className='flex top'>
                  <h5>{item.name}</h5>
                  <h4>${item.price}</h4>
                </div>
                <div className='flex bottom'>
                  <div>
                    <p className='quantity-desc'>
                      {/* Like in [slug].js or ProductDetails page {decQty},{incQty}and{qty} will work , because we already knew that for which product we are incrementing/decrementing(because there is only ONE product*/}
                      {/*Here in Cart.js {decQty},{incQty}and{qty} will not work , because we do not know for which product we are incrementing/decrementing(because there will be many products*/}
                    <span className='minus' onClick={()=>toggleCartItemQuantity(item._id,'dec')}><AiOutlineMinus/></span>
                    <span className='num' >{item.quantity}</span>
                    <span className='plus' onClick={()=>toggleCartItemQuantity(item._id,'inc')}><AiOutlinePlus/></span>
                    </p>
                  </div>
                  <button type='button' className='remove-item' onClick={()=>onRemove(item)}><TiDeleteOutline /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/*END /////If we do have items in our cart///// */}
      
      {cartItems.length >= 1 && (
        <div className='cart-bottom'>
          <div className='total'>
            <h3>Subtotal:</h3>
            <h3>${totalPrice}</h3>
          </div>
          <div className='btn-container'>
            <button type='button' className='btn' onClick={handleCheckout}>PAY WITH STRIPE</button>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default Cart