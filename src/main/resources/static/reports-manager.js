// Reports Management
const ReportsManager = {
    async loadRevenueByDriver() {
        try {
            const data = await ApiService.get('/reports/revenue-by-driver');
            this.renderReport('Revenue by Driver', [
                'Driver ID', 'First Name', 'Last Name', 'Total Revenue', 'Total Trips'
            ], data, (row) => [
                row.driverID,
                row.firstName || '',
                row.lastName || '',
                row.totalRevenue ? '$' + parseFloat(row.totalRevenue).toFixed(2) : '$0.00',
                row.totalTrips || 0
            ]);
        } catch (error) {
            showAlert('Error loading report: ' + error.message, 'error');
        }
    },

    async loadPopularPickupLocations() {
        try {
            const data = await ApiService.get('/reports/popular-pickup-locations');
            this.renderReport('Popular Pickup Locations', [
                'Location', 'Trip Count', 'Average Fare'
            ], data, (row) => [
                row.pickupLocation || 'N/A',
                row.tripCount || 0,
                row.averageFare ? '$' + parseFloat(row.averageFare).toFixed(2) : '$0.00'
            ]);
        } catch (error) {
            showAlert('Error loading report: ' + error.message, 'error');
        }
    },

    async loadActiveDriversWithCars() {
        try {
            const data = await ApiService.get('/reports/active-drivers-with-cars');
            
            // If no data, show assignment form
            if (!data || data.length === 0) {
                await this.showAssignmentForm();
                return;
            }
            
            this.renderReport('Active Drivers with Car Assignments', [
                'Driver ID', 'Driver Name', 'Driver Status', 'Car ID', 'Plate Number', 'Car Make/Model', 'Car Status'
            ], data, (row) => [
                row.driverID,
                (row.firstName || '') + ' ' + (row.lastName || ''),
                row.driverStatus || '',
                row.carID || '',
                row.plateNumber || '',
                (row.make || '') + ' ' + (row.model || ''),
                row.carStatus || ''
            ]);
        } catch (error) {
            // If error, still show the form
            await this.showAssignmentForm();
        }
    },

    async showAssignmentForm() {
        const container = document.getElementById('reports-results-container');
        
        try {
            // Fetch drivers and cars for dropdowns
            const [drivers, cars] = await Promise.all([
                ApiService.get('/drivers').catch(() => []),
                ApiService.get('/cars').catch(() => [])
            ]);

            const activeDrivers = (drivers || []).filter(d => d.status === 'Active' || !d.status);
            const availableCars = (cars || []).filter(c => c.status === 'Available' || c.status === 'In Use' || !c.status);

            let html = `<div style="margin-top: 40px; padding: 30px; background: rgba(20, 25, 45, 0.8); border-radius: 15px; border: 3px solid rgba(100, 200, 255, 0.4); box-shadow: 0 8px 25px rgba(100, 200, 255, 0.2);">`;
            html += `<h3 style="margin-top: 0; margin-bottom: 10px; color: #64c8ff; font-size: 1.8em; text-align: center; text-shadow: 0 2px 10px rgba(100, 200, 255, 0.3);">🚗 Create Driver-Car Assignment</h3>`;
            html += `<p style="text-align: center; color: #bbb; margin-bottom: 30px;">No active assignments found. Create a new shift assignment below.</p>`;
            
            html += `<form id="assignment-form" style="max-width: 600px; margin: 0 auto;">`;
            
            // Driver dropdown
            html += `<div class="form-group">`;
            html += `<label style="color: #64c8ff; font-weight: 600;">Select Driver *</label>`;
            html += `<select id="assignment-driverID" required style="width: 100%; padding: 12px; background: rgba(20, 25, 45, 0.8); border: 2px solid rgba(100, 200, 255, 0.3); border-radius: 5px; color: #e0e0e0; font-size: 16px;">`;
            html += `<option value="">-- Select a Driver --</option>`;
            (activeDrivers || []).forEach(driver => {
                const name = `${driver.firstName || ''} ${driver.lastName || ''}`.trim() || `Driver #${driver.driverID}`;
                html += `<option value="${driver.driverID}">${name} (ID: ${driver.driverID})${driver.status ? ' - ' + driver.status : ''}</option>`;
            });
            html += `</select>`;
            html += `</div>`;
            
            // Car dropdown
            html += `<div class="form-group">`;
            html += `<label style="color: #64c8ff; font-weight: 600;">Select Car *</label>`;
            html += `<select id="assignment-carID" required style="width: 100%; padding: 12px; background: rgba(20, 25, 45, 0.8); border: 2px solid rgba(100, 200, 255, 0.3); border-radius: 5px; color: #e0e0e0; font-size: 16px;">`;
            html += `<option value="">-- Select a Car --</option>`;
            (availableCars || []).forEach(car => {
                const carInfo = `${car.make || ''} ${car.model || ''}`.trim() || `Car #${car.carID}`;
                html += `<option value="${car.carID}">${car.plateNumber || 'N/A'} - ${carInfo} (ID: ${car.carID})${car.status ? ' - ' + car.status : ''}</option>`;
            });
            html += `</select>`;
            html += `</div>`;
            
            // Start time
            html += `<div class="form-group">`;
            html += `<label style="color: #64c8ff; font-weight: 600;">Shift Start Time *</label>`;
            const now = new Date();
            const startTime = now.toISOString().slice(0, 16);
            html += `<input type="datetime-local" id="assignment-startTime" value="${startTime}" required style="width: 100%; padding: 12px; background: rgba(20, 25, 45, 0.8); border: 2px solid rgba(100, 200, 255, 0.3); border-radius: 5px; color: #e0e0e0; font-size: 16px;">`;
            html += `</div>`;
            
            // End time (optional)
            html += `<div class="form-group">`;
            html += `<label style="color: #64c8ff; font-weight: 600;">Shift End Time (Optional)</label>`;
            const endTime = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 16);
            html += `<input type="datetime-local" id="assignment-endTime" value="${endTime}" style="width: 100%; padding: 12px; background: rgba(20, 25, 45, 0.8); border: 2px solid rgba(100, 200, 255, 0.3); border-radius: 5px; color: #e0e0e0; font-size: 16px;">`;
            html += `</div>`;
            
            // Submit button
            html += `<div class="form-actions" style="margin-top: 30px;">`;
            html += `<button type="button" class="btn btn-danger" onclick="ReportsManager.clearAssignmentForm()">Cancel</button>`;
            html += `<button type="submit" class="btn btn-success" style="background: linear-gradient(135deg, #64c8ff 0%, #4a9eff 100%); border: none;">Create Assignment</button>`;
            html += `</div>`;
            
            html += `</form>`;
            html += `</div>`;
            
            container.innerHTML = html;
            
            // Add form submit handler
            document.getElementById('assignment-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.createAssignment();
            });
            
            // Scroll to form
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
        } catch (error) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Unable to Load Assignment Form</h3>
                    <p>Error: ${error.message}</p>
                    <p style="margin-top: 20px;">Please ensure you have drivers and cars in the system first.</p>
                    <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 20px;">Refresh Page</button>
                </div>
            `;
        }
    },

    async createAssignment() {
        const formatDateTimeForAPI = (dtLocal) => {
            if (!dtLocal) return null;
            // Use the same format as shift-manager.js
            // Convert datetime-local to "YYYY-MM-DD HH:mm:ss" format
            return new Date(dtLocal).toISOString().slice(0, 19).replace('T', ' ');
        };

        try {
            const driverID = document.getElementById('assignment-driverID').value;
            const carID = document.getElementById('assignment-carID').value;
            const startTimeValue = document.getElementById('assignment-startTime').value;
            const endTimeValue = document.getElementById('assignment-endTime').value;

            if (!driverID || !carID || !startTimeValue) {
                showAlert('Please fill in all required fields', 'error');
                return;
            }

            const data = {
                driverID: parseInt(driverID),
                carID: parseInt(carID),
                startTime: formatDateTimeForAPI(startTimeValue),
                endTime: endTimeValue ? formatDateTimeForAPI(endTimeValue) : null
            };

            console.log('Sending shift data:', data);

            const response = await ApiService.post('/shifts', data);
            showAlert('Driver-Car assignment created successfully!', 'success');
            
            // Reload the report to show the new assignment
            setTimeout(() => {
                this.loadActiveDriversWithCars();
            }, 1000);
        } catch (error) {
            console.error('Error creating assignment:', error);
            const errorMsg = error.message || 'Unknown error occurred';
            showAlert('Error creating assignment: ' + errorMsg, 'error');
        }
    },

    clearAssignmentForm() {
        document.getElementById('reports-results-container').innerHTML = '';
    },

    async loadCustomerTripHistory() {
        try {
            const data = await ApiService.get('/reports/customer-trip-history');
            this.renderReport('Customer Trip History', [
                'Customer ID', 'Customer Name', 'Payment Method', 'Trip ID', 'Pickup', 'Dropoff', 'Fare', 'Payment Status', 'Request Time', 'Driver'
            ], data, (row) => [
                row.customerID,
                row.customerName || '',
                row.defaultPaymentMethod || 'N/A',
                row.tripID,
                row.pickupLocation || '',
                row.dropoffLocation || '',
                row.fareAmount ? '$' + parseFloat(row.fareAmount).toFixed(2) : '$0.00',
                row.paymentStatus || 'N/A',
                row.requestTime ? new Date(row.requestTime).toLocaleString() : '',
                (row.driverFirstName || '') + ' ' + (row.driverLastName || '')
            ]);
        } catch (error) {
            showAlert('Error loading report: ' + error.message, 'error');
        }
    },

    async loadCarUtilization() {
        try {
            const data = await ApiService.get('/reports/car-utilization');
            this.renderReport('Car Utilization Statistics', [
                'Car ID', 'Plate Number', 'Make/Model', 'Status', 'Total Trips', 'Total Shifts', 'Total Revenue', 'Average Fare'
            ], data, (row) => [
                row.carID,
                row.plateNumber || '',
                (row.make || '') + ' ' + (row.model || ''),
                row.status || '',
                row.totalTrips || 0,
                row.totalShifts || 0,
                row.totalRevenue ? '$' + parseFloat(row.totalRevenue).toFixed(2) : '$0.00',
                row.averageFare ? '$' + parseFloat(row.averageFare).toFixed(2) : '$0.00'
            ]);
        } catch (error) {
            showAlert('Error loading report: ' + error.message, 'error');
        }
    },

    async loadPendingPayments() {
        try {
            const data = await ApiService.get('/reports/pending-payments');
            this.renderReport('Payment Status Summary', [
                'Payment Status', 'Count', 'Total Amount', 'Average Amount'
            ], data, (row) => [
                row.paymentStatus || 'N/A',
                row.count || 0,
                row.totalAmount ? '$' + parseFloat(row.totalAmount).toFixed(2) : '$0.00',
                row.averageAmount ? '$' + parseFloat(row.averageAmount).toFixed(2) : '$0.00'
            ]);
        } catch (error) {
            showAlert('Error loading report: ' + error.message, 'error');
        }
    },

    async loadDailyRevenue() {
        try {
            const data = await ApiService.get('/reports/daily-revenue');
            this.renderReport('Daily Revenue Report (Last 30 Days)', [
                'Date', 'Trip Count', 'Daily Revenue', 'Average Fare'
            ], data, (row) => [
                row.date ? new Date(row.date).toLocaleDateString() : '',
                row.tripCount || 0,
                row.dailyRevenue ? '$' + parseFloat(row.dailyRevenue).toFixed(2) : '$0.00',
                row.averageFare ? '$' + parseFloat(row.averageFare).toFixed(2) : '$0.00'
            ]);
        } catch (error) {
            showAlert('Error loading report: ' + error.message, 'error');
        }
    },

    async loadTopCustomers() {
        try {
            const data = await ApiService.get('/reports/top-customers');
            this.renderReport('Top Customers by Spending', [
                'Customer ID', 'Name', 'Email', 'Total Trips', 'Total Spent', 'Average Trip Cost', 'Last Trip Date'
            ], data, (row) => [
                row.customerID,
                row.name || '',
                row.email || '',
                row.totalTrips || 0,
                row.totalSpent ? '$' + parseFloat(row.totalSpent).toFixed(2) : '$0.00',
                row.averageTripCost ? '$' + parseFloat(row.averageTripCost).toFixed(2) : '$0.00',
                row.lastTripDate ? new Date(row.lastTripDate).toLocaleString() : ''
            ]);
        } catch (error) {
            showAlert('Error loading report: ' + error.message, 'error');
        }
    },

    renderReport(title, headers, data, rowMapper) {
        const container = document.getElementById('reports-results-container');
        
        if (!data || data.length === 0) {
            container.innerHTML = `<div class="empty-state"><h3>No data available</h3><p>No results found for this report.</p></div>`;
            return;
        }

        let html = `<div style="margin-top: 40px; padding: 20px; background: rgba(20, 25, 45, 0.6); border-radius: 10px; border: 2px solid rgba(255, 200, 0, 0.3);">`;
        html += `<h3 style="margin-top: 0; margin-bottom: 25px; color: #ffd700; font-size: 1.8em; text-align: center; text-shadow: 0 2px 10px rgba(255, 200, 0, 0.3);">${title}</h3>`;
        html += `<div style="overflow-x: auto;">`;
        html += '<table><thead><tr>';
        
        headers.forEach(header => {
            html += `<th>${header}</th>`;
        });
        
        html += '</tr></thead><tbody>';

        data.forEach(row => {
            const mappedRow = rowMapper(row);
            html += '<tr>';
            mappedRow.forEach(cell => {
                html += `<td>${cell || ''}</td>`;
            });
            html += '</tr>';
        });

        html += '</tbody></table>';
        html += `</div></div>`;
        container.innerHTML = html;
        
        // Scroll to results
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

