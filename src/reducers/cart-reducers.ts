import { CartItem, Guitar } from "../types";
import { db } from "../data/db";


export type  CardAction =
{ type: 'add-to-cart' , payload : {item : Guitar}  } |
{ type: 'remove-from-cart' , payload : {id : Guitar['id']}  } |
{ type: 'decrease-Quantity' , payload : {id : Guitar['id']}  } |
{ type: 'increase-cart' , payload : {id : Guitar['id']}  }|
{ type: 'clean-cart'  }


export type CartState = {
    data: Guitar[]
    cart: CartItem[]
    }

    const initialCart = () : CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }



export const initialState : CartState ={
    data : db,
    cart: initialCart()
}


const MIN_ITEMS = 1
const MAX_ITEMS = 5



export const cartReducer = (
   state: CartState  = initialState,
   action: CardAction
 ) => {
   if(action.type === 'add-to-cart'){
      
     const itemExists = state.cart.find(guitar => guitar.id === action.payload.item.id)
    
    
     let updatedCart : CartItem[] = []
   
    if(itemExists ) { // existe en el carrito
      updatedCart = state.cart.map(item =>{
         if(item.id === action.payload.item.id){
             if(item.quantity < MAX_ITEMS){
                return{...item, quantity : item.quantity + 1 }
             }else{
                return item
             }
         }else{
            return item
         }
      })

    } else {
        const newItem : CartItem = {...action.payload.item, quantity : 1}
        updatedCart =  [...state.cart, newItem]
    }
    
    
    
     return{
        ...state,
        cart : updatedCart

      }
   }
   if(action.type === 'remove-from-cart'){
      
    
        const  updatedCart = state.cart.filter(item => item.id !==  action.payload.id)
    
    
    return{
       ...state,
       cart : updatedCart
     }
  }

  if(action.type === 'decrease-Quantity'){
      
    
    const updatedCart = state.cart.map( item => {
        if(item.id === action.payload.id && item.quantity > MIN_ITEMS) {
            return {
                ...item,
                quantity: item.quantity - 1
            }
        }
        return item
    })
    
    
    
    return{
       ...state,
       cart : updatedCart
     }
  }
  
  if(action.type === 'increase-cart'){
      
     
    
    const updatedCart = state.cart.map( item => {
        if(item.id === action.payload.id && item.quantity < MAX_ITEMS) {
            return {
                ...item,
                quantity: item.quantity + 1
            }
        }
        return item
    })
   
    
    return{
       ...state,
       cart : updatedCart
     }
  }


  if(action.type === 'clean-cart'){
      
    
    
    return{
       ...state,
       cart: []
     }
  }
   return state
}