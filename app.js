function addWasteRecord() {
    const username = window.localStorage.getItem("username"); // Get the current user's username
    const wasteType = document.getElementById("wasteType").value;
    const quantity = parseFloat(document.getElementById("quantity").value);
    const location = document.getElementById("location").value;
    const pickupTime = document.getElementById("pickupTime").value;

    if (wasteType && quantity && location && pickupTime) {
        const record = { username, wasteType, quantity, location, pickupTime };

        // Send record to the server
        fetch('/addRecord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(record)
        }).then(response => {
            if (response.ok) {
                alert("Record added successfully!");
                updateRecordsTable(); // Refresh the records table
            } else {
                alert("Failed to add record.");
            }
        });

        totalWaste += quantity;
        document.getElementById("wasteForm").reset();
    } else {
        alert("Please fill all fields before submitting.");
    }
}
function updateRecordsTable() {
    const tableBody = document.querySelector("#recordsTable tbody");
    tableBody.innerHTML = "";
    records.forEach((record, index) => {
        const row = `<tr>
            <td>${index + 1}</td>
            <td>${record.username}</td> <!-- Display username -->
            <td>${record.wasteType}</td>
            <td>${record.quantity} kg</td>
            <td>${record.location}</td>
            <td>${new Date(record.pickupTime).toLocaleString()}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });

    if (records.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No records available.</td></tr>';
    }
}
