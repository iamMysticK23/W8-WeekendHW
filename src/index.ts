
// external imports
import { v4 as uuidv4 } from 'uuid';


// Shopping Cart Item attributes
interface ShoppingCartItem {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
}

// Shopping Cart User attributes
interface ShoppingCartUser {

    // Array to hold a user's cart items 
    cart: ShoppingCartItem[];
    addToCart(item: ShoppingCartItem): void;
    removeFromCart(item: ShoppingCartItem): void;
    removeQuantityFromCart(item: ShoppingCartItem, quantity: number): void;
    cartTotal(): number;
    name: string;
    age: number;
}

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

// update and display the user's shopping cart
const updateCartDisplay = (person: ShoppingCartUser | null) => {

    // HTML Elements
    const cartDiv = document.getElementById('cart');
    const totalCostElement = document.getElementById('totalCost');
    const helloUserElement = document.getElementById('helloUser');

    // if all 3 elements exist, then the cart is generated
    if (cartDiv && totalCostElement && person) {
        cartDiv.innerHTML = '';
        const cartItemCounts: { [itemName: string]: { item: ShoppingCartItem, count: number } } = {};

        // iterating through the itens in a user's cart
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

        // display the items in a Bootstrap 5 card
        for (const itemName in cartItemCounts) {
            const { item, count } = cartItemCounts[itemName];
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('card', 'mb-3');
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            // button to remove one of a specific item
            const removeOneButton = document.createElement('button');
            removeOneButton.innerText = "Remove One";
            removeOneButton.classList.add('btn', 'btn-warning', 'me-2');
            removeOneButton.addEventListener('click', () => {
                person.removeQuantityFromCart(item, 1);
                updateCartDisplay(person);
            });

            //button to remove all of a specific item
            const removeAllButton = document.createElement('button');
            removeAllButton.innerText = "Remove All";
            removeAllButton.classList.add('btn', 'btn-danger');
            removeAllButton.addEventListener('click', () => {
                person.removeFromCart(item);
                updateCartDisplay(person);
            });

            // quantity and item description
            cardBody.innerHTML = `
                <h5 class="card-title">${item.name} - Quantity: ${count}</h5>
                <p class="card-text">$${item.price.toFixed(2)} </p>
            `;

            cardBody.appendChild(removeOneButton);
            cardBody.appendChild(removeAllButton);
            itemDiv.appendChild(cardBody);
            cartDiv.appendChild(itemDiv);
        }
        // this displays the total cost of all items in acrt
        totalCostElement.textContent = `Total Cost: $${person.cartTotal().toFixed(2)}`;
        if (helloUserElement) {
            helloUserElement.innerHTML = `Hello,  ${person.name.charAt(0).toUpperCase() + person.name.slice(1)}<br>Age: ${person.age}!<br><br>Items For Sale:`;
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

        // Updates the "Hello user, age" message and clears the input fields
        updateCartDisplay(newUser);
        userNameInput.value = '';
        userAgeInput.value = '';

        // this hides the shop until a user logs in
        if (shopColumn) {
            shopColumn.style.display = 'block';
        }
    });
}

// Shop initialization
const initShop = () => {
    const shopDiv = document.getElementById('shop');
    const totalCostElement = document.getElementById('totalCost');
    const cartDiv = document.getElementById('cart');

    // if the cart is empty, display $0.00
    if (shopDiv && totalCostElement && cartDiv) {
        shopDiv.innerHTML = '';
        totalCostElement.textContent = 'Total Cost: $0.00';

        // items for sale
        const items: ShoppingCartItem[] = [
            createItem("Red Apples", 3.00, "Grown in Washington", "https://d3fwccq2bzlel7.cloudfront.net/Pictures/1024x536/4/6/9/42469_2_1201037_e.jpg"),
            createItem("Peaches", 2.50, "Grown in South Georgia", "https://robbreport.com/wp-content/uploads/2023/06/Georgia-Peaches.jpg"),
            createItem("Bananas for Donkey Kong", 1.75, "Imported From Mexico", "https://i0.wp.com/mynintendonews.com/wp-content/uploads/2013/05/donkey_kong_bananas.jpg"),
            createItem("Organic Royal Star Papaya", 1.15, "Fresh From Texas", "https://specialtyproduce.com/sppics/8443.png"),
            createItem("Organic Blackberries", 7.50, "Grown in California", "https://h2.commercev3.net/cdn.gurneys.com/images/800/74033.jpg"),
            createItem("Strawberries", 5.50, "Grown near Santa Cruz, California", "https://vegetablegrowersnews.com/wp-content/uploads/2018/07/California-strawberries.jpg"),
        ];

        // Bootstrap 5 cards for each item
        items.forEach((item) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('card', 'mb-3');
        
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
        
           
            const cardRow = document.createElement('div');
            cardRow.classList.add('row');
        
            
            const imgCol = document.createElement('div');
            imgCol.classList.add('col-md-6'); 
        
            const cardImage = document.createElement('img');
            cardImage.src = item.imageUrl;
            cardImage.classList.add('img-fluid', 'rounded'); 
            cardImage.alt = `Image of ${item.name}`;
            
            cardImage.style.width = '100%'; 
            cardImage.style.minHeight = '150px'; 
        
            imgCol.appendChild(cardImage);
            cardRow.appendChild(imgCol);
        
            // Column for Item Details
            const detailsCol = document.createElement('div');
            detailsCol.classList.add('col-md-6'); 
            
            detailsCol.innerHTML = `
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">$${item.price.toFixed(2)} - ${item.description}</p>
            `;
            const addButton = document.createElement('button');
            addButton.innerText = "Add to Cart";
            addButton.classList.add('btn', 'btn-success');
            addButton.addEventListener('click', () => {
                person?.addToCart(item);
                updateCartDisplay(person);
            });
            detailsCol.appendChild(addButton);
            cardRow.appendChild(detailsCol);
        
            cardBody.appendChild(cardRow);
            itemDiv.appendChild(cardBody);
            shopDiv.appendChild(itemDiv);
        });
        
        
    }
};

// Call the shop function
initShop();
