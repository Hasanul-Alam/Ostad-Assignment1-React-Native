// === EXPENSE TRACKER SCRIPT ===

// Store for all expenses
const expenses = [];

// Predefined categories
const categories = [
  "food",
  "transport",
  "entertainment",
  "utilities",
  "healthcare",
  "shopping",
  "other",
];

// =====================
// UTILITY FUNCTIONS
// =====================

/**
 * Displays the expense tracker main menu.
 */
const showMenu = () => {
  console.log("=== EXPENSE TRACKER ===");
  console.log("1. Add Expense");
  console.log("2. View All Expenses");
  console.log("3. View by Category");
  console.log("4. Calculate Total");
  console.log("5. Remove Expense");
  console.log("6. Edit Expense");
  console.log("7. Generate Report");
  console.log("8. Show Categories");
  console.log("9. Exit");
  console.log("Choose option (1-9)");
  console.log("========================");
};

/**
 * Validates input for amount, category, and description.
 * @param {number} amount - The amount spent.
 * @param {string} category - The category of expense.
 * @param {string} description - A brief description.
 * @returns {boolean} True if valid, false otherwise.
 */
const checkValidity = (amount, category, description) => {
  if (amount <= 0) {
    console.warn("Amount must be greater than 0");
    return false;
  } else if (typeof amount !== "number") {
    console.error("Amount must be a number");
    return false;
  } else if (!categories.includes(category)) {
    console.error(`Category must be one of ${categories.join(", ")}`);
    return false;
  } else if (typeof description !== "string") {
    console.error("Description must be a string");
    return false;
  } else return true;
};

/**
 * Converts a number into a formatted currency string.
 * @param {number} amount - The amount to format.
 * @returns {string} Currency formatted string.
 */
const formatCurrency = (amount) => {
  const numAmount = Number(amount);
  return `$${numAmount.toFixed(2)}`;
};

// Show menu at start
showMenu();

// =========================
// 📦 EXPENSE FUNCTIONALITY
// =========================

/**
 * Adds a new expense to the list.
 * @param {number} amount - Expense amount.
 * @param {string} category - Expense category.
 * @param {string} description - Expense description.
 */
const addExpense = (amount, category, description) => {
  const isValidated = checkValidity(amount, category, description);
  if (isValidated) {
    const expense = {
      id: expenses.length + 1,
      amount,
      category,
      description,
      date: new Date(),
    };
    expenses.push(expense);
    console.log(`Expense added successfully. ID: ${expense.id}`);
  }
};

/**
 * Displays all expenses in the list.
 */
const allExpenses = () => {
  if (expenses.length > 0) {
    for (expense of expenses) {
      console.log(
        `ID: ${expense.id} | ${expense.amount} | ${expense.category} | ${
          expense.description
        } | ${expense.date.toISOString().split("T")[0]}`
      );
    }
  } else {
    console.log("No expenses found. Please add some.");
  }
};

/**
 * Alternative function to display all expenses (duplicated).
 */
const viewAllExpenses = () => {
  if (expenses.length > 0) {
    for (expense of expenses) {
      console.log(
        `ID: ${expense.id} | ${expense.amount} | ${expense.category} | ${
          expense.description
        } | ${expense.date.toISOString().split("T")[0]}`
      );
    }
  } else {
    console.log("No expenses found. Please add some.");
  }
};

/**
 * Displays all expenses of a given category and total.
 * @param {string} category - The category to filter.
 */
const viewByCategory = (category) => {
  if (!categories.includes(category)) {
    console.warn(`Category must be one of ${categories.join(", ")}`);
    return;
  } else {
    const filteredExpenses = expenses.filter(
      (expense) => expense.category === category
    );
    if (filteredExpenses.length > 0) {
      for (expense of filteredExpenses) {
        console.log(
          `ID: ${expense.id} | ${expense.amount} | ${expense.category} | ${
            expense.description
          } | ${expense.date.toISOString().split("T")[0]}`
        );
      }
      const totalByCategory = filteredExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      console.log(` Total for ${category}: $ ${totalByCategory}`);
    } else {
      console.log(`No expenses found for category: ${category}`);
    }
  }
};

/**
 * Calculates total amount of expenses, optionally by category.
 * @param {string} [category=""] - Optional category filter.
 */
const calculateTotal = (category = "") => {
  let total = 0;
  if (!expenses.length > 0) {
    console.log("No expenses found. Please add some.");
    return;
  }
  if (category.length > 0) {
    for (item of expenses) {
      if (item.category === category) {
        total += item.amount;
      }
    }
    console.log(`Total for ${category}: ${total}`);
  } else {
    for (item of expenses) {
      total += item.amount;
    }
    console.log(`Total: ${total}`);
  }
};

/**
 * Generates a detailed report of all expenses including totals, averages, and top category.
 */
function generateReport() {
  if (expenses.length === 0) {
    console.warn("No expenses to report.");
    return;
  }

  const categoryTotals = expenses.reduce((totals, expense) => {
    if (!totals[expense.category]) {
      totals[expense.category] = { total: 0, count: 0 };
    }
    totals[expense.category].total += expense.amount;
    totals[expense.category].count++;
    return totals;
  }, {});

  const currentDate = new Date();
  const monthYear = `${currentDate.toLocaleString("default", {
    month: "long",
  })} ${currentDate.getFullYear()}`;

  console.log(`EXPENSE REPORT - ${monthYear}`);
  console.log("================================");

  var grandTotal = 0;

  for (const [category, data] of Object.entries(categoryTotals)) {
    console.log(
      `${category}: ${formatCurrency(data.total)} (${data.count} expense${
        data.count !== 1 ? "s" : ""
      })`
    );
    grandTotal += data.total;
  }

  console.log("================================");
  console.log(
    `TOTAL: ${formatCurrency(grandTotal)} (${expenses.length} expenses)`
  );
  console.log(
    `AVERAGE: ${formatCurrency(grandTotal / expenses.length)} per expense`
  );

  const topCategory = Object.entries(categoryTotals).reduce(
    (max, [category, data]) =>
      data.total > max.total ? { category, total: data.total } : max,
    { category: "", total: 0 }
  );

  console.log(
    `TOP CATEGORY: ${topCategory.category} (${formatCurrency(
      topCategory.total
    )})\n`
  );
}

/**
 * Removes an expense by ID.
 * @param {number} id - Expense ID to remove.
 */
const removeExpense = (id) => {
  const idType = typeof id;
  if (idType !== "number") {
    console.error("ID must be a number");
    return;
  }
  const index = expenses.findIndex((exp) => exp.id === id);
  if (index !== -1) {
    expenses.splice(index, 1);
    console.log(`Expense with ID ${id} removed successfully!`);
  } else {
    console.log(`Expense with ID ${id} not found.`);
  }
};
