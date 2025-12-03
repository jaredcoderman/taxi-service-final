// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    // Navigation handling
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            
            // Update active nav button
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetPage).classList.add('active');
            
            // Load data for the active section
            loadSectionData(targetPage);
        });
    });

    // Load initial data
    loadSectionData('drivers');
});

function loadSectionData(section) {
    switch(section) {
        case 'drivers':
            DriverManager.loadDrivers();
            break;
        case 'cars':
            CarManager.loadCars();
            break;
        case 'customers':
            CustomerManager.loadCustomers();
            break;
        case 'trips':
            TripManager.loadTrips();
            break;
        case 'shifts':
            ShiftManager.loadShifts();
            break;
        case 'reports':
            // Clear any previous report results
            document.getElementById('reports-results-container').innerHTML = '';
            break;
    }
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}

function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const main = document.querySelector('main');
    main.insertBefore(alertDiv, main.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

