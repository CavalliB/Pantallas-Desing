# Heladeria - CRUD Application

## Overview
This is a CRUD (Create, Read, Update, Delete) application for managing an ice cream shop ("Heladeria"). Built with React, TypeScript, Vite, Material-UI, and Toolpad Core.

## Project Setup
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 5.4
- **UI Library**: Material-UI (MUI) v7
- **Routing**: React Router v7
- **Dashboard Framework**: Toolpad Core v0.16

## Project Structure
```
src/
├── components/     # Reusable components
├── data/          # Mock data for the application
├── layouts/       # Layout components
├── pages/         # Page components for each CRUD section
├── App.tsx        # Main app with navigation setup
└── main.tsx       # Application entry point
```

## Features
The application manages the following entities:
- **Dashboard**: Main overview page
- **Proveedores** (Suppliers): Supplier management
- **Productos** (Products): Product catalog
- **Ordenes de Producción** (Production Orders): Production order tracking
- **Insumos** (Supplies): Supply inventory
- **Recetas** (Recipes): Recipe management
- **Ordenes de Compra** (Buy Orders): Purchase order management

## Development

### Running the Application
The dev server is configured to run on port 5000:
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Replit Configuration

### Development Setup
- Port: 5000
- Host: 0.0.0.0 (required for Replit environment)
- HMR: Configured for Replit's proxy environment

### Deployment
- Target: Autoscale
- Build: `npm run build`
- Run: `npx vite preview --host 0.0.0.0 --port 5000`

## Recent Changes
- **2025-10-30**: Initial Replit setup
  - Configured Vite to run on port 5000
  - Removed duplicate vite.config.js file
  - Set up development workflow
  - Configured deployment for production
  - Installed npm dependencies
