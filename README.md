# ForenseBot — Guía de despliegue paso a paso

## Archivos del proyecto

```
chatbot-forense/
├── api/
│   └── chat.js       ← backend: llama a Groq y devuelve la respuesta
├── index.html        ← interfaz del chat
├── vercel.json       ← configuración de Vercel
└── README.md         ← esta guía
```

---

## PASO 1 — Crear cuenta en Groq y obtener la API Key

1. Abre https://console.groq.com
2. Haz clic en "Sign Up" y crea cuenta con tu email
3. Una vez dentro, ve al menú izquierdo → "API Keys"
4. Haz clic en "Create API Key"
5. Dale un nombre (ej: "forensebot")
6. **Copia la key que aparece — solo se muestra una vez**
   Ejemplo: `gsk_abc123xyz...`
7. Guárdala en un lugar seguro (bloc de notas por ahora)

---

## PASO 2 — Crear cuenta en GitHub y subir los archivos

1. Abre https://github.com y crea una cuenta
2. Una vez dentro, haz clic en el botón verde "New" (nuevo repositorio)
3. Nombre del repositorio: `forensebot`
4. Selecciona "Public"
5. Haz clic en "Create repository"
6. En la página del repositorio vacío, haz clic en "uploading an existing file"
7. Arrastra los 3 archivos: `index.html`, `vercel.json`, y la carpeta `api/` con `chat.js`
8. Haz clic en "Commit changes"

---

## PASO 3 — Crear cuenta en Vercel y desplegar

1. Abre https://vercel.com
2. Haz clic en "Sign Up" → "Continue with GitHub" (usa la misma cuenta)
3. Una vez dentro, haz clic en "Add New Project"
4. Vercel mostrará tus repositorios de GitHub → selecciona `forensebot`
5. Haz clic en "Deploy" — NO toques nada más todavía

**Espera — el deploy va a fallar la primera vez. Eso es normal.**
El chatbot no funciona aún porque falta agregar la API Key.

---

## PASO 4 — Agregar la API Key de Groq en Vercel

1. En Vercel, ve a tu proyecto `forensebot`
2. Haz clic en la pestaña "Settings"
3. En el menú izquierdo, haz clic en "Environment Variables"
4. Completa los campos:
   - **Key:** `GROQ_API_KEY`
   - **Value:** pega aquí la key que guardaste en el Paso 1
5. Haz clic en "Save"
6. Ve a la pestaña "Deployments"
7. Haz clic en los tres puntos del último deploy → "Redeploy"

---

## PASO 5 — Probar el chatbot

1. En la página principal de tu proyecto en Vercel verás un link como:
   `https://forensebot-abc123.vercel.app`
2. Abre ese link — deberías ver la interfaz del ForenseBot
3. Escribe una pregunta de prueba, por ejemplo:
   `¿Qué hago si detecté acceso no autorizado al servidor?`
4. Si responde correctamente, ¡está listo!
5. Comparte el link con tu equipo y socio formador

---

## Solución de problemas comunes

| Problema | Solución |
|---|---|
| El chat no responde | Verificar que la GROQ_API_KEY esté bien escrita en Vercel |
| Error 429 | Límite de Groq alcanzado, esperar 1 minuto |
| La página no carga | Verificar que el deploy en Vercel sea exitoso (verde) |

---

## Para actualizar el system prompt

Si quieren agregar más conocimiento al chatbot (nuevas leyes, casos de uso, etc.):

1. Abre el archivo `api/chat.js`
2. Busca la variable `SYSTEM_PROMPT`
3. Edita el texto dentro de las comillas
4. Sube el archivo actualizado a GitHub
5. Vercel redespliega automáticamente en ~1 minuto
