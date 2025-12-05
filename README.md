# Diseño de Pantallas con Toolpad Core

Aplicación CRUD desarrollada con **Vite**, **React 19**, **React Router 7** y **Toolpad Core** para gestionar pantallas de administración.

## 🚀 Características

- Dashboard responsivo con Toolpad Core
- Gestión de múltiples módulos (clientes, productos, órdenes, etc.)
- Búsqueda y filtrado de datos
- Interfaz moderna con Material-UI
- Validación de formularios con Zod

## 📋 Requisitos

- Node.js 16+ 
- npm o yarn

## 🔧 Instalación

1. Clona el repositorio:
```bash
git clone <https://github.com/CavalliB/Pantallas-Desing>
cd Pantallas-Design
```

2. Instala las dependencias:
```bash
npm install
```

## ▶️ Cómo iniciar el proyecto

### Modo desarrollo
```bash
npm run dev
```
La aplicación se abrirá en `http://localhost:5173`

### Compilar para producción
```bash
npm run build
```

### Vista previa de la compilación
```bash
npm run preview
```

## 📁 Estructura del proyecto

```
src/
├── pages/          # Páginas principales (clientes, productos, órdenes, etc.)
├── components/     # Componentes reutilizables
├── layouts/        # Layouts (dashboard)
├── context/        # Context API (búsqueda, etc.)
├── data/           # Datos y modelos
└── assets/         # Recursos estáticos
```

## 🛠️ Tecnologías utilizadas

- **React 19** - Librería UI
- **Vite** - Bundler y servidor de desarrollo
- **React Router 7** - Enrutamiento
- **Toolpad Core** - Framework para dashboards
- **Material-UI** - Componentes de UI
- **TypeScript** - Tipado de código
- **Zod** - Validación de esquemas
