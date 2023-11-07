import React from 'react'
import Link from 'next/link'
import {AiOutlineShopping} from 'react-icons/ai'
import {Cart} from './'//already defined in index so only '/'
import { useStateContext } from '../context/StateContext'

const Navbar = () => {
  const {showCart,setShowCart,totalQuantities} = useStateContext();

  return (
    <div className='navbar-container'>
      <p className='logo'>
        <Link href="/">Abhisek Electronics</Link>
      </p>
      <botton type="button" className='cart-icon' onClick={() => setShowCart(true)}>
        <AiOutlineShopping />
        <span className='cart-item-qty'>{totalQuantities}</span>
      </botton>

      {showCart && <Cart />}
    </div>
  )
}

export default Navbar