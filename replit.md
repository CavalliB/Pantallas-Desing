# Heladeria - CRUD Application

## Overview
This is a React + Vite + TypeScript CRUD application for managing an ice cream shop (Heladeria). Built with Material-UI and Toolpad Core for a modern dashboard interface.

## Project Structure
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 5.4
- **UI Framework**: Material-UI (@mui/material)
- **Routing**: React Router 7
- **Dashboard**: Toolpad Core

## Features
The application manages:
- Dashboard overview
- Suppliers (Proveedores)
- Products (Productos)
- Production Orders (Ordenes de Producción)
- Supplies (Insumos)
- Buy Orders (Ordenes de Compra)
- Recipes (Recetas)

## Development Setup
The project is configured to run on Replit with:
- Server binding to `0.0.0.0:5000`
- Allowed hosts configured for `.replit.dev` domain
- HMR (Hot Module Reload) configured for Replit proxy

## Running the Application
The workflow `dev` runs `npm run dev` and serves the application on port 5000.

## Deployment
Configured for autoscale deployment with:
- Build: `npm run build`
- Run: `npx vite preview --host 0.0.0.0 --port 5000`

## Recent Changes
- **Oct 30, 2025**: Initial setup for Replit environment
  - Configured Vite for Replit proxy compatibility
  - Set up development workflow
  - Configured deployment settings
