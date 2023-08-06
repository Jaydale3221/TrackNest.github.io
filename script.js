document.addEventListener("DOMContentLoaded", function () {
    const expenseNameInput = document.getElementById("expenseName");
    const expenseAmountInput = document.getElementById("expenseAmount");
    const addExpenseButton = document.getElementById("addExpense");
    const expensesList = document.getElementById("expenses");
    const totalSpan = document.getElementById("total");

    const storedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];

    function updateLocalStorage() {
        localStorage.setItem("expenses", JSON.stringify(storedExpenses));
    }

    function updateTotalExpenses() {
        const expenseAmounts = storedExpenses.map(expense => expense.amount);
        const totalExpense = expenseAmounts.reduce((total, amount) => total + amount, 0);
        totalSpan.textContent = `$${totalExpense.toFixed(2)}`;
    }

    addExpenseButton.addEventListener("click", function () {
        const expenseName = expenseNameInput.value;
        const expenseAmount = parseFloat(expenseAmountInput.value);

        if (expenseName && !isNaN(expenseAmount)) {
            storedExpenses.push({ name: expenseName, amount: expenseAmount });
            updateLocalStorage();
            renderExpenses();
            expenseNameInput.value = "";
            expenseAmountInput.value = "";
            updateTotalExpenses();
        }
    });

    function renderExpenses() {
        expensesList.innerHTML = "";
        storedExpenses.forEach((expense, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <span>${expense.name}</span>
                <span>$${expense.amount.toFixed(2)}</span>
                <button class="edit" data-index="${index}">Edit</button>
                <button class="delete" data-index="${index}">Delete</button>
            `;
            expensesList.appendChild(listItem);
        });
    }

    expensesList.addEventListener("click", function (event) {
        const clickedElement = event.target;
        if (clickedElement.classList.contains("delete")) {
            const index = parseInt(clickedElement.getAttribute("data-index"));
            storedExpenses.splice(index, 1);
            updateLocalStorage();
            renderExpenses();
            updateTotalExpenses();
        } else if (clickedElement.classList.contains("edit")) {
            const index = parseInt(clickedElement.getAttribute("data-index"));
            const expense = storedExpenses[index];
            expenseNameInput.value = expense.name;
            expenseAmountInput.value = expense.amount;
            storedExpenses.splice(index, 1);
            updateLocalStorage();
            renderExpenses();
            updateTotalExpenses();
        }
    });

    renderExpenses();
    updateTotalExpenses();
});
