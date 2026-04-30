# Grammar Studio

Proyecto full-stack para el análisis de gramáticas libres de contexto (CFG), derivaciones y visualización de árboles sintácticos.

Combina un frontend en Remix con un backend en Django REST, permitiendo explorar gramáticas de forma interactiva y estructurada.

---

## Descripción

Grammar Studio permite:

* Parsear gramáticas en formato BNF y notación académica
* Generar derivaciones paso a paso (izquierda y derecha)
* Construir árboles de derivación
* Exportar árboles como imagen (PNG)
* Importar gramáticas mediante OCR
* Explorar la API mediante documentación interactiva

---

## Enfoque técnico

El sistema está construido bajo principios de Programación Orientada a Objetos (POO), separando responsabilidades en:

* Lógica de parsing
* Generación de árboles
* Representación intermedia (AST)
* Capa de servicios (API REST)

---

## Arquitectura

Frontend (Remix) → API REST (Django) → Motor de parsing (Python)

---

## Endpoints (Backend)

```json
Prefijo base: /api/

POST /api/parse
Analiza una gramática y un texto.

Body:
{
"grammar": "string",
"text": "string"
}

Respuesta:
{
"tree_count": number,
"ambiguous": boolean
}

POST /api/derivation
Genera derivación paso a paso.

Body:
{
"grammar": "string",
"text": "string",
"derivation_type": "left" | "right"
}

POST /api/tree
Devuelve árbol(es) de derivación en formato JSON.

POST /api/ast
Devuelve el AST generado por el parser.
```

---

## Documentación API

```json
/api/schema/ → OpenAPI JSON
/api/docs/ → Swagger UI
/api/redoc/ → ReDoc
```

---

## Configuración local

Backend

```json
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Archivo .env:

```json
secret_key=changeme
debug=True
database_url=
direct_url=[http://localhost:5173](http://localhost:5173)
allowed_hosts=localhost,127.0.0.1
```

Ejecución:

```json
python manage.py migrate
python manage.py runserver
```

Tests:

```json
python manage.py test parser
```

---

Frontend

```json
cd frontend
npm install
npm run dev
```

Archivo .env:

```json
api_base_url=[http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)
NODE_ENV=development
```

---

## Deployment (Vercel)

* Frontend en ruta /
* Backend en ruta /api

Variables importantes:

```json
api_base_url=/api
database_url=postgresql://...
allowed_hosts=grammar.sglabs.site
```

---

## CORS y seguridad

Configurado en Django (settings.py):

* CORS_ALLOWED_ORIGINS
* allowed_hosts
* direct_url para entorno local

---

## Ficha técnica

Frontend

* Framework: Remix 2.16.0
* Lenguaje: TypeScript
* Runtime: Node.js >= 20

Dependencias principales:

* React 18
* Axios
* Framer Motion
* React D3 Tree
* Tesseract.js
* html2canvas

Herramientas de desarrollo:

* Vite
* TailwindCSS
* ESLint
* TypeScript

---

Backend

* Framework: Django 6.0.4
* API: Django REST Framework
* Documentación: drf-spectacular

Dependencias clave:

* nltk
* psycopg2
* gunicorn
* django-cors-headers
* whitenoise

---

Base de datos

* PostgreSQL en producción
* SQLite en desarrollo

---

IDE utilizado

* Visual Studio Code

---

Paradigma

* Programación Orientada a Objetos (POO)

---

## Integrantes

* Samir José Osorio Gil
* Isabella Builtrago Uzuga

---

## Entrega

* Repositorio en GitHub
* Código funcional
* README documentado
* Uso de POO en la solución
