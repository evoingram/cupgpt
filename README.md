
# CupGPT Coding Monkey Wizard

## Project Overview

This project is designed to serve as a coding documentation tool with a backend built using Node.js, Express, and PostgreSQL, and a frontend built with React. The backend provides a RESTful API for managing coding topics, content, and examples, while the frontend allows users to search and interact with this content.

## Key Features

- RESTful API with CRUD operations for coding topics, content, and examples
- Search functionality with support for bulleted list formatting
- Frontend built with React for querying and displaying coding documentation
- CORS enabled for frontend-backend communication

## Tech Stack

- **Backend**: Node.js, Express, PostgreSQL, Knex
- **Frontend**: React, Axios
- **Deployment**: Docker, Docker Compose

## Available Scripts

### Docker Commands

- `docker-compose up --build`: Builds and starts the backend, frontend, and database services
- `docker-compose down`: Stops the backend, frontend, and database services
- `docker volume rm $(docker volume ls -q)`: Removes Docker volumes to reset the database

## API Documentation

- **Topics**
    - `POST /topics`: Create a new topic
    - `POST /topics/link`: Link parent and child topics
- **Content**
    - `POST /content`: Create new content for a topic
    - `GET /content/search`: Search for content by topic
- **Examples**
    - `POST /examples`: Add examples to content

## Testing

- **Backend**: Jest (to be implemented)
- **Frontend**: Cypress (to be implemented)

## How to Run the Project

1. **Clone the repository:**
   ```bash
   git clone git@github.com:evoingram/cupgpt.git
   cd cupgpt
   ```

2. **Create a `.env` file in the project root with the following content:**
   ```env
   DB_USERNAME=postgres
   DB_PASSWORD=*****
   DB_NAME=db-name-here
   DB_PORT=5432
   DB_HOST=db-host-name-here
   ```

3. **Build and start the services:**
   ```bash
   docker-compose up --build
   ```

4. **Stop the services:**
   ```bash
   docker-compose down
   ```

5. **Remove Docker volumes to reset the database:**
   ```bash
   docker volume rm $(docker volume ls -q)
   ```

## How to Use The Deployed Project

TBD

## Documentation

- This project will be documented using Postman.
- Postman docs will contain examples of all get, post, and put endpoint body submissions AND responses.

### Copyright

- © 2024 Erica Ingram. All rights reserved.
