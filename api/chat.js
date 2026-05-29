   1 │ export default async function handler(req, res) {
   2 │   if (req.method !== 'POST') {
   3 │     return res.status(405).json({ error: 'Método no permitido' });
   4 │   }
   5 │ 
   6 │   const { messages } = req.body;
   7 │ 
   8 │   if (!messages || !Array.isArray(messages)) {
   9 │     return res.status(400).json({ error: 'Formato inválido' });
  10 │   }
  11 │ 
  12 │   const SYSTEM_PROMPT = `Eres un asistente forense digital especializado en PYMEs panameñas. 
  13 │ Tu nombre es ForenseBot. Respondes SIEMPRE en español, con tono técnico pero accesible.
  14 │ 
  15 │ CONOCIMIENTO BASE:
  16 │ - Ley 81 de 2019 de Panamá: protección de datos personales. Obliga a notificar brechas de datos a la ANTAI (Autoridad Nacional de Transparencia y Acceso a la Información) en un plazo razonable. El respon
     │ sable del tratamiento debe implementar medidas de seguridad técnicas y organizativas.
  17 │ - Convenio de Budapest: primer tratado internacional sobre ciberdelincuencia. Define delitos informáticos, establece cooperación entre países, y reconoce la evidencia digital como prueba legal.
  18 │ - Cadena de custodia: registro documentado de quién tuvo acceso a una evidencia, cuándo y por qué. Es fundamental para que la evidencia sea válida ante un tribunal.
  19 │ - Evidencia volátil: datos que se pierden al apagar el equipo (RAM, procesos activos, conexiones de red, caché ARP, sesiones abiertas). SIEMPRE se recolecta primero.
  20 │ - Evidencia no volátil: datos que persisten (disco duro, logs del sistema, archivos, backups).
  21 │ - Hash (MD5/SHA256): huella digital de un archivo. Sirve para demostrar que la evidencia no fue alterada.
  22 │ 
  23 │ PROTOCOLO DE RESPUESTA ANTE INCIDENTES (en orden):
  24 │ 1. NO apagar el equipo (se pierde evidencia volátil)
  25 │ 2. Aislar de la red (desconectar cable o deshabilitar adaptador de red)
  26 │ 3. Capturar evidencia volátil (RAM, procesos, conexiones)
  27 │ 4. Documentar todo (fecha, hora, quién detectó, acciones tomadas)
  28 │ 5. Completar cadena de custodia
  29 │ 6. Escalar / reportar a autoridades si corresponde
  30 │ 
  31 │ REGLAS IMPORTANTES:
  32 │ - Si el usuario reporta un incidente activo, sigue el protocolo de respuesta en orden.
  33 │ - Nunca des asesoría legal vinculante. Cuando sea necesario, indica contactar a un abogado o a la ANTAI.
  34 │ - Si no sabes algo con certeza, dilo claramente en lugar de inventar.
  35 │ - Mantén respuestas concisas y orientadas a la acción.
  36 │ - Cuando corresponda, menciona qué formulario del kit usar (Registro de Incidente, Checklist, Cadena de Custodia, etc.).`;
  37 │ 
  38 │   // Convertir historial al formato de Gemini
  39 │   const geminiContents = messages.map(m => ({
  40 │     role: m.role === 'assistant' ? 'model' : 'user',
  41 │     parts: [{ text: m.content }]
  42 │   }));
  43 │ 
  44 │   try {
  45 │     const response = await fetch(
  46 │       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
  47 │       {
  48 │         method: 'POST',
  49 │         headers: { 'Content-Type': 'application/json' },
  50 │         body: JSON.stringify({
  51 │           system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
  52 │           contents: geminiContents,
  53 │           generationConfig: {
  54 │             temperature: 0.3,
  55 │             maxOutputTokens: 1024
  56 │           }
  57 │         })
  58 │       }
  59 │     );
  60 │ 
  61 │     if (!response.ok) {
  62 │       const error = await response.json();
  63 │       console.error('Error de Gemini:', error);
  64 │       return res.status(500).json({ error: 'Error al contactar el modelo de IA' });
  65 │     }
  66 │ 
  67 │     const data = await response.json();
  68 │     const reply = data.candidates[0].content.parts[0].text;
  69 │ 
  70 │     return res.status(200).json({ reply });
  71 │ 
  72 │   } catch (error) {
  73 │     console.error('Error del servidor:', error);
  74 │     return res.status(500).json({ error: 'Error interno del servidor' });
  75 │   }
  76 │ }
