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
