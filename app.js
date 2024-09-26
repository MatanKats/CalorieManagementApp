 /*
 name: matan katsnelson id: 208322248
 name: Nadav Yeshua id: 318949831
 name: Refael Rubinov  id: 315790246
 */

// Add an event listener to the form for handling the submission
document.getElementById('calorie-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get the values from the input fields
    const calorie = document.getElementById('calorie').value; // Number of calories
    const category = document.getElementById('category').value; // Selected category (BREAKFAST, LUNCH, etc.)
    const description = document.getElementById('description').value; // Description of the calorie item

    // Open the IndexedDB and await the promise resolution
    const db = await idb.openCaloriesDB("caloriesdb", 1);

    // Add the calorie item to the database with a timestamp
    const result = await db.addCalories({ calorie, category, description, timestamp: Date.now() });

    // Check if the item was added successfully
    if (result) {
        alert("Calorie item added successfully!"); // Notify the user of success
        e.target.reset(); // Reset the form fields

    }
});

// Add an event listener to the report generation button
document.getElementById('generate-report').addEventListener('click', async () => {
    // Get the selected month and year from the input field
    const month = new Date(document.getElementById('report-month').value).getMonth() + 1; // Get the month (1-based)
    const year = new Date(document.getElementById('report-month').value).getFullYear(); // Get the year

    // Open the IndexedDB and await the promise resolution
    const db = await idb.openCaloriesDB("caloriesdb", 1);

    // Retrieve the monthly report from the database
    const report = await db.getMonthlyReport(month, year);

    const reportList = document.getElementById('report-list'); // Get the list element to display the report
    reportList.innerHTML = ''; // Clear any previous report entries

    // Iterate over the report items and create a list item for each
    report.forEach(item => {
        const li = document.createElement('li'); // Create a new list item element
        li.textContent = `${item.description}: ${item.calorie} calories (${item.category})`; // Set the text content
        reportList.appendChild(li); // Append the list item to the report list
    });

    // Check if the report is empty and notify the user if there are no entries
    if (report.length === 0) {
        alert("No entries for this month.");
    }
});



