# OCPP Central System Server with Dashboard

This is a NestJS-based OCPP (Open Charge Point Protocol) 1.6 central system server with a web-based dashboard for managing charging stations.

## Features

- OCPP 1.6 WebSocket server
- Web-based dashboard for managing charging stations
- Real-time monitoring of charging stations and connectors
- Transaction management
- Role-based access control (admin users)
- SQLite database for data persistence

## Prerequisites

- Node.js (v16 or later)
- npm (v7 or later)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-ocpp-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```env
JWT_SECRET=your-secret-key-here
```

4. Create the first admin user:
```bash
npm run create:admin
```
This will create an admin user with the following credentials:
- Username: admin
- Password: admin

## Running the Application

1. Start the development server:
```bash
npm run start:dev
```

2. Access the dashboard:
Open your browser and navigate to `http://localhost:3000`

## OCPP Client Connection

OCPP clients can connect to the WebSocket server at:
```
ws://localhost:9000/<chargePointId>
```

The server supports the following OCPP 1.6 messages:
- BootNotification
- StatusNotification
- StartTransaction
- StopTransaction

## API Endpoints

### Authentication
- POST /auth/login - Login with username and password
- POST /auth/register - Register a new user (admin only)

### OCPP Actions
- POST /ocpp/remote-start-transaction - Start a charging transaction
- POST /ocpp/remote-stop-transaction - Stop a charging transaction
- POST /ocpp/reset - Reset a charging station

### Station Management
- GET /stations - Get all charging stations

### Transaction Management
- GET /transactions - Get all transactions for a station

## Security

- JWT-based authentication
- Role-based access control
- Admin-only access to sensitive operations

## Development

- Format code:
```bash
npm run format
```

- Lint code:
```bash
npm run lint
```

- Build for production:
```bash
npm run build
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start:prod
```

Note: Make sure to set `synchronize: false` in the TypeORM configuration for production use.

## License

This project is licensed under the MIT License.
