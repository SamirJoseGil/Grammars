# Grammars

Grammar Studio
===============

Proyecto full-stack: frontend Remix + backend Django REST para análisis de gramáticas (CFG), derivación y visualización de árboles.

Características principales
-------------------------
- Parseo de gramáticas en formato BNF y notación académica (E = E + T)
- Derivación paso a paso (izquierda/derecha)
- Generación y exportación de árbol de derivación (PNG)
- OCR para importar gramáticas (frontend)
- Documentación OpenAPI/Swagger en `/api/docs/`

Endpoints (backend)
-------------------
Prefijo general: `/api/`

- POST `/api/parse`
	- Descripción: Analiza la gramática y el texto proporcionado.
	- Cuerpo (JSON): `{ "grammar": string, "text": string }`
	- Respuesta: JSON con información de parse (tree_count, ambiguous, ...) o error.

- POST `/api/derivation`
	- Descripción: Genera derivación paso a paso.
	- Cuerpo (JSON): `{ "grammar": string, "text": string, "derivation_type": "left"|"right" }
	- Respuesta: `{ "steps": ["..."], ... }`

- POST `/api/tree`
	- Descripción: Devuelve la(s) estructura(s) del árbol de derivación en formato JSON serializable.
	- Cuerpo (JSON): `{ "grammar": string, "text": string }`
	- Respuesta: `{ "tree": {...} }` o `{ "trees": [...] }` si ambigüedad.

- POST `/api/ast`
	- Descripción: Devuelve el AST (estructura intermedia) generado por el parser.
	- Cuerpo: igual que `/api/tree`.

Documentación OpenAPI
---------------------
- `/api/schema/` → OpenAPI JSON
- `/api/docs/` → Swagger UI (interactivo)
- `/api/redoc/` → ReDoc

Configuración local (desarrollo)
--------------------------------
Requisitos
- Python 3.12
- Node.js (compatible con Remix/Vite)
- PostgreSQL (opcional para local) — el proyecto cae a SQLite si no hay `database_url`.

Backend
1. Crear y activar virtualenv

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Configurar variables (archivo `backend/.env` para desarrollo, ejemplo en `backend/.env.sample`):

```
secret_key=changeme
debug=True
database_url=
# direct_url se usa para CORS desde frontend en desarrollo
direct_url=http://localhost:5173
allowed_hosts=localhost,127.0.0.1
```

3. Migraciones y correr servidor

```bash
python manage.py migrate
python manage.py runserver
```

4. Ejecutar tests

```bash
python manage.py test parser
```

Frontend
1. Instalar dependencias y correr dev server

```bash
cd frontend
npm install
npm run dev
```

2. Variables de entorno (archivo `frontend/.env` en local):

```
# Desarrollo local -> apunta al backend local
api_base_url=http://127.0.0.1:8000/api
NODE_ENV=development
```

3. En producción (Vercel) la app toma `api_base_url` y la normaliza automáticamente:
	 - Si pones `api_base_url=/api` entonces el frontend hace requests relativos (misma ruta)
	 - Si pones `api_base_url=grammarapi.sglabs.site` (sin protocolo), la app la normaliza a `https://grammarapi.sglabs.site`

Notas sobre la duplicación de rutas
----------------------------------
- Si el valor de `api_base_url` se proporciona sin protocolo y sin `/` (por ejemplo `grammarapi.sglabs.site`), el frontend anteriormente lo trataba como ruta relativa; ahora la normalización lo convierte a `https://grammarapi.sglabs.site`.
- No pongas en Vercel `api_base_url` con un valor que contenga ya el dominio junto con el dominio principal (evitar `https://grammar.sglabs.site/grammarapi.sglabs.site`).
- Para despliegues en la misma ruta (frontend y backend bajo un mismo dominio), usa `api_base_url=/api`.

CORS y seguridad
----------------
- `backend/config/settings.py` contiene `CORS_ALLOWED_ORIGINS` y acepta localhosts por defecto.
- Añade en `backend/.env` `direct_url` o incluye `grammar.sglabs.site` en `allowed_hosts` y CORS para producción.

Vercel deployment notes
-----------------------
- `vercel.json` debe mapear el servicio backend a `"routePrefix": "/api"` (ya configurado en el repo)
- En Vercel:
	- Frontend Service: entrypoint `frontend`, routePrefix `/`
	- Backend Service: entrypoint `backend`, routePrefix `/api`
- En Environment Variables (Vercel):
	- Para frontend (Production): `api_base_url=grammarapi.sglabs.site`  (o `/api` si el backend está en la misma ruta)
	- Para backend: `database_url=postgresql://...` (Neon URL), `direct_url=https://grammar.sglabs.site`, `allowed_hosts=grammar.sglabs.site`

Debug
-----
- Hay una ruta `/debug` en el frontend que muestra qué variables de entorno está leyendo el servidor y la URL normalizada (útil para verificar en Vercel).

Contribuidores
--------------
- Samir Jose Osorio Gil
- Isabella builtrago uzuga