let token = localStorage.getItem('token');
let selectedStation = null;
const API_BASE_URL = '/api/v1';

// Authentication functions
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            token = data.access_token;
            localStorage.setItem('token', token);
            updateAuthUI();
            loadStations();
        } else {
            showError('Invalid credentials');
        }
    } catch (error) {
        showError('Error during login');
    }
}

function logout() {
    token = null;
    localStorage.removeItem('token');
    updateAuthUI();
    clearStations();
}

function updateAuthUI() {
    const loginForm = document.getElementById('login-form');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');

    if (token) {
        loginForm.style.display = 'none';
        userInfo.style.display = 'flex';
        const payload = JSON.parse(atob(token.split('.')[1]));
        usernameDisplay.textContent = payload.username;
    } else {
        loginForm.style.display = 'flex';
        userInfo.style.display = 'none';
    }
}

// Station management functions
async function loadStations() {
    try {
        console.log('loadStations');
        const response = await fetch(`${API_BASE_URL}/stations`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        if (response.ok) {
            const stations = await response.json();
            displayStations(stations);
        } else {
            showError('Failed to load stations');
        }
    } catch (error) {
        showError('Error loading stations');
    }
}

function displayStations(stations) {
    const stationsList = document.getElementById('stations-list');
    stationsList.innerHTML = '';

    stations.forEach(station => {
        const stationElement = document.createElement('div');
        stationElement.className = 'station-item';
        if (selectedStation && selectedStation.id === station.id) {
            stationElement.classList.add('active');
        }
        stationElement.innerHTML = `
            <div>${station.chargePointId}</div>
            <div class="status-${station.status.toLowerCase()}">${station.status}</div>
        `;
        stationElement.onclick = () => selectStation(station);
        stationsList.appendChild(stationElement);
    });
}

function selectStation(station) {
    selectedStation = station;
    displayStationDetails(station);
    loadStations();
}

function displayStationDetails(station) {
    const stationDetails = document.getElementById('station-details');
    stationDetails.style.display = 'block';

    document.getElementById('station-id').textContent = station.chargePointId;
    document.getElementById('station-status').textContent = station.status;
    document.getElementById('station-last-seen').textContent = new Date(station.lastSeen).toLocaleString();

    const connectorsList = document.getElementById('connectors-list');
    connectorsList.innerHTML = '';

    station.connectors.forEach(connector => {
        const connectorElement = document.createElement('div');
        connectorElement.className = 'connector-item';
        connectorElement.innerHTML = `
            <div>Connector ${connector.id}</div>
            <div class="connector-status status-${connector.status.toLowerCase()}">${connector.status}</div>
        `;
        connectorsList.appendChild(connectorElement);
    });

    loadTransactions();
}

// Transaction management functions
async function loadTransactions() {
    if (!selectedStation) return;

    try {
        const response = await fetch(`${API_BASE_URL}/transactions?stationId=${selectedStation.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const transactions = await response.json();
            displayTransactions(transactions);
        } else {
            showError('Failed to load transactions');
        }
    } catch (error) {
        showError('Error loading transactions');
    }
}

function displayTransactions(transactions) {
    const transactionsList = document.getElementById('transactions-list');
    transactionsList.innerHTML = '';

    transactions.forEach(transaction => {
        const transactionElement = document.createElement('div');
        transactionElement.className = 'transaction-item';
        transactionElement.innerHTML = `
            <div>
                <div>Transaction ID: ${transaction.transactionId}</div>
                <div>Connector: ${transaction.connectorId}</div>
                <div>Start Time: ${new Date(transaction.startTime).toLocaleString()}</div>
            </div>
            <div class="status-${transaction.status.toLowerCase()}">${transaction.status}</div>
        `;
        transactionsList.appendChild(transactionElement);
    });
}

// OCPP action functions
async function remoteStartTransaction() {
    if (!selectedStation) return;

    const connectorId = prompt('Enter connector ID:');
    if (!connectorId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/ocpp/remote-start-transaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                chargePointId: selectedStation.chargePointId,
                connectorId: parseInt(connectorId),
            }),
        });

        if (response.ok) {
            showSuccess('Remote start transaction initiated');
            loadTransactions();
        } else {
            showError('Failed to start transaction');
        }
    } catch (error) {
        showError('Error starting transaction');
    }
}

async function remoteStopTransaction() {
    if (!selectedStation) return;

    const transactionId = prompt('Enter transaction ID:');
    if (!transactionId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/ocpp/remote-stop-transaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                chargePointId: selectedStation.chargePointId,
                transactionId: parseInt(transactionId),
            }),
        });

        if (response.ok) {
            showSuccess('Remote stop transaction initiated');
            loadTransactions();
        } else {
            showError('Failed to stop transaction');
        }
    } catch (error) {
        showError('Error stopping transaction');
    }
}

async function resetStation(type) {
    if (!selectedStation) return;

    try {
        const response = await fetch(`${API_BASE_URL}/ocpp/reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                chargePointId: selectedStation.chargePointId,
                type,
            }),
        });

        if (response.ok) {
            showSuccess(`${type} reset initiated`);
        } else {
            showError(`Failed to ${type.toLowerCase()} reset`);
        }
    } catch (error) {
        showError('Error resetting station');
    }
}

