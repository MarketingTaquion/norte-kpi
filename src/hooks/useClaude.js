import { useCallback, useState } from 'react';
import { parseResponse } from '../utils/json.js';

// Hook genérico que maneja el ciclo completo de una llamada a la IA:
// loading -> fetch -> parse -> error. Nunca crashea silenciosamente.
export function useClaude() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const call = useCallback(async (systemPrompt, userPrompt, maxTokens = 8000) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await fetch('/.netlify/functions/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
          max_tokens: maxTokens,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error?.message || payload?.error || 'La API respondió con un error.');
      }

      const rawText = payload?.content?.[0]?.text;
      if (!rawText) {
        throw new Error('La respuesta de Claude no trae contenido de texto.');
      }

      const parsed = parseResponse(rawText);
      setData(parsed);
      return parsed;
    } catch (err) {
      setError(err.message || 'Error desconocido al llamar a la IA.');
      if (err.raw) console.error('Raw response (no parseable):', err.raw);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, call, reset };
}
