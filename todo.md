# 🧠 0. Stack final (definido, sin dudas existenciales)

* Frontend: Remix + React
* Backend: Django + Django REST
* Parsing: NLTK
* Visualización: react-d3-tree

---

# 🧱 1. Setup inicial

## Backend

* [x] Crear proyecto Django
* [x] Crear app `parser`
* [x] Instalar dependencias:

  * [x] nltk
  * [x] djangorestframework
* [x] Configurar CORS (para Remix)

## Frontend

* [x] Crear proyecto con Remix
* [x] Instalar librerías:

  * [x] axios / fetch wrapper
  * [x] react-d3-tree

---

# 🧩 2. Modelo POO (esto es lo que te califica)

## Clases base

* [x] `Grammar`

  * [x] Parsear BNF
  * [x] Validar reglas

* [x] `ProductionRule`

  * [x] LHS / RHS

* [x] `DerivationEngine`

  * [x] Método left derivation
  * [x] Método right derivation

* [x] `ParseTreeNode`

  * [x] value
  * [x] children

* [x] `TreeBuilder`

  * [x] Construir árbol desde derivación

* [x] `ASTNode`

  * [x] value
  * [x] children

* [x] `ASTBuilder`

  * [x] Simplificar árbol

---

# ⚙️ 3. Lógica del parser (núcleo real)

## CFG con NLTK

* [x] Convertir input a formato válido de CFG
* [x] Crear gramática:

```python id="cfg12x"
from nltk import CFG
grammar = CFG.fromstring(user_input)
```

* [x] Inicializar parser:

```python id="cfg33y"
from nltk.parse import ChartParser
parser = ChartParser(grammar)
```

---

## Derivación

* [x] Implementar:

  * [x] Left derivation (expandir primer no terminal)
  * [x] Right derivation (expandir último)

* [x] Guardar pasos tipo:

```id="der1"
S
→ S + T
→ T + T
→ a + T
→ a + b
```

---

## Árbol de derivación

* [x] Convertir output de NLTK a estructura JSON
* [x] Formato:

```json
{
  "name": "S",
  "children": [
    { "name": "a" },
    { "name": "+" },
    { "name": "b" }
  ]
}
```

---

## AST

* [x] Eliminar nodos irrelevantes:

  * [x] paréntesis
  * [x] reglas intermedias
* [x] Promover operadores como raíz

---

# 🌐 4. API (Django REST)

Endpoints:

* [x] `POST /parse`

  * input: grammar + string
  * output: success / error

* [x] `POST /derivation`

  * [x] tipo: left/right
  * [x] output: pasos

* [x] `POST /tree`

  * [x] output: árbol JSON

* [x] `POST /ast`

  * [x] output: AST JSON

---

# 🎨 5. Frontend (lo visible)

## UI base

* [x] Textarea → gramática
* [x] Input → expresión
* [x] Selector:

  * [x] Left
  * [x] Right
* [x] Botón “Generate”

---

## Outputs

### Derivación

* [x] Mostrar lista de pasos
* [ ] (extra) animación paso a paso

### Árbol

* [x] Render con react-d3-tree

### AST

* [x] Render separado
* [x] visual más limpio

---

# 🧪 6. Validaciones (evita que te humillen en la sustentación)

* [x] Gramática inválida
* [x] Expresión no generable
* [x] Ambigüedad
* [x] Errores legibles (no traceback horrible)

---

# 🚀 7. Mejores mejoras (elige con cabeza)

## Nivel útil

* [x] Resaltar símbolo expandido en cada paso
* [x] Botón “step by step”

---

## Nivel inteligente

* [x] Detectar múltiples árboles (ambigüedad)
* [x] Mostrar todos los parse trees

---

## Nivel académico

* [x] Soportar formato de gramática académico: `E = E + T`
* [x] Auto-citar terminales (no requiere comillas manuales)
* [x] Ejemplos predefinidos editables
* [x] Ambos formatos funcionan: `->` y `=`

---

## Nivel creativo (tu idea)

### OCR

* [x] Integrar Tesseract OCR
* [x] Subir imagen
* [x] Extraer texto
* [x] Limpiar símbolos (`->`, `|`)
* [x] Convertir a CFG

---

## Nivel pro

* [x] Exportar árbol como PNG
* [x] Exportar derivación como texto
* [x] Exportar derivación como imagen
* [ ] Guardar gramáticas
* [ ] Editor con syntax highlighting

---

# 📦 8. README (no lo arruines)

* [ ] Nombre del proyecto
* [ ] Integrantes
* [ ] Tecnologías
* [ ] Cómo correrlo
* [ ] Ejemplo real
* [ ] Screenshots

---

# 🎥 9. Video

* [ ] Mostrar:

  * [ ] Input
  * [ ] Derivación
  * [ ] Árbol
  * [ ] AST
* [ ] Explicar arquitectura (rápido, sin dormir al profe)

---

# ⏱️ 10. Plan realista

## Semana 1

* [x] Backend completo
* [x] Derivación funcionando
* [x] Parser estable

## Semana 2

* [x] UI
* [x] Árbol
* [x] AST
* [x] mejoras

---

# ⚠️ 11. Errores clásicos (evítalos y te ves inteligente)

* [ ] Intentar hacer parser desde cero
* [ ] Mezclar lógica con UI
* [ ] No manejar errores
* [ ] AST mal definido (solo copiar árbol)