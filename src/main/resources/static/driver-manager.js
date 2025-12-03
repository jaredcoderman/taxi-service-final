// Driver Management
const DriverManager = {
    async loadDrivers() {
        try {
            const drivers = await ApiService.get('/drivers');
            this.renderDriversTable(drivers);
        } catch (error) {
            const errorMsg = error.message || 'Unknown error occurred';
            console.error('Error loading drivers:', error);
            showAlert('Error loading drivers: ' + errorMsg, 'error');
        }
    },

    renderDriversTable(drivers) {
        const container = document.getElementById('drivers-table-container');
        
        if (!drivers || drivers.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No drivers found</h3><p>Click "Add New Driver" to create one.</p></div>';
            return;
        }

        let html = '<table><thead><tr>';
        html += '<th>ID</th><th>First Name</th><th>Last Name</th><th>License Number</th>';
        html += '<th>Phone</th><th>Hire Date</th><th>Status</th><th>Actions</th>';
        html += '</tr></thead><tbody>';

        drivers.forEach(driver => {
            html += `<tr>
                <td>${driver.driverID || ''}</td>
                <td>${driver.firstName || ''}</td>
                <td>${driver.lastName || ''}</td>
                <td>${driver.licenseNumber || ''}</td>
                <td>${driver.phone || ''}</td>
                <td>${driver.hireDate || ''}</td>
                <td>${driver.status || ''}</td>
                <td>
                    <button class="btn btn-warning" onclick="DriverManager.showEditForm(${driver.driverID})">Edit</button>
                    <button class="btn btn-danger" onclick="DriverManager.deleteDriver(${driver.driverID})">Delete</button>
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
        ApiService.get(`/drivers/${id}`)
            .then(driver => {
                this.showForm(driver);
            })
            .catch(error => {
                showAlert('Error loading driver: ' + error.message, 'error');
            });
    },

    showForm(driver = null) {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modal-body');
        
        const isEdit = driver !== null;
        const title = isEdit ? 'Edit Driver' : 'Add New Driver';
        
        modalBody.innerHTML = `
            <h2>${title}</h2>
            <form id="driver-form">
                <div class="form-group">
                    <label>First Name *</label>
                    <input type="text" id="firstName" value="${driver?.firstName || ''}" required>
                </div>
                <div class="form-group">
                    <label>Last Name *</label>
                    <input type="text" id="lastName" value="${driver?.lastName || ''}" required>
                </div>
                <div class="form-group">
                    <label>License Number *</label>
                    <input type="text" id="licenseNumber" value="${driver?.licenseNumber || ''}" required>
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="text" id="phone" value="${driver?.phone || ''}">
                </div>
                <div class="form-group">
                    <label>Hire Date</label>
                    <input type="date" id="hireDate" value="${driver?.hireDate || ''}">
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select id="status">
                        <option value="Active" ${driver?.status === 'Active' ? 'selected' : ''}>Active</option>
                        <option value="Inactive" ${driver?.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                        <option value="On Leave" ${driver?.status === 'On Leave' ? 'selected' : ''}>On Leave</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-danger" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-success">${isEdit ? 'Update' : 'Create'}</button>
                </div>
            </form>
        `;

        document.getElementById('driver-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveDriver(driver?.driverID);
        });

        modal.style.display = 'block';
    },

    async saveDriver(id) {
        const data = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            licenseNumber: document.getElementById('licenseNumber').value,
            phone: document.getElementById('phone').value,
            hireDate: document.getElementById('hireDate').value || null,
            status: document.getElementById('status').value
        };

        try {
            if (id) {
                await ApiService.put(`/drivers/${id}`, data);
                showAlert('Driver updated successfully!');
            } else {
                await ApiService.post('/drivers', data);
                showAlert('Driver created successfully!');
            }
            closeModal();
            this.loadDrivers();
        } catch (error) {
            showAlert('Error saving driver: ' + error.message, 'error');
        }
    },

    async deleteDriver(id) {
        if (!confirm('Are you sure you want to delete this driver?')) {
            return;
        }

        try {
            await ApiService.delete(`/drivers/${id}`);
            showAlert('Driver deleted successfully!');
            this.loadDrivers();
        } catch (error) {
            showAlert('Error deleting driver: ' + error.message, 'error');
        }
    }
};

