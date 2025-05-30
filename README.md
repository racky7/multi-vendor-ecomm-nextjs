# Multitenant Ecommerce Platform

## Introduction

This project is a multitenant ecommerce platform built with Next.js, Payload CMS, and tRPC. It provides a robust foundation for creating online stores with support for multiple tenants.

## Features

- **Next.js:** Modern React framework for server-side rendering and static site generation.
- **Payload CMS:** Headless CMS for managing content and data.
- **tRPC:** End-to-end typesafe APIs for seamless client-server communication.
- **Shadcn UI:** Beautifully designed UI components.
- **Multitenancy:** Support for multiple tenants, allowing each tenant to have their own isolated data and storefront.

## Getting Started

### Prerequisites

- Node.js (version specified in `package.json`)
- Bun (for running scripts)
- MongoDB (for Payload CMS)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```
2. **Install dependencies:**
   ```bash
   bun install
   ```
3. **Set up environment variables:**
   - Create a `.env` file based on `.env.example` (if available).
   - Configure database connection strings and other necessary variables.
4. **Run database migrations:**
   ```bash
   bun run db:fresh
   ```
5. **Seed the database (optional):**
   ```bash
   bun run db:seed
   ```

## Usage

To start the development server, run:

```bash
bun run dev
```

This will start the Next.js application and the Payload CMS admin panel.

## Available Scripts

The `package.json` file includes the following scripts:

- **`bun run dev`**: Starts the development server using Next.js. This is useful for local development and testing.
- **`bun run build`**: Builds the application for production. This command compiles the Next.js application and prepares it for deployment.
- **`bun run start`**: Starts the production server. This command should be run after building the application.
- **`bun run lint`**: Lints the codebase using Next.js's ESLint configuration. This helps maintain code quality and consistency.
- **`bun run db:generate`**: Generates TypeScript types based on your Payload CMS collections. This is useful for ensuring type safety in your application.
- **`bun run db:fresh`**: Drops the existing database and runs all migrations. This is useful for resetting the database to a clean state. **Warning: This will delete all data in the database.**
- **`bun run db:seed`**: Seeds the database with initial data. This script is typically run after `db:fresh` to populate the database with necessary data for development or testing.

## Deployment

Deploying this multitenant ecommerce platform involves deploying the Next.js frontend and the Payload CMS backend. Here are some common approaches:

### Next.js Frontend

- **Vercel:** Vercel is the recommended platform for deploying Next.js applications, offering seamless integration and optimization. You can connect your Git repository directly to Vercel for automatic deployments.

### Payload CMS Backend

- **Payload Cloud:** The official cloud hosting solution for Payload CMS, providing a managed environment specifically designed for Payload applications.
- **Docker:** You can containerize the Payload CMS application using Docker and deploy it to various hosting providers that support Docker containers (e.g., AWS ECS, Google Cloud Run, DigitalOcean).
- **Node.js Hosting:** Deploy the Payload CMS backend to any hosting provider that supports Node.js applications (e.g., Heroku, Render, or a traditional VPS).

### Environment Variables

Ensure that all necessary environment variables are configured correctly in your production environment. This includes:
- `DATABASE_URL` for connecting to your production MongoDB instance.
- `PAYLOAD_SECRET` for Payload CMS.
- `NEXT_PUBLIC_SERVER_URL` for the Next.js frontend to communicate with the Payload backend.
- Any other API keys or service credentials required by your application.

It is crucial to keep your production environment variables secure and never commit them directly to your version control system.

## Contributing

Contributions are welcome! Please follow these guidelines:

- Fork the repository.
- Create a new branch for your feature or bug fix.
- Make your changes and commit them with clear messages.
- Push your changes to your fork and submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
