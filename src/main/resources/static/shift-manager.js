// Shift Management
const ShiftManager = {
    async loadShifts() {
        try {
            const shifts = await ApiService.get('/shifts');
            this.renderShiftsTable(shifts);
        } catch (error) {
            showAlert('Error loading shifts: ' + error.message, 'error');
        }
    },

    renderShiftsTable(shifts) {
        const container = document.getElementById('shifts-table-container');
        
        if (!shifts || shifts.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No shifts found</h3><p>Click "Add New Shift" to create one.</p></div>';
            return;
        }

        let html = '<table><thead><tr>';
        html += '<th>ID</th><th>Driver ID</th><th>Car ID</th><th>Start Time</th><th>End Time</th><th>Actions</th>';
        html += '</tr></thead><tbody>';

        shifts.forEach(shift => {
            html += `<tr>
                <td>${shift.shiftID || ''}</td>
                <td>${shift.driverID || ''}</td>
                <td>${shift.carID || ''}</td>
                <td>${shift.startTime ? new Date(shift.startTime).toLocaleString() : ''}</td>
                <td>${shift.endTime ? new Date(shift.endTime).toLocaleString() : ''}</td>
                <td>
                    <button class="btn btn-warning" onclick="ShiftManager.showEditForm(${shift.shiftID})">Edit</button>
                    <button class="btn btn-danger" onclick="ShiftManager.deleteShift(${shift.shiftID})">Delete</button>
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
        ApiService.get(`/shifts/${id}`)
            .then(shift => {
                this.showForm(shift);
            })
            .catch(error => {
                showAlert('Error loading shift: ' + error.message, 'error');
            });
    },

    showForm(shift = null) {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modal-body');
        
        const isEdit = shift !== null;
        const title = isEdit ? 'Edit Shift' : 'Add New Shift';
        
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
            <form id="shift-form">
                <div class="form-group">
                    <label>Driver ID</label>
                    <input type="number" id="driverID" value="${shift?.driverID || ''}">
                </div>
                <div class="form-group">
                    <label>Car ID</label>
                    <input type="number" id="carID" value="${shift?.carID || ''}">
                </div>
                <div class="form-group">
                    <label>Start Time</label>
                    <input type="datetime-local" id="startTime" value="${formatDateTime(shift?.startTime)}">
                </div>
                <div class="form-group">
                    <label>End Time</label>
                    <input type="datetime-local" id="endTime" value="${formatDateTime(shift?.endTime)}">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-danger" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-success">${isEdit ? 'Update' : 'Create'}</button>
                </div>
            </form>
        `;

        document.getElementById('shift-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveShift(shift?.shiftID);
        });

        modal.style.display = 'block';
    },

    async saveShift(id) {
        const formatDateTimeForAPI = (dtLocal) => {
            if (!dtLocal) return null;
            return new Date(dtLocal).toISOString().slice(0, 19).replace('T', ' ');
        };

        const data = {
            driverID: document.getElementById('driverID').value ? parseInt(document.getElementById('driverID').value) : null,
            carID: document.getElementById('carID').value ? parseInt(document.getElementById('carID').value) : null,
            startTime: formatDateTimeForAPI(document.getElementById('startTime').value),
            endTime: formatDateTimeForAPI(document.getElementById('endTime').value)
        };

        try {
            if (id) {
                await ApiService.put(`/shifts/${id}`, data);
                showAlert('Shift updated successfully!');
            } else {
                await ApiService.post('/shifts', data);
                showAlert('Shift created successfully!');
            }
            closeModal();
            this.loadShifts();
        } catch (error) {
            showAlert('Error saving shift: ' + error.message, 'error');
        }
    },

    async deleteShift(id) {
        if (!confirm('Are you sure you want to delete this shift?')) {
            return;
        }

        try {
            await ApiService.delete(`/shifts/${id}`);
            showAlert('Shift deleted successfully!');
            this.loadShifts();
        } catch (error) {
            showAlert('Error deleting shift: ' + error.message, 'error');
        }
    }
};

