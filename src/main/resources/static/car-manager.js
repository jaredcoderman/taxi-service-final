// Car Management
const CarManager = {
    async loadCars() {
        try {
            const cars = await ApiService.get('/cars');
            this.renderCarsTable(cars);
        } catch (error) {
            const errorMsg = error.message || 'Unknown error occurred';
            console.error('Error loading cars:', error);
            showAlert('Error loading cars: ' + errorMsg, 'error');
        }
    },

    renderCarsTable(cars) {
        const container = document.getElementById('cars-table-container');
        
        if (!cars || cars.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No cars found</h3><p>Click "Add New Car" to create one.</p></div>';
            return;
        }

        let html = '<table><thead><tr>';
        html += '<th>ID</th><th>Plate Number</th><th>Make</th><th>Model</th>';
        html += '<th>Year</th><th>Status</th><th>Actions</th>';
        html += '</tr></thead><tbody>';

        cars.forEach(car => {
            html += `<tr>
                <td>${car.carID || ''}</td>
                <td>${car.plateNumber || ''}</td>
                <td>${car.make || ''}</td>
                <td>${car.model || ''}</td>
                <td>${car.year || ''}</td>
                <td>${car.status || ''}</td>
                <td>
                    <button class="btn btn-warning" onclick="CarManager.showEditForm(${car.carID})">Edit</button>
                    <button class="btn btn-danger" onclick="CarManager.deleteCar(${car.carID})">Delete</button>
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
        ApiService.get(`/cars/${id}`)
            .then(car => {
                this.showForm(car);
            })
            .catch(error => {
                showAlert('Error loading car: ' + error.message, 'error');
            });
    },

    showForm(car = null) {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modal-body');
        
        const isEdit = car !== null;
        const title = isEdit ? 'Edit Car' : 'Add New Car';
        
        modalBody.innerHTML = `
            <h2>${title}</h2>
            <form id="car-form">
                <div class="form-group">
                    <label>Plate Number *</label>
                    <input type="text" id="plateNumber" value="${car?.plateNumber || ''}" required>
                </div>
                <div class="form-group">
                    <label>Make *</label>
                    <input type="text" id="make" value="${car?.make || ''}" required>
                </div>
                <div class="form-group">
                    <label>Model *</label>
                    <input type="text" id="model" value="${car?.model || ''}" required>
                </div>
                <div class="form-group">
                    <label>Year</label>
                    <input type="number" id="year" value="${car?.year || ''}" min="1900" max="2100">
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select id="status">
                        <option value="Available" ${car?.status === 'Available' ? 'selected' : ''}>Available</option>
                        <option value="In Use" ${car?.status === 'In Use' ? 'selected' : ''}>In Use</option>
                        <option value="Maintenance" ${car?.status === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
                        <option value="Retired" ${car?.status === 'Retired' ? 'selected' : ''}>Retired</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-danger" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-success">${isEdit ? 'Update' : 'Create'}</button>
                </div>
            </form>
        `;

        document.getElementById('car-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCar(car?.carID);
        });

        modal.style.display = 'block';
    },

    async saveCar(id) {
        const data = {
            plateNumber: document.getElementById('plateNumber').value,
            make: document.getElementById('make').value,
            model: document.getElementById('model').value,
            year: document.getElementById('year').value ? parseInt(document.getElementById('year').value) : null,
            status: document.getElementById('status').value
        };

        try {
            if (id) {
                await ApiService.put(`/cars/${id}`, data);
                showAlert('Car updated successfully!');
            } else {
                await ApiService.post('/cars', data);
                showAlert('Car created successfully!');
            }
            closeModal();
            this.loadCars();
        } catch (error) {
            showAlert('Error saving car: ' + error.message, 'error');
        }
    },

    async deleteCar(id) {
        if (!confirm('Are you sure you want to delete this car?')) {
            return;
        }

        try {
            await ApiService.delete(`/cars/${id}`);
            showAlert('Car deleted successfully!');
            this.loadCars();
        } catch (error) {
            showAlert('Error deleting car: ' + error.message, 'error');
        }
    }
};

