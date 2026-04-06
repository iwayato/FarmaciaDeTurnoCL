# FarmaciaDeTurnoCL

Web app desarrollada con el objetivo de conocer la disponibilidad de las farmacias en turno del país.

Si el usuario lo desea, puede permitir obtener su ubicación para encontrar las farmacias de turno más cercanas.

La información se obtiene a partir de un endpoint disponibilizado por [MIDAS](https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php) (Modernización de la Información Digital de la Autoridad Sanitaria).

## Funcionalidades

- Mapa interactivo con todas las farmacias en turno a nivel nacional.
- Agrupación de marcadores por zona (clustering) para mejor visualización.
- Tooltip por farmacia con nombre, dirección, horario de apertura/cierre y teléfono.
- Geolocalización opcional: si el usuario acepta compartir su ubicación, el mapa se centra en su posición con zoom aumentado.
- Diseño responsivo, compatible con dispositivos móviles.
- Analítica integrada con Vercel Analytics.

## Stack

| Tecnología | Uso |
|---|---|
| [React 18](https://react.dev/) | UI |
| [Vite 5](https://vitejs.dev/) | Bundler / dev server |
| [Chakra UI 2](https://chakra-ui.com/) | Componentes de interfaz |
| [React Leaflet](https://react-leaflet.js.org/) + [Leaflet](https://leafletjs.com/) | Mapa interactivo |
| [react-leaflet-cluster](https://github.com/akursat/react-leaflet-cluster) | Clustering de marcadores |
| [Axios](https://axios-http.com/) | Peticiones HTTP |
| [Vercel Analytics](https://vercel.com/analytics) | Analítica web |

## Requisitos

- Node.js >= 18
- npm >= 9

## Instalación y ejecución local

```bash
# 1. Clonar el repositorio
git clone https://github.com/iwayato/FarmaciaDeTurnoCL.git
cd FarmaciaDeTurnoCL

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

La app estará disponible en `http://localhost:5173`.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con HMR |
| `npm run build` | Genera el build de producción en `/dist` |
| `npm run preview` | Sirve localmente el build de producción |
| `npm run lint` | Ejecuta ESLint sobre archivos `.js` y `.jsx` |

## API externa

Los datos provienen del endpoint público del Ministerio de Salud de Chile (MINSAL):

```
GET https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php
```

No se requiere autenticación ni API key. La app consume este endpoint directamente desde el cliente.

## Estructura del proyecto

```
FarmaciaDeTurnoCL/
├── public/
│   └── icon.png
├── src/
│   ├── assets/
│   │   └── marker.png        # Ícono personalizado para los marcadores del mapa
│   ├── components/
│   │   └── Map.jsx           # Componente del mapa (Leaflet + clustering)
│   ├── App.jsx               # Componente raíz: fetching de datos y layout
│   └── main.jsx              # Entry point de React
├── index.html
├── vite.config.js
└── package.json
```