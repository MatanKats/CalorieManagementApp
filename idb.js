const idb = {
    // Function to open the IndexedDB database
    openCaloriesDB: function (dbName, version) {
        return new Promise((resolve, reject) => {

            // Open a connection to the IndexedDB database
            const request = indexedDB.open(dbName, version);

            // Handle successful opening of the database
            request.onsuccess = (event) => {
                const db = event.target.result;        // Get the database instance
                // Add methods to the db instance           // Bind methods to the database instance for later use
                db.addCalories = this.addCalories.bind(db);  // Bind addCalories method
                db.getMonthlyReport = this.getMonthlyReport.bind(db); // Bind getMonthlyReport method
                resolve(db);  // Resolve the promise with the database instance
            };

            // Handle errors when opening the database
            request.onerror = (event) => {
                reject("Database error: " + event.target.errorCode); // Reject the promise with an error message
            };

            // Handle the event when the database needs to be upgraded (e.g., new version)
            request.onupgradeneeded = (event) => {
                const db = event.target.result; // Get the database instance
                // Create an object store for calorie items with auto-incrementing keys
                db.createObjectStore("calories", { keyPath: "id", autoIncrement: true });
            };
        });
    },

    // Function to add calorie data to the database
    addCalories: function (calorieData) {
        return new Promise((resolve, reject) => {
            const transaction = this.transaction("calories", "readwrite");// Start a readwrite transaction
            const store = transaction.objectStore("calories"); // Get the object store for calorie items
            const request = store.add(calorieData); // Add the calorie data to the store

            // Handle successful addition of calorie data
            request.onsuccess = () => {
                resolve(true); // Resolve the promise indicating success
            };

            // Handle errors during the addition
            request.onerror = () => {
                reject("Add error: " + request.error); // Reject the promise with an error message
            };
        });
    },

    // Function to retrieve a monthly report of calorie items
    getMonthlyReport: function (month, year) {
        return new Promise((resolve, reject) => {
            const transaction = this.transaction("calories", "readonly"); // Start a readonly transaction
            const store = transaction.objectStore("calories"); // Get the object store for calorie items
            const report = []; // Initialize an array to hold the report items

            const request = store.openCursor(); // Open a cursor to iterate through the items in the store
            request.onsuccess = (event) => {
                const cursor = event.target.result;       // Get the cursor result
                if (cursor) {
                    const date = new Date(cursor.value.timestamp); // Assuming you have a timestamp // Extract the timestamp from the cursor value

                    // Check if the item's month and year match the specified month and year
                    if (date.getMonth() + 1 === month && date.getFullYear() === year) {
                        report.push(cursor.value);   // Add the item to the report array if it matches
                    }
                    cursor.continue(); // Continue to the next item in the cursor
                } else {
                    resolve(report); // Resolve the promise with the collected report items when done
                }
            };
            // Handle errors during the report retrieval
            request.onerror = () => {
                reject("Report error: " + request.error); // Reject the promise with an error message
            };
        });
    },
};



