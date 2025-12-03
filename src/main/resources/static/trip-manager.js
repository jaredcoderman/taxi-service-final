// Trip Management
const TripManager = {
    async loadTrips() {
        try {
            const trips = await ApiService.get('/trips');
            this.renderTripsTable(trips);
        } catch (error) {
            showAlert('Error loading trips: ' + error.message, 'error');
        }
    },

    renderTripsTable(trips) {
        const container = document.getElementById('trips-table-container');
        
        if (!trips || trips.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No trips found</h3><p>Click "Add New Trip" to create one.</p></div>';
            return;
        }

        let html = '<table><thead><tr>';
        html += '<th>ID</th><th>Customer ID</th><th>Driver ID</th><th>Car ID</th>';
        html += '<th>Pickup Location</th><th>Dropoff Location</th><th>Request Time</th>';
        html += '<th>Pickup Time</th><th>Dropoff Time</th><th>Fare Amount</th><th>Payment Status</th><th>Actions</th>';
        html += '</tr></thead><tbody>';

        trips.forEach(trip => {
            html += `<tr>
                <td>${trip.tripID || ''}</td>
                <td>${trip.customerID || ''}</td>
                <td>${trip.driverID || ''}</td>
                <td>${trip.carID || ''}</td>
                <td>${trip.pickupLocation || ''}</td>
                <td>${trip.dropoffLocation || ''}</td>
                <td>${trip.requestTime ? new Date(trip.requestTime).toLocaleString() : ''}</td>
                <td>${trip.pickupTime ? new Date(trip.pickupTime).toLocaleString() : ''}</td>
                <td>${trip.dropoffTime ? new Date(trip.dropoffTime).toLocaleString() : ''}</td>
                <td>${trip.fareAmount ? '$' + parseFloat(trip.fareAmount).toFixed(2) : ''}</td>
                <td>${trip.paymentStatus || ''}</td>
                <td>
                    <button class="btn btn-warning" onclick="TripManager.showEditForm(${trip.tripID})">Edit</button>
                    <button class="btn btn-danger" onclick="TripManager.deleteTrip(${trip.tripID})">Delete</button>
                </td>
            </tr>`;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    },

    showCreateForm() {
        this.showForm();
    },

    showEditForm(id) {
        ApiService.get(`/trips/${id}`)
            .then(trip => {
                this.showForm(trip);
            })
            .catch(error => {
                showAlert('Error loading trip: ' + error.message, 'error');
            });
    },

    showForm(trip = null) {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modal-body');
        
        const isEdit = trip !== null;
        const title = isEdit ? 'Edit Trip' : 'Add New Trip';
        
        // Format datetime for input fields
        const formatDateTime = (dt) => {
            if (!dt) return '';
            const d = new Date(dt);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        };
        
        modalBody.innerHTML = `
            <h2>${title}</h2>
            <form id="trip-form">
                <div class="form-group">
                    <label>Customer ID</label>
                    <input type="number" id="customerID" value="${trip?.customerID || ''}">
                </div>
                <div class="form-group">
                    <label>Driver ID</label>
                    <input type="number" id="driverID" value="${trip?.driverID || ''}">
                </div>
                <div class="form-group">
                    <label>Car ID</label>
                    <input type="number" id="carID" value="${trip?.carID || ''}">
                </div>
                <div class="form-group">
                    <label>Pickup Location</label>
                    <input type="text" id="pickupLocation" value="${trip?.pickupLocation || ''}">
                </div>
                <div class="form-group">
                    <label>Dropoff Location</label>
                    <input type="text" id="dropoffLocation" value="${trip?.dropoffLocation || ''}">
                </div>
                <div class="form-group">
                    <label>Request Time</label>
                    <input type="datetime-local" id="requestTime" value="${formatDateTime(trip?.requestTime)}">
                </div>
                <div class="form-group">
                    <label>Pickup Time</label>
                    <input type="datetime-local" id="pickupTime" value="${formatDateTime(trip?.pickupTime)}">
                </div>
                <div class="form-group">
                    <label>Dropoff Time</label>
                    <input type="datetime-local" id="dropoffTime" value="${formatDateTime(trip?.dropoffTime)}">
                </div>
                <div class="form-group">
                    <label>Fare Amount</label>
                    <input type="number" step="0.01" id="fareAmount" value="${trip?.fareAmount || ''}">
                </div>
                <div class="form-group">
                    <label>Payment Status</label>
                    <select id="paymentStatus">
                        <option value="">Select...</option>
                        <option value="Pending" ${trip?.paymentStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Paid" ${trip?.paymentStatus === 'Paid' ? 'selected' : ''}>Paid</option>
                        <option value="Failed" ${trip?.paymentStatus === 'Failed' ? 'selected' : ''}>Failed</option>
                        <option value="Refunded" ${trip?.paymentStatus === 'Refunded' ? 'selected' : ''}>Refunded</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-danger" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-success">${isEdit ? 'Update' : 'Create'}</button>
                </div>
            </form>
        `;

        document.getElementById('trip-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTrip(trip?.tripID);
        });

        modal.style.display = 'block';
    },

    async saveTrip(id) {
        const formatDateTimeForAPI = (dtLocal) => {
            if (!dtLocal) return null;
            return new Date(dtLocal).toISOString().slice(0, 19).replace('T', ' ');
        };

        const data = {
            customerID: document.getElementById('customerID').value ? parseInt(document.getElementById('customerID').value) : null,
            driverID: document.getElementById('driverID').value ? parseInt(document.getElementById('driverID').value) : null,
            carID: document.getElementById('carID').value ? parseInt(document.getElementById('carID').value) : null,
            pickupLocation: document.getElementById('pickupLocation').value || null,
            dropoffLocation: document.getElementById('dropoffLocation').value || null,
            requestTime: formatDateTimeForAPI(document.getElementById('requestTime').value),
            pickupTime: formatDateTimeForAPI(document.getElementById('pickupTime').value),
            dropoffTime: formatDateTimeForAPI(document.getElementById('dropoffTime').value),
            fareAmount: document.getElementById('fareAmount').value ? parseFloat(document.getElementById('fareAmount').value) : null,
            paymentStatus: document.getElementById('paymentStatus').value || null
        };

        try {
            if (id) {
                await ApiService.put(`/trips/${id}`, data);
                showAlert('Trip updated successfully!');
            } else {
                await ApiService.post('/trips', data);
                showAlert('Trip created successfully!');
            }
            closeModal();
            this.loadTrips();
        } catch (error) {
            showAlert('Error saving trip: ' + error.message, 'error');
        }
    },

    async deleteTrip(id) {
        if (!confirm('Are you sure you want to delete this trip?')) {
            return;
        }

        try {
            await ApiService.delete(`/trips/${id}`);
            showAlert('Trip deleted successfully!');
            this.loadTrips();
        } catch (error) {
            showAlert('Error deleting trip: ' + error.message, 'error');
        }
    }
};