async function unlockConnector() {
    if (!selectedStation) return;

    const connectorId = prompt('Enter connector ID:');
    if (!connectorId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/ocpp/unlock-connector`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                chargePointId: selectedStation.chargePointId,
                connectorId: parseInt(connectorId),
            }),
        });

        if (response.ok) {
            showSuccess('Unlock connector command sent');
        } else {
            showError('Failed to unlock connector');
        }
    } catch (error) {
        showError('Error unlocking connector');
    }
}

async function changeAvailability() {
    if (!selectedStation) return;

    const connectorId = prompt('Enter connector ID:');
    if (!connectorId) return;

    const type = prompt('Enter availability type (Operative/Inoperative):');
    if (!type) return;

    try {
        const response = await fetch(`${API_BASE_URL}/ocpp/change-availability`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                chargePointId: selectedStation.chargePointId,
                connectorId: parseInt(connectorId),
                type,
            }),
        });

        if (response.ok) {
            showSuccess('Change availability command sent');
        } else {
            showError('Failed to change availability');
        }
    } catch (error) {
        showError('Error changing availability');
    }
}

async function getConfiguration() {
    if (!selectedStation) return;

    const keys = prompt('Enter configuration keys (comma-separated, leave empty for all):');
    
    try {
        const response = await fetch(`${API_BASE_URL}/ocpp/get-configuration`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                chargePointId: selectedStation.chargePointId,
                keys: keys ? keys.split(',').map(k => k.trim()) : undefined,
            }),
        });

        if (response.ok) {
            const config = await response.json();
            showSuccess('Configuration retrieved: ' + JSON.stringify(config));
        } else {
            showError('Failed to get configuration');
        }
    } catch (error) {
        showError('Error getting configuration');
    }
}

async function changeConfiguration() {
    if (!selectedStation) return;

    const key = prompt('Enter configuration key:');
    if (!key) return;

    const value = prompt('Enter configuration value:');
    if (!value) return;

    try {
        const response = await fetch(`${API_BASE_URL}/ocpp/change-configuration`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                chargePointId: selectedStation.chargePointId,
                key,
                value,
            }),
        });

        if (response.ok) {
            showSuccess('Configuration changed successfully');
        } else {
            showError('Failed to change configuration');
        }
    } catch (error) {
        showError('Error changing configuration');
    }
}

async function clearCache() {
    if (!selectedStation) return;

    try {
        const response = await fetch(`${API_BASE_URL}/ocpp/clear-cache`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                chargePointId: selectedStation.chargePointId,
            }),
        });

        if (response.ok) {
            showSuccess('Cache cleared successfully');
        } else {
            showError('Failed to clear cache');
        }
    } catch (error) {
        showError('Error clearing cache');
    }
}

async function getDiagnostics() {
    if (!selectedStation) return;

    const location = prompt('Enter diagnostics file location:');
    if (!location) return;

    const retries = prompt('Enter number of retries (optional):');
    const retryInterval = prompt('Enter retry interval in seconds (optional):');

    try {
        const response = await fetch(`${API_BASE_URL}/ocpp/get-diagnostics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                chargePointId: selectedStation.chargePointId,
                location,
                retries: retries ? parseInt(retries) : undefined,
                retryInterval: retryInterval ? parseInt(retryInterval) : undefined,
            }),
        });

        if (response.ok) {
            showSuccess('Diagnostics request sent successfully');
        } else {
            showError('Failed to get diagnostics');
        }
    } catch (error) {
        showError('Error getting diagnostics');
    }
}

async function updateFirmware() {
    if (!selectedStation) return;

    const location = prompt('Enter firmware file location:');
    if (!location) return;

    const retrieveDate = prompt('Enter retrieve date (YYYY-MM-DD):');
    if (!retrieveDate) return;

    const retries = prompt('Enter number of retries (optional):');
    const retryInterval = prompt('Enter retry interval in seconds (optional):');

    try {
        const response = await fetch(`${API_BASE_URL}/ocpp/update-firmware`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                chargePointId: selectedStation.chargePointId,
                location,
                retrieveDate,
                retries: retries ? parseInt(retries) : undefined,
                retryInterval: retryInterval ? parseInt(retryInterval) : undefined,
            }),
        });

        if (response.ok) {
            showSuccess('Firmware update initiated successfully');
        } else {
            showError('Failed to update firmware');
        }
    } catch (error) {
        showError('Error updating firmware');
    }
}

// Utility functions
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    document.querySelector('.content').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    document.querySelector('.content').prepend(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
}

function clearStations() {
    document.getElementById('stations-list').innerHTML = '';
    document.getElementById('station-details').style.display = 'none';
    document.getElementById('transactions-list').innerHTML = '';
    selectedStation = null;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    if (token) {
        loadStations();
    }
}); 