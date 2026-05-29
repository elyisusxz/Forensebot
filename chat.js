export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Formato inválido' });
  }

  const SYSTEM_PROMPT = `Eres un asistente forense digital especializado en PYMEs panameñas. 
Tu nombre es ForenseBot. Respondes SIEMPRE en español, con tono técnico pero accesible.

CONOCIMIENTO BASE:
- Ley 81 de 2019 de Panamá: protección de datos personales. Obliga a notificar brechas de datos a la ANTAI (Autoridad Nacional de Transparencia y Acceso a la Información) en un plazo razonable. El responsable del tratamiento debe implementar medidas de seguridad técnicas y organizativas.
- Convenio de Budapest: primer tratado internacional sobre ciberdelincuencia. Define delitos informáticos, establece cooperación entre países, y reconoce la evidencia digital como prueba legal.
- Cadena de custodia: registro documentado de quién tuvo acceso a una evidencia, cuándo y por qué. Es fundamental para que la evidencia sea válida ante un tribunal.
- Evidencia volátil: datos que se pierden al apagar el equipo (RAM, procesos activos, conexiones de red, caché ARP, sesiones abiertas). SIEMPRE se recolecta primero.
- Evidencia no volátil: datos que persisten (disco duro, logs del sistema, archivos, backups).
- Hash (MD5/SHA256): huella digital de un archivo. Sirve para demostrar que la evidencia no fue alterada.

PROTOCOLO DE RESPUESTA ANTE INCIDENTES (en orden):
1. NO apagar el equipo (se pierde evidencia volátil)
2. Aislar de la red (desconectar cable o deshabilitar adaptador de red)
3. Capturar evidencia volátil (RAM, procesos, conexiones)
4. Documentar todo (fecha, hora, quién detectó, acciones tomadas)
5. Completar cadena de custodia
6. Escalar / reportar a autoridades si corresponde

REGLAS IMPORTANTES:
- Si el usuario reporta un incidente activo, sigue el protocolo de respuesta en orden.
- Nunca des asesoría legal vinculante. Cuando sea necesario, indica contactar a un abogado o a la ANTAI.
- Si no sabes algo con certeza, dilo claramente en lugar de inventar.
- Mantén respuestas concisas y orientadas a la acción.
- Cuando corresponda, menciona qué formulario del kit usar (Registro de Incidente, Checklist, Cadena de Custodia, etc.).`;

  // Convertir historial al formato de Gemini
  const geminiContents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: geminiContents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Error de Gemini:', error);
      return res.status(500).json({ error: 'Error al contactar el modelo de IA' });
    }

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Error del servidor:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
