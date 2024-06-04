# CupGPT Coding Monkey Wizard

## Project Overview

This project is a ChatGPT prompt generator for coding, programming, and computer science-themed inquiries, with a backend built using Node.js, Express, and PostgreSQL, and a frontend built with React. The backend provides a RESTful API for managing coding topics, content, and examples, while the frontend allows users to search and interact with this content.

CupGPT Coding Monkey Wizard helps developers and students by generating high-quality ChatGPT prompts tailored for coding and programming inquiries. This tool uses your study notes to enhance the efficiency and accuracy of ChatGPT responses, saving time and improving the overall learning and development experience.

## Key Features

- RESTful API with CRUD operations for coding topics, content, and examples
- Search functionality to make ChatGPT queries more productive
- CORS enabled for frontend-backend communication
- Checkboxes to customize output prompt, including options for bulleted list formatting, accuracy, including sources, writing style, and up-to-date information
- Tip window to help the user write better queries
- Tooltips on checkboxes to describe their functionality

## Tech Stack

- **Backend**: Node.js, Express, PostgreSQL, Knex
- **Frontend**: React, Axios
- **Deployment**: Docker, Docker Compose

## Available Scripts

### Docker Commands

- `docker-compose up --build`: Builds and starts the backend, frontend, and database services
- `docker-compose down`: Stops the backend, frontend, and database services
- `docker volume prune -f`: Removes Docker volumes to reset the database

## Testing

- **Backend**: Jest
- **Frontend**: Cypress

## How to Run the Project

1. **Clone the repository:**
   ```bash
   git clone git@github.com:evoingram/cupgpt.git
   cd cupgpt


## API Documentation

### API Endpoints

| **Endpoint**            | **HTTP Method** | **Description**                                     | **Parameters**                                                                                                                                                          |
|-------------------------|-----------------|-----------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/contents`             | POST            | Create new content for a topic.                     | `topic_id` (body), `description` (body)                                                                                                                                 |
| `/contents`             | GET             | Retrieve a list of all content items.               | None                                                                                                                                                                    |
| `/contents/:id`         | GET             | Retrieve a specific content item by ID.             | `id` (path)                                                                                                                                                             |
| `/contents/:id`         | PUT             | Update a specific content item by ID.               | `id` (path), `topic_id` (body), `description` (body)                                                                                                                    |
| `/contents/:id`         | DELETE          | Delete a specific content item by ID.               | `id` (path)                                                                                                                                                             |
| `/contents/search`      | GET             | Search for content by topic.                        | `topic` (query parameter)                                                                                                                                               |
| `/examples`             | POST            | Create a new example for content.                   | `content_id` (body), `language` (body), `example` (body)                                                                                                                |
| `/examples`             | GET             | Retrieve a list of all examples.                    | None                                                                                                                                                                    |
| `/examples/:id`         | GET             | Retrieve a specific example by ID.                  | `id` (path)                                                                                                                                                             |
| `/examples/:id`         | PUT             | Update a specific example by ID.                    | `id` (path), `content_id` (body), `language` (body), `example` (body)                                                                                                   |
| `/examples/:id`         | DELETE          | Delete a specific example by ID.                    | `id` (path)                                                                                                                                                             |
| `/search/content`       | GET             | Search for content by topic.                        | `topic` (query parameter)                                                                                                                                               |
| `/search/query`         | POST            | Searches for content by a query string and options. | `query` (body), `options`: JSON object containing options like `bulletedList`, `accuracy`, `includeSources`, `myWritingStyle`, `searchInternet`, `bestPractices` (body) |
| `/stats/topics/count`   | GET             | Get count of topics.                                | None                                                                                                                                                                    |
| `/stats/content/count`  | GET             | Get count of content items.                         | None                                                                                                                                                                    |
| `/stats/examples/count` | GET             | Get count of examples.                              | None                                                                                                                                                                    |
| `/topics`               | POST            | Create a new topic.                                 | `name` (body)                                                                                                                                                           |
| `/topics`               | GET             | Retrieve a list of all topics.                      | None                                                                                                                                                                    |
| `/topics/:id`           | GET             | Retrieve a specific topic by ID.                    | `id` (path)                                                                                                                                                             |
| `/topics/:id`           | PUT             | Update a specific topic by ID.                      | `id` (path), `name` (body)                                                                                                                                              |
| `/topics/:id`           | DELETE          | Delete a specific topic by ID.                      | `id` (path)                                                                                                                                                             |
| `/topics/link`          | POST            | Link parent and child topics.                       | `parent_topic_id` (body), `child_topic_id` (body)                                                                                                                       |


## Testing

- **Backend**: Jest
- **Frontend**: Cypress

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
   docker volume prune -f
   ```

## How to Use The Deployed Project

TBD

## Documentation

- This project will be documented using Postman.
- Postman docs will contain examples of all get, post, and put endpoint body submissions AND responses.

### Copyright

- © 2024 Erica Ingram. All rights reserved.
