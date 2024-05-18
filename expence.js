document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expenseForm');
    const expenseTableBody = document.querySelector('#expenseTable tbody');
    let expenses = [];

    expenseForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const amount = document.getElementById('amount').value;
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;

        const expense = { amount, category, date };
        expenses.push(expense);
        renderExpenses();
        expenseForm.reset();
    });

    function renderExpenses() {
        expenseTableBody.innerHTML = '';
        expenses.forEach((expense, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.amount}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td class="actions">
                    <button class="edit" data-index="${index}">Edit</button>
                    <button class="delete" data-index="${index}">Delete</button>
                </td>
            `;
            expenseTableBody.appendChild(row);
        });

        document.querySelectorAll('.edit').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.dataset.index;
                editExpense(index);
            });
        });

        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.dataset.index;
                deleteExpense(index);
            });
        });
    }

    function editExpense(index) {
        const expense = expenses[index];
        document.getElementById('amount').value = expense.amount;
        document.getElementById('category').value = expense.category;
        document.getElementById('date').value = expense.date;
        expenses.splice(index, 1);
        renderExpenses();
    }

    function deleteExpense(index) {
        expenses.splice(index, 1);
        renderExpenses();
    }
});
