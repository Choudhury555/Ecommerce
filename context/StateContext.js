import React, {createContext,useContext,useState,useEffect} from 'react';
import {toast} from 'react-hot-toast';//to get the pop-up notification when adding,removing a product from cart

const Context = createContext();

export const StateContext = ({children}) =>{
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    const onAdd = (product,quantity) => {//on click of AddtoCart button
        const checkProductInCart = cartItems.find((item) => item._id===product._id)//check if product is already in the cart or not
        setTotalPrice((prevTotalPrice) =>prevTotalPrice + product.price*quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

        if(checkProductInCart) {
            const updatedCartItems = cartItems.map((cartProduct) => {
                if(cartProduct._id===product._id) return {
                    ...cartProduct,//other product proerties remains same because product already exist in the cart
                    quantity: cartProduct.quantity + quantity //only increase the quantity of that product
                }
            })

            setCartItems(updatedCartItems);
            toast.success(`${qty} ${product.name} added to the cart.`);
        }
        else{////////////if the product does not already exist in the cart
            product.quantity = quantity;//update the product.quantity with the quantity we received from the fuction

            setCartItems([...cartItems,{...product}]);//{...product} because we are adding all the properties of the product
            toast.success(`${qty} ${product.name} added to the cart.`);
        }
    }



    //////////(IMPORTANT)increment/decrement the product quantity in the cart page(where there are multiple products)
    const toggleCartItemQuantity = (id,value) => {
        foundProduct = cartItems.find((item) => item._id===id)
        index = cartItems.findIndex((item) => item._id===id)

        if(value === 'inc'){
            // foundProduct.quantity += 1
            // cartItems[index] = foundProduct /////Never mutate a state manually(here cartItems is a state)IMPORTANT RULE OF REACT
            // let tempCartItems = cartItems.splice(index,1);//remove that "foundProduct" because below we are updating that one with new one =>({...foundProduct,quantity:foundProduct.quantity + 1})
            //(IMPORTANT)we can not use splice() because it is a mutative method(we can not mutate a state)
            //so we will use filter() which is a NON-mutative method
            // let tempCartItems = cartItems.filter((item) => item._id !== foundProduct._id)//Here we will filter out our "foundProduct" because below we are updating that one with new one =>({...foundProduct,quantity:foundProduct.quantity + 1})
            // let newCartItems = [...tempCartItems , {...foundProduct,quantity:foundProduct.quantity + 1}]//only updating the quantity of foundProduct
            // setCartItems(newCartItems)
            const updatedCartItems = cartItems.map((item) => {
                if(item._id === foundProduct._id){
                    foundProduct.quantity = foundProduct.quantity + 1;
                }
                return item
            })
            setCartItems(updatedCartItems)
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)
            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1)
        }
        else if(value === 'dec'){
            if(foundProduct.quantity > 1){
                // let tempCartItems = cartItems.filter((item) => item._id !== foundProduct._id)//Here we will filter out our "foundProduct" because below we are updating that one with new one =>({...foundProduct,quantity:foundProduct.quantity + 1})
                // let newCartItems = [...tempCartItems , {...foundProduct,quantity:foundProduct.quantity - 1}]//only updating the quantity of foundProduct
                // setCartItems(newCartItems)
                const updatedCartItems = cartItems.map((item) => {
                    if(item._id===foundProduct._id){
                        foundProduct.quantity = foundProduct.quantity - 1;
                    }
                    return item;
                })
                setCartItems(updatedCartItems)
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)
                setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1)
            }
        }
    }


    //////Remove a product fully from the cart
    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id===product._id)
        const newCartItems = cartItems.filter((item) => item._id !== foundProduct._id)
        setCartItems(newCartItems)
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price*foundProduct.quantity)
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity)
    }

    const incQty = () => {
        setQty((prevQty) => prevQty+1)
    }

    const decQty = () => {
        setQty((prevQty) => {
            if(prevQty-1 < 1) return 1;//because we can't go below 1

            return prevQty-1;
        });
    }

    return (
        // object of values that we want to pass across our entire application
        //////////////IMPORTANT => go to pages/_app.js and wrap our entire application with the <StateContext>
        <Context.Provider value={{
            showCart,
            cartItems,
            totalPrice,
            totalQuantities,
            qty,
            incQty,
            decQty,
            onAdd,
            setShowCart,
            toggleCartItemQuantity,
            onRemove,
            setCartItems,
            setTotalPrice,
            setTotalQuantities
        }}>
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);
//we also can do it separately in every components but it will be repetitive, so we are doing here one time