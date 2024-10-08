# Bistro Boss Server

This is the server-side application for the Bistro Boss project, a restaurant management system.

## Features

- User management (create, read, update, delete)
- Menu management
- Review system
- Shopping cart functionality

## Prerequisites

- Node.js
- npm (Node Package Manager)
- MongoDB

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bistro-boss-server.git
   cd bistro-boss-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```bash
   MONGODB_URI=mongodb+srv://<db_username>:<db_password>@cluster0.d2acxkg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   PORT=5000
   ```
   Replace `<db_username>` and `<db_password>` with your actual MongoDB credentials.

## Running the Server

To start the server, run:
