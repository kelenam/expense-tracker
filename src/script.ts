const balance: any = document.getElementById('balance');
const money_plus: any = document.getElementById('money-plus');
const money_minus: any = document.getElementById('money-minus');
const list: any = document.getElementById('list');
const form: any= document.getElementById('form'); 
const text: any = document.getElementById('text');
const amount: any = document.getElementById('amount');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions: any = localStorageTransactions !== null ? localStorageTransactions : [];

// Add transaction 
function addTransaction(e: any): void {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a text and amount');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);

        updateValues();

        updateLocalStorage();

        text.value = '';
        amount.value = '';
    }
}

// Generate random ID 
function generateID(): number {
    return Math.floor(Math.random() * 100000000);
}

// Add tranasactions to DOM list
function addTransactionDOM(transaction: {id: number, text: string, amount: number}): void {
    // Get sign
    const sign: string = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');

    // Add class based on value 
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onClick="removeTransaction(${transaction.id})">x</button>
    `;
    
    list.appendChild(item);
}

// Update teh balance, income and expense 
function updateValues(): void {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc:number, item: number) => (acc += item), 0).toFixed(2);

    const income = amounts
                    .filter((item: number) => item > 0)
                    .reduce((acc: number, item: number) => (acc += item), 0)
                    .toFixed(2);

    const expense = (amounts
                    .filter(item => item < 0)
                    .reduce((acc: number, item: number) => (acc += item), 0) * -1)
                    .toFixed(2);

    balance.innerText = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;
}

// Remove transaction by ID 
function removeTransaction(id: number): void {
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();

    init();
}

// Update local storage transactions
function updateLocalStorage(): void {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init(): void {
    list.innerHTML = '';

    transactions.forEach(addTransactionDOM);

    updateValues();
}

init();

form.addEventListener('submit', addTransaction);