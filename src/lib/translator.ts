import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_URL = "https://api-free.deepl.com/v2/translate";

export async function getTranslation(text: string, targetLang: string): Promise<string> {
  if (!text || targetLang === 'es') return text;

  try {
    // 1. Buscar en Caché (Supabase)
    const { data: existing } = await supabase
      .from('translations')
      .select('translated_text')
      .eq('key_text', text)
      .eq('lang', targetLang)
      .single();

    if (existing) return existing.translated_text;

    // 2. Si no existe, llamar a DeepL
    const response = await fetch(DEEPL_URL, {
      method: 'POST',
      headers: { 
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang.toUpperCase() === 'EN' ? 'EN-US' : targetLang.toUpperCase(),
        source_lang: 'ES'
      }),
    });

    const data = await response.json();
    if (!data.translations) throw new Error("Falla en DeepL");

    const translatedText = data.translations[0].text;

    // 3. Guardar en Supabase para futuras consultas (Fire and forget, sin await para no bloquear)
    supabase.from('translations').upsert({
      key_text: text,
      lang: targetLang,
      translated_text: translatedText
    }).then(({ error }) => {
      if (error) console.error("Error guardando caché de traducción:", error);
    });

    return translatedText;
  } catch (error) {
    console.error("Error en getTranslation:", error);
    return text; 
  }
}