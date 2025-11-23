# HackEPS Multi-Cloud Dashboard

Dashboard integrado que combina autenticación, gestión de instancias y creación de clusters para múltiples proveedores cloud.

## ✨ Características

- 🔐 **Sistema de autenticación**: Login y logout con gestión de sesión.
- 📊 **Dashboard interactivo**: Gráficos en tiempo real con Recharts para visualizar el estado de las instancias.
- ☁️ **Gestión Multi-Cloud**: Soporte para instancias en AWS y GCP.
- 🤖 **Asistente IA**: Creación de infraestructura mediante un asistente conversacional (LLM).
- 📝 **Creación Manual**: Formularios detallados para la creación de clústeres.
- 🛡️ **Rutas Protegidas**: Acceso restringido a las páginas principales, requiriendo autenticación.
- 📱 **Interfaz Responsiva**: Diseño adaptable a diferentes tamaños de pantalla.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19 + Vite
- **Routing**: React Router v7
- **Gráficos**: Recharts
- **Estilos**: CSS (con archivos por componente) y Styled Components
- **Gestión de Estado**: React Context API
- **Comunicaciones HTTP**: Fetch API

## 🚀 Instalación y Uso

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>

# 2. Navegar al directorio del proyecto
cd HackEPS2025-Front

# 3. Instalar dependencias
npm install

# 4. Ejecutar en modo de desarrollo
npm run dev

# 5. Construir para producción
npm run build
```

## 📂 Estructura del Proyecto

```
src/
├── api/                # Lógica de cliente para llamadas API
├── components/         # Componentes reutilizables
│   ├── Login.jsx       # Página de login
│   └── CreateCluster.jsx # Formulario de creación de clúster
├── contexts/           # Context providers
│   └── AuthContext.jsx   # Gestión de estado de autenticación
├── paginas/            # Páginas principales de la aplicación
│   ├── Dashboard.jsx     # Dashboard principal con gráficos
│   ├── DetailPage.jsx    # Vista de detalle de instancias
│   └── LLMPage.jsx       # Página del asistente IA
├── services/           # Lógica de negocio para interactuar con el backend
│   └── clusterService.js # Funciones para clústeres e instancias
└── config/             # Ficheros de configuración
    └── cloudConstants.js # Constantes (colores, estados, etc.)
```

## 🗺️ Rutas Disponibles

- `/` - Dashboard principal (protegido).
- `/login` - Página de inicio de sesión.
- `/crear/manual` - Formulario para crear un clúster manualmente (protegido).
- `/crear/llm` - Interfaz para crear un clúster con el asistente IA (protegido).
- `/detalle/provider/:provider` - Vista de detalle de instancias por proveedor (protegido).
- `/detalle/status/:provider/:status` - Vista de detalle filtrada por estado (protegido).
- `/detalle/cluster/:clusterId` - Vista de detalle de instancias de un clúster específico (protegido).

## 🔌 API Backend

El frontend está configurado para conectarse a un backend en `http://localhost:8000`. La configuración del proxy en `vite.config.js` redirige las llamadas `/api`.

**Endpoints principales:**
- `GET /api/v1/instances/` - Obtiene la lista de todas las instancias.
- `POST /api/v1/instances/update_status` - Solicita la actualización de estado de las instancias.
- `POST /api/v1/clusters/` - Crea un nuevo clúster.
- `POST /api/v1/instances/auto-cluster` - Crea un clúster automáticamente usando el LLM.
- `GET /api/v1/clusters/:id` - Obtiene detalles de un clúster.

## 🧑‍💻 Modo Desarrollo

Durante el desarrollo, el sistema de autenticación puede usar credenciales simuladas para facilitar las pruebas.
- **Usuario**: cualquier `username`
- **Contraseña**: cualquier `password`

## 🤝 Contribuciones

1. Haz un Fork del proyecto.
2. Crea tu rama de funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios (`git commit -m 'Añadir nueva funcionalidad'`).
4. Sube tus cambios a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.
