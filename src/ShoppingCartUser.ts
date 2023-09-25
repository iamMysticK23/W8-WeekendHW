
import { ShoppingCartItem } from './ShoppingCartItem';


// Shopping Cart User attributes
export interface ShoppingCartUser {

    // Array to hold a user's cart items 
    cart: ShoppingCartItem[];
    addToCart(item: ShoppingCartItem): void;
    removeFromCart(item: ShoppingCartItem): void;
    removeQuantityFromCart(item: ShoppingCartItem, quantity: number): void;
    cartTotal(): number;
    name: string;
    age: number;
}