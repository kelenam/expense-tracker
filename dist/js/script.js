var balance = document.getElementById('balance');
var money_plus = document.getElementById('money-plus');
var money_minus = document.getElementById('money-minus');
var list = document.getElementById('list');
var form = document.getElementById('form');
var text = document.getElementById('text');
var amount = document.getElementById('amount');
var localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
var transactions = localStorageTransactions !== null ? localStorageTransactions : [];
// Add transaction 
function addTransaction(e) {
    e.preventDefault();
    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a text and amount');
    }
    else {
        var transaction = {
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
function generateID() {
    return Math.floor(Math.random() * 100000000);
}
// Add tranasactions to DOM list
function addTransactionDOM(transaction) {
    // Get sign
    var sign = transaction.amount < 0 ? '-' : '+';
    var item = document.createElement('li');
    // Add class based on value 
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = "\n        " + transaction.text + " <span>" + sign + Math.abs(transaction.amount) + "</span>\n        <button class=\"delete-btn\" onClick=\"removeTransaction(" + transaction.id + ")\">x</button>\n    ";
    list.appendChild(item);
}
// Update teh balance, income and expense 
function updateValues() {
    var amounts = transactions.map(function (transaction) { return transaction.amount; });
    var total = amounts.reduce(function (acc, item) { return (acc += item); }, 0).toFixed(2);
    var income = amounts
        .filter(function (item) { return item > 0; })
        .reduce(function (acc, item) { return (acc += item); }, 0)
        .toFixed(2);
    var expense = (amounts
        .filter(function (item) { return item < 0; })
        .reduce(function (acc, item) { return (acc += item); }, 0) * -1)
        .toFixed(2);
    balance.innerText = "$" + total;
    money_plus.innerText = "$" + income;
    money_minus.innerText = "$" + expense;
}
// Remove transaction by ID 
function removeTransaction(id) {
    transactions = transactions.filter(function (transaction) { return transaction.id !== id; });
    updateLocalStorage();
    init();
}
// Update local storage transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}
// Init app
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}
init();
form.addEventListener('submit', addTransaction);
