import { v4 as uuidv4 } from 'uuid';

interface ShoppingCartItem {
    id: string;
    name: string;
    price: number;
    description: string;
}

interface ShoppingCartUser {
    cart: ShoppingCartItem[];
    addToCart(item: ShoppingCartItem): void;
    removeFromCart(item: ShoppingCartItem): void;
    removeQuantityFromCart(item: ShoppingCartItem, quantity: number): void;
    cartTotal(): number;
    name: string;
    age: number;
}

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

    removeFromCart(item: ShoppingCartItem) {
        this._cart = this._cart.filter(cartItem => cartItem.id !== item.id);
    }

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

function createUser(name: string, age: number): ShoppingCartUser {
    return new Person(name, age);
}

function createItem(name: string, price: number, description: string): ShoppingCartItem {
    return {
        id: uuidv4(),
        name,
        price,
        description,
    };
}

const updateCartDisplay = (person: ShoppingCartUser | null) => {
    const cartDiv = document.getElementById('cart');
    const totalCostElement = document.getElementById('totalCost');
    const helloUserElement = document.getElementById('helloUser');

    if (cartDiv && totalCostElement && person) {
        cartDiv.innerHTML = '';
        const cartItemCounts: { [itemName: string]: { item: ShoppingCartItem, count: number } } = {};

        person.cart.forEach((item) => {
            const itemName = item.name;
            if (!cartItemCounts[itemName]) {
                cartItemCounts[itemName] = {
                    item: item,
                    count: 1,
                };
            } else {
                cartItemCounts[itemName].count++;
            }
        });

        for (const itemName in cartItemCounts) {
            const { item, count } = cartItemCounts[itemName];
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('card', 'mb-3');
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            const removeOneButton = document.createElement('button');
            removeOneButton.innerText = "Remove One";
            removeOneButton.classList.add('btn', 'btn-danger', 'me-2');
            removeOneButton.addEventListener('click', () => {
                person.removeQuantityFromCart(item, 1);
                updateCartDisplay(person);
            });

            const removeAllButton = document.createElement('button');
            removeAllButton.innerText = "Remove All";
            removeAllButton.classList.add('btn', 'btn-warning');
            removeAllButton.addEventListener('click', () => {
                person.removeFromCart(item);
                updateCartDisplay(person);
            });

            cardBody.innerHTML = `
                <h5 class="card-title">${item.name} - Quantity ${count}</h5>
                <p class="card-text">$${item.price.toFixed(2)} - ${item.description}</p>
            `;

            cardBody.appendChild(removeOneButton);
            cardBody.appendChild(removeAllButton);
            itemDiv.appendChild(cardBody);
            cartDiv.appendChild(itemDiv);
        }

        totalCostElement.textContent = `Total Cost: $${person.cartTotal().toFixed(2)}`;
        if (helloUserElement) {
            helloUserElement.textContent = `Hello, ${person.name}!`;
        }
    }
};


let person: ShoppingCartUser | null = null;
const shopColumn = document.getElementById('shopColumn');

// Event listener for user form submission
const userForm = document.getElementById('userForm') as HTMLFormElement;
if (userForm) {
    userForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const userNameInput = document.getElementById('userName') as HTMLInputElement;
        const userAgeInput = document.getElementById('userAge') as HTMLInputElement;

        const userName = userNameInput.value;
        const userAge = parseInt(userAgeInput.value, 10);

        const newUser = createUser(userName, userAge);
        person = newUser;

        // Update the "Hello user" message and clear the input fields
        updateCartDisplay(newUser);
        userNameInput.value = '';
        userAgeInput.value = '';

        if (shopColumn) {
            shopColumn.style.display = 'block';
        }
    });
}

// Initialize the shop
const initShop = () => {
    const shopDiv = document.getElementById('shop');
    const totalCostElement = document.getElementById('totalCost');
    const cartDiv = document.getElementById('cart');

    if (shopDiv && totalCostElement && cartDiv) {
        shopDiv.innerHTML = '';
        totalCostElement.textContent = 'Total Cost: $0.00';

        const items: ShoppingCartItem[] = [
            createItem("Red Apples", 3.00, "Grown in Washington"),
            createItem("Peaches", 2.50, "Grown in South Georgia"),
            createItem("Bananas for Donkey Kong", 1.75, "Imported From Mexico"),
            createItem("Organic Royal Star Papaya", 1.15, "Fresh From Texas"),
            createItem("Organic Blackberries", 7.50, "Grown in California"),
            createItem("Strawberries", 5.50, "Grown near Santa Cruz, California"),
        ];

        items.forEach((item) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('card', 'mb-3');
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            const addButton = document.createElement('button');
            addButton.innerText = "Add to Cart";
            addButton.classList.add('btn', 'btn-success');
            addButton.addEventListener('click', () => {
                person?.addToCart(item);
                updateCartDisplay(person);
            });

            cardBody.innerHTML = `
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">$${item.price.toFixed(2)} - ${item.description}</p>
            `;

            cardBody.appendChild(addButton);
            itemDiv.appendChild(cardBody);
            shopDiv.appendChild(itemDiv);
        });
    }
};

// Initialize the shop
initShop();
