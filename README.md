# Ruta Pro Drive

## Información del proyecto

**Ruta Pro Drive** es una aplicación web desarrollada para optimizar la gestión de servicios de transporte, enfocada en conductores de taxis y plataformas de transporte. La aplicación permite a los conductores registrar servicios, calcular ingresos con deducción de peajes, generar reportes estadísticos y configurar preferencias de usuario de manera eficiente.

### Características principales

- 📊 Registro de servicios con deducción automática de peajes
- 📈 Reportes estadísticos por método de pago y plataforma  
- ⚙️ Configuración de preferencias de usuario
- 💰 Cálculo automático de ingresos y gastos
- 📱 Interfaz intuitiva y fácil de usar

### Problemática que resuelve

Los conductores de taxis y plataformas de transporte enfrentan dificultades para gestionar sus ingresos y operaciones de manera eficiente. Ruta Pro Drive digitaliza estos procesos manuales, mejorando la toma de decisiones financieras y proporcionando herramientas para un mejor control operativo.

## ¿Cómo puedo ejecutar este proyecto?

### Requisitos previos

- Node.js y npm instalados - [instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- PostgreSQL (para la base de datos)

### Instalación y ejecución

```sh
# Paso 1: Clona el repositorio
git clone <TU_URL_DE_GIT>

# Paso 2: Navega al directorio del proyecto
cd ruta-pro-drive

# Paso 3: Instala las dependencias
npm install

# Paso 4: Configura las variables de entorno
cp .env.example .env
# Edita el archivo .env con tu configuración de base de datos

# Paso 5: Inicia el servidor de desarrollo
npm run dev
```

### Otras opciones de edición

**Editar archivos directamente en GitHub**

- Navega a los archivos deseados
- Haz clic en el botón "Edit" (ícono de lápiz) 
- Realiza tus cambios y confirma los cambios

**Usar GitHub Codespaces**

- Ve a la página principal del repositorio
- Haz clic en "Code" → "Codespaces" → "New codespace"
- Edita directamente en el navegador

## Tecnologías utilizadas

Este proyecto está construido con tecnologías modernas:

- **Frontend:** React + TypeScript
- **Estilos:** Tailwind CSS + shadcn-ui
- **Build Tool:** Vite
- **Backend:** Node.js (API RESTful)
- **Base de datos:** PostgreSQL
- **Herramientas:** GitHub Projects (metodología Kanban)

## Arquitectura del sistema

- **Cliente-Servidor:** Frontend React conectado a backend Node.js
- **Base de datos relacional:** PostgreSQL con esquema optimizado
- **APIs RESTful:** Para comunicación entre frontend y backend
- **Metodología:** Desarrollo ágil con Kanban

## Cómo desplegar este proyecto

### Construcción para producción

```sh
# Construir el proyecto
npm run build

# Los archivos estáticos se generan en la carpeta 'dist'
```

### Opciones de despliegue

- **Vercel:** Conecta tu repositorio de GitHub para despliegue automático
- **Netlify:** Sube la carpeta `dist` o conecta vía Git
- **GitHub Pages:** Usa GitHub Actions para despliegue automático
- **Railway/Render:** Para aplicaciones full-stack con base de datos

### Configuración de dominio personalizado

La mayoría de plataformas permiten conectar dominios personalizados desde su panel de control. Consulta la documentación específica de tu proveedor de hosting.

## Estructura del proyecto

```
ruta-pro-drive/
├── src/
│   ├── components/     # Componentes React reutilizables
│   ├── pages/         # Páginas principales de la aplicación
│   ├── hooks/         # Custom hooks de React
│   ├── utils/         # Funciones de utilidad
│   └── types/         # Definiciones de tipos TypeScript
├── public/            # Archivos estáticos
└── docs/             # Documentación del proyecto
```

## Contribuir

Este proyecto sigue la metodología Kanban. Para contribuir:

1. Revisa los issues abiertos en GitHub
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. Realiza tus cambios y pruebas
4. Crea un Pull Request con descripción detallada

## Licencia

Este proyecto fue desarrollado como parte de una necesidad personal y en base al curso "Métodos de Construcción de Software" en la Corporación Universitaria Iberoamericana.

## Autores

- **Juan Esteban Castillo Cañón** - Desarrollo Backend
- **Libardo López Gómez** - Desarrollo Frontend

---

*Ruta Pro Drive - Optimizando la gestión de servicios de transporte*