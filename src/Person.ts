import { ShoppingCartItem } from "./ShoppingCartItem";
import { ShoppingCartUser } from "./ShoppingCartUser";


// initiating a new user
class Person implements ShoppingCartUser {
    private _cart: ShoppingCartItem[] = [];
    private _name: string;
    private _age: number;

    constructor(name: string, age: number) {
        this._name = name;
        this._age = age;
    }

    get cart(): ShoppingCartItem[] {
        return this._cart;
    }

    addToCart(item: ShoppingCartItem) {
        this._cart.push(item);
    }

    // remove all of one specific item from _cart array
    removeFromCart(item: ShoppingCartItem) {
        this._cart = this._cart.filter(cartItem => cartItem.id !== item.id);
    }


    // each time "remove one" button is clicked, it removes one from the cart
    // and reduces the total
    removeQuantityFromCart(item: ShoppingCartItem, quantity: number) {
        for (let i = 0; i < quantity; i++) {
            const index = this._cart.findIndex(cartItem => cartItem.id === item.id);
            if (index !== -1) {
                this._cart.splice(index, 1);
            } else {
                break;
            }
        }
    }

    cartTotal(): number {
        return this._cart.reduce((total, item) => total + item.price, 0);
    }

    // getters and setters for name and age
    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get age(): number {
        return this._age;
    }

    set age(value: number) {
        this._age = value;
    }
}

export { Person };