let records = [];
let totalWaste = 0;

function previewMessage() {
    const select = document.getElementById('notificationSelect');
    const previewText = document.getElementById('previewText');
    previewText.textContent = select.value || 'No message selected.';
}

function showSchedule() {
    const selectedDay = document.getElementById('daySelect').value;
    const selectedSchedule = document.getElementById('selected-schedule');
    const scheduleTimes = document.getElementById('scheduleTimes');
    const selectedDayDisplay = document.getElementById('selectedDay');

    if (selectedDay) {
        selectedDayDisplay.textContent = selectedDay;
        // Example schedule times, you can customize this
        scheduleTimes.textContent = '7 AM - 10 AM: Green Waste Collection';
        selectedSchedule.style.display = 'block';
    } else {
        selectedSchedule.style.display = 'none';
    }
}

function submitFeedback() {
    const feedbackText = document.getElementById('feedbackText').value;
    if (feedbackText) {
        // Logic to handle feedback submission (e.g., send to server)
        alert('Thank you for your feedback!');
        document.getElementById('feedbackText').value = ''; // Clear textarea
    } else {
        alert('Please enter your feedback before submitting.');
    }
}

function sendInfo() {
    // Logic to send the summary information via email/SMS
    const announcement = document.getElementById('announcementText').value || 'No announcement provided.';
    const notificationMessage = document.getElementById('previewText').textContent;
    const selectedSchedule = document.getElementById('selectedDay').textContent || 'No schedule selected.';

    document.getElementById('summary-announcement').textContent = announcement;
    document.getElementById('summary-notification').textContent = notificationMessage;
    document.getElementById('summary-schedule').textContent = selectedSchedule;

    document.getElementById('summary-display').style.display = 'block';
    document.getElementById('send-info-btn').style.display = 'block';
}

// New function to add waste records
function addWasteRecord() {
    const wasteType = document.getElementById("wasteType").value;
    const recyclableMaterials = Array.from(document.getElementById("recyclableMaterial").selectedOptions)
                                     .map(option => option.value);
    const quantity = parseFloat(document.getElementById("quantity").value) || 0;
    const location = document.getElementById("location").value;
    const pickupTime = document.getElementById("pickupTime").value;

    if (wasteType && location && pickupTime && (wasteType !== "Recyclable" || recyclableMaterials.length > 0)) {
        const record = { wasteType, recyclableMaterials, quantity, location, pickupTime };
        
        // Send the new record to the server
        fetch('/add-record', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(record)
        })
        .then(response => response.json())
        .then(data => {
            records.push(data); // Assuming the server returns the saved record
            totalWaste += quantity;
            updateRecordsTable();
            updateAnalytics();
            document.getElementById("wasteForm").reset();
            document.getElementById("recyclableInfo").style.display = "none";
        })
        .catch(error => console.error('Error adding record:', error));
    } else {
        alert("Please fill all fields before submitting.");
    }
}

function updateRecordsTable() {
    const tableBody = document.querySelector("#recordsTable tbody");
    tableBody.innerHTML = "";
    records.forEach((record, index) => {
        const materials = record.wasteType === "Recyclable" ? record.recyclableMaterials.join(", ") : "N/A";
        
        // Format the pickup time correctly
        const formattedPickupTime = record.pickupTime.replace('T', ' '); // Replace 'T' with space

        const row = `<tr>
            <td>${index + 1}</td>
            <td>${record.wasteType}</td>
            <td>${materials}</td>
            <td>${record.quantity} kg</td>
            <td>${record.location}</td>
            <td>${formattedPickupTime}</td> <!-- Use formatted pickup time -->
        </tr>`;
        tableBody.innerHTML += row;
    });

    if (records.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No records available.</td></tr>';
    }
}

function updateAnalytics() {
    document.getElementById("totalWaste").innerText = totalWaste;
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js")
            .then((registration) => {
                console.log("Service Worker registered with scope:", registration.scope);
            })
            .catch((error) => {
                console.log("Service Worker registration failed:", error);
            });
    });
}
