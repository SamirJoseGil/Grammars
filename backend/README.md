# Backend (Django)

Instrucciones rápidas para levantar el backend localmente.

1. Crear y activar un entorno virtual (recomendado):

```bash
python -m venv .venv
source .venv/bin/activate
```

2. Instalar dependencias:

```bash
pip install -r requirements.txt
```

3. Aplicar migraciones y ejecutar el servidor:

```bash
cd backend
python manage.py migrate
python manage.py runserver
```

Producci\u00f3n
-----------

Pasos b\u00e1sicos para desplegar en producci\u00f3n (ejemplo):

1. Exportar variables de entorno definidas en `.env.sample` (`SECRET_KEY`, `DBURL`, `ALLOWED_HOSTS`, `DIRECTURL`, etc.).

2. Instalar dependencias y recolectar archivos est\u00e1ticos:

```bash
pip install -r requirements.txt
python manage.py collectstatic --noinput
```

3. Ejecutar con `gunicorn` (o configurar el servidor WSGI de tu proveedor):

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

Notas de seguridad y configuraci\u00f3n:

- `DEBUG` debe estar en `False` en producci\u00f3n.
- `SECRET_KEY` no debe estar en el repositorio; usar variables de entorno o gestor de secretos.
- `DBURL` (o `DATABASE_URL`) define la conexi\u00f3n a Postgres.
- `DIRECTURL` se agrega a `CORS_ALLOWED_ORIGINS` si se define.
- `whitenoise` se usa para servir archivos est\u00e1ticos simples desde Django cuando aplica.

4. Endpoints disponibles (POST):

- `/parse` — body: `{ "grammar": "S -> a", "text": "a" }`
- `/derivation` — body: `{ "grammar": "S -> a", "text": "a", "derivation_type": "left" }`
- `/tree` — body: `{ "grammar": "S -> a", "text": "a" }`
- `/ast` — body: `{ "grammar": "S -> a", "text": "a" }`

**Formatos de gramática soportados:**

El parser soporta dos formatos de reglas de gramática:

1. **Formato BNF tradicional** (con terminales entre comillas):
   ```
   S -> 'a' '+' 'b'
   E -> E '+' T | E '-' T | T
   ```

2. **Formato académico** (como se enseña en clase, auto-quoted):
   ```
   S = a + b
   E = E + T | E - T | T
   ```
   
   Los terminales se identifican automáticamente y se citan. Los no-terminales se detectan porque comienzan con mayúscula.

Ejemplo `curl`:

```bash
# Con formato BNF
curl -X POST http://127.0.0.1:8000/parse \
  -H "Content-Type: application/json" \
  -d '{"grammar":"S -> a","text":"a"}'

# Con formato académico (se auto-convierte)
curl -X POST http://127.0.0.1:8000/parse \
  -H "Content-Type: application/json" \
  -d '{"grammar":"E = E + T | T\nT = n","text":"n + n"}'
```

Notas:

- La aplicaci\u00f3n usa `nltk` para construir la CFG y parsear. No se descargan corpora adicionales por defecto.
- CORS est\u00e1 configurado para permitir conexiones desde `localhost:3000` y `5173`.
- Variables de entorno reconocidas para producci\u00f3n:

	- `DBURL` — URL de la base de datos Postgres (ej: `postgres://user:pass@host:5432/dbname`).
	- `DIRECTURL` — URL direc (por ejemplo la URL de frontend o la URL directa esperada para CORS).

Si `DBURL` no est\u00e1 definida, se usa SQLite local por defecto.
