// Customer Management
const CustomerManager = {
    async loadCustomers() {
        try {
            const customers = await ApiService.get('/customers');
            this.renderCustomersTable(customers);
        } catch (error) {
            showAlert('Error loading customers: ' + error.message, 'error');
        }
    },

    renderCustomersTable(customers) {
        const container = document.getElementById('customers-table-container');
        
        if (!customers || customers.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No customers found</h3><p>Click "Add New Customer" to create one.</p></div>';
            return;
        }

        let html = '<table><thead><tr>';
        html += '<th>ID</th><th>Name</th><th>Phone</th><th>Email</th>';
        html += '<th>Default Payment Method</th><th>Actions</th>';
        html += '</tr></thead><tbody>';

        customers.forEach(customer => {
            html += `<tr>
                <td>${customer.customerID || ''}</td>
                <td>${customer.name || ''}</td>
                <td>${customer.phone || ''}</td>
                <td>${customer.email || ''}</td>
                <td>${customer.defaultPaymentMethod || ''}</td>
                <td>
                    <button class="btn btn-warning" onclick="CustomerManager.showEditForm(${customer.customerID})">Edit</button>
                    <button class="btn btn-danger" onclick="CustomerManager.deleteCustomer(${customer.customerID})">Delete</button>
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
        ApiService.get(`/customers/${id}`)
            .then(customer => {
                this.showForm(customer);
            })
            .catch(error => {
                showAlert('Error loading customer: ' + error.message, 'error');
            });
    },

    showForm(customer = null) {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modal-body');
        
        const isEdit = customer !== null;
        const title = isEdit ? 'Edit Customer' : 'Add New Customer';
        
        modalBody.innerHTML = `
            <h2>${title}</h2>
            <form id="customer-form">
                <div class="form-group">
                    <label>Name *</label>
                    <input type="text" id="name" value="${customer?.name || ''}" required>
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="text" id="phone" value="${customer?.phone || ''}">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="email" value="${customer?.email || ''}">
                </div>
                <div class="form-group">
                    <label>Default Payment Method</label>
                    <select id="defaultPaymentMethod">
                        <option value="">Select...</option>
                        <option value="Cash" ${customer?.defaultPaymentMethod === 'Cash' ? 'selected' : ''}>Cash</option>
                        <option value="Credit Card" ${customer?.defaultPaymentMethod === 'Credit Card' ? 'selected' : ''}>Credit Card</option>
                        <option value="Debit Card" ${customer?.defaultPaymentMethod === 'Debit Card' ? 'selected' : ''}>Debit Card</option>
                        <option value="Mobile Payment" ${customer?.defaultPaymentMethod === 'Mobile Payment' ? 'selected' : ''}>Mobile Payment</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-danger" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-success">${isEdit ? 'Update' : 'Create'}</button>
                </div>
            </form>
        `;

        document.getElementById('customer-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCustomer(customer?.customerID);
        });

        modal.style.display = 'block';
    },

    async saveCustomer(id) {
        const data = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            defaultPaymentMethod: document.getElementById('defaultPaymentMethod').value || null
        };

        try {
            if (id) {
                await ApiService.put(`/customers/${id}`, data);
                showAlert('Customer updated successfully!');
            } else {
                await ApiService.post('/customers', data);
                showAlert('Customer created successfully!');
            }
            closeModal();
            this.loadCustomers();
        } catch (error) {
            showAlert('Error saving customer: ' + error.message, 'error');
        }
    },

    async deleteCustomer(id) {
        if (!confirm('Are you sure you want to delete this customer?')) {
            return;
        }

        try {
            await ApiService.delete(`/customers/${id}`);
            showAlert('Customer deleted successfully!');
            this.loadCustomers();
        } catch (error) {
            showAlert('Error deleting customer: ' + error.message, 'error');
        }
    }
};

