# HackEPS Multi-Cloud Dashboard

Dashboard integrado que combina autenticación, gestión de instancias y creación de clusters para múltiples proveedores cloud.

## Características

- 🔐 **Sistema de autenticación** con login/logout
- 📊 **Dashboard con gráficos** usando Recharts  
- ☁️ **Gestión multi-cloud** (AWS, GCP)
- 🤖 **Asistente LLM** para creación automática
- 📱 **Interfaz responsive** con styled-components
- 🛡️ **Rutas protegidas** con autenticación requerida

## Tecnologías

- **Frontend**: React 19 + Vite
- **Routing**: React Router v7
- **Charts**: Recharts  
- **Styling**: CSS Modules + styled-components
- **State**: React Context
- **HTTP**: Fetch API

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## Estructura del Proyecto

```
src/
├── components/         # Componentes reutilizables
│   ├── Login.jsx      # Página de login
│   ├── CreateCluster.jsx  # Formulario creación cluster
│   └── ProtectedRoute.jsx # HOC para rutas protegidas
├── contexts/          # Context providers
│   └── AuthContext.jsx   # Gestión de autenticación
├── paginas/           # Páginas principales
│   ├── Dashboard.jsx     # Dashboard principal
│   ├── DetailPage.jsx    # Detalles de instancias
│   └── LLMPage.jsx       # Chat con LLM
├── services/          # Servicios API
│   ├── authService.js    # Autenticación
│   └── clusterService.js # Gestión clusters
└── config/            # Configuraciones
    └── cloudConstants.js # Constantes cloud
```

## Rutas Disponibles

- `/` - Dashboard principal (protegido)
- `/login` - Página de login
- `/crear/manual` - Crear cluster manual (protegido)  
- `/crear/llm` - Crear cluster con LLM (protegido)
- `/detalle/:mode/:provider` - Detalles por proveedor (protegido)
- `/detalle/:mode/:provider/:status` - Detalles filtrados (protegido)

## API Backend

El frontend se conecta a `http://localhost:8000` por defecto.
Endpoints principales:

- `GET /api/v1/instances/` - Listar instancias
- `POST /api/v1/clusters/` - Crear cluster
- `POST /api/v1/instances/auto-cluster` - Creación automática con LLM

## Modo Desarrollo

Durante desarrollo, el sistema usa datos mock para la autenticación:
- Usuario: cualquier username
- Password: cualquier password
- Token: mock generado automáticamente

## Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request
