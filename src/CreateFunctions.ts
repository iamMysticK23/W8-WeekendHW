// external import
import { v4 as uuidv4 } from 'uuid';

// internal imports
import { ShoppingCartUser } from "./ShoppingCartUser";
import { ShoppingCartItem } from './ShoppingCartItem';
import { Person } from "./Person";

// create new user
function createUser(name: string, age: number): ShoppingCartUser {
    return new Person(name, age);
}

// create items (6)
function createItem(name: string, price: number, description: string, imageUrl: string): ShoppingCartItem {
    return {
        id: uuidv4(),
        name,
        price,
        description,
        imageUrl
    };
}

export { createUser, createItem };
