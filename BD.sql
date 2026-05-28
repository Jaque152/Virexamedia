-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================================
-- 1. LIMPIEZA PREVIA
-- =====================================================================================
DROP TABLE IF EXISTS public.checkout_items_virexa CASCADE;
DROP TABLE IF EXISTS public.checkouts_virexa CASCADE;
DROP TABLE IF EXISTS public.cart_items_virexa CASCADE;
DROP TABLE IF EXISTS public.custom_plan_payments_virexa CASCADE;
DROP TABLE IF EXISTS public.contacts_virexa CASCADE;
DROP TABLE IF EXISTS public.plans_virexa CASCADE;
DROP TABLE IF EXISTS public.categories_virexa CASCADE;

-- =====================================================================================
-- 2. CREACIÓN DE TABLAS
-- =====================================================================================

CREATE TABLE public.categories_virexa (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE
);

CREATE TABLE public.plans_virexa (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  category_id INTEGER REFERENCES public.categories_virexa(id),
  price NUMERIC NOT NULL,
  description TEXT,
  features JSONB,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.cart_items_virexa (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR NOT NULL,
  plan_id INTEGER REFERENCES public.plans_virexa(id),
  quantity INTEGER DEFAULT 1,
  custom_price NUMERIC,  
  quote_id VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.checkouts_virexa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR NOT NULL,
  nombre VARCHAR NOT NULL,
  apellidos VARCHAR NOT NULL,
  pais_region VARCHAR NOT NULL,
  direccion_calle VARCHAR NOT NULL,
  localidad_ciudad VARCHAR NOT NULL,
  region_estado VARCHAR NOT NULL,
  codigo_postal VARCHAR NOT NULL,
  telefono VARCHAR,
  correo_electronico VARCHAR NOT NULL,
  indicaciones_pedido TEXT,
  subtotal NUMERIC NOT NULL,
  impuesto NUMERIC NOT NULL,
  total_estimado NUMERIC NOT NULL,
  payment_status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.checkout_items_virexa (
  id SERIAL PRIMARY KEY,
  checkout_id UUID REFERENCES public.checkouts_virexa(id),
  plan_id INTEGER REFERENCES public.plans_virexa(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL,
  custom_price NUMERIC,  
  quote_id VARCHAR
);

CREATE TABLE public.contacts_virexa (
  id SERIAL PRIMARY KEY,
  nombre_completo VARCHAR NOT NULL,
  empresa_negocio VARCHAR NOT NULL,
  telefono VARCHAR NOT NULL,
  correo_electronico VARCHAR NOT NULL,
  asunto VARCHAR NOT NULL,
  mensaje TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.custom_plan_payments_virexa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR NOT NULL,
  apellidos VARCHAR NOT NULL,
  correo_electronico VARCHAR NOT NULL,
  id_cotizacion VARCHAR NOT NULL,
  monto_a_pagar NUMERIC NOT NULL,
  payment_status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexar por session_id para consultas más rápidas
CREATE INDEX idx_cart_session ON public.cart_items_virexa(session_id);

-- =====================================================================================
-- 3. POLÍTICAS DE SEGURIDAD RLS
-- =====================================================================================
ALTER TABLE public.categories_virexa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans_virexa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items_virexa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkouts_virexa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkout_items_virexa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts_virexa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_plan_payments_virexa ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública categorías virexa" ON public.categories_virexa FOR SELECT USING (true);
CREATE POLICY "Lectura pública planes virexa" ON public.plans_virexa FOR SELECT USING (true);
CREATE POLICY "Sesión privada carrito" ON public.cart_items_virexa FOR ALL USING (session_id = current_setting('app.current_session_id', true)) WITH CHECK (session_id = current_setting('app.current_session_id', true));
CREATE POLICY "Insertar checkouts anónimos virexa" ON public.checkouts_virexa FOR INSERT WITH CHECK (true);
CREATE POLICY "Insertar items checkout virexa" ON public.checkout_items_virexa FOR INSERT WITH CHECK (true);
CREATE POLICY "Insertar contactos anónimos virexa" ON public.contacts_virexa FOR INSERT WITH CHECK (true);
CREATE POLICY "Insertar pagos personalizados virexa" ON public.custom_plan_payments_virexa FOR INSERT WITH CHECK (true);

-- Permisos específicos para el carrito que reemplazan el DROP POLICY del final
CREATE POLICY "Permitir insertar carrito" ON public.cart_items_virexa FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir leer carrito" ON public.cart_items_virexa FOR SELECT USING (true);
CREATE POLICY "Permitir borrar carrito" ON public.cart_items_virexa FOR DELETE USING (true);
CREATE POLICY "Permitir actualizar carrito" ON public.cart_items_virexa FOR UPDATE USING (true);

-- =====================================================================================
-- 4. INSERTAR DATOS (CATEGORÍAS Y PLANES)
-- =====================================================================================
INSERT INTO public.categories_virexa (name, slug) VALUES 
('Planes de marketing', 'planes-de-marketing');

INSERT INTO public.plans_virexa (title, slug, category_id, price, description, features, image_url) VALUES

('Plan Ultra Premium', 'plan-ultra-premium', 1, 25000.00, 'Plan estratégico y orientado a resultados para maximizar tu inversión en marketing.', 
'["Investigación de mercado Ultra Premium: Análisis detallado de competencia, segmentos, comportamientos, datos y estudios de caso.", "Creación de una estrategia de marketing de élite: Estrategia avanzada y personalizada de marketing digital y tradicional.", "Creación de materiales de marketing avanzados: Desarrollo de identidad de marca (logotipo y materiales gráficos).", "Creación de materiales de marketing más avanzados: Producción de 3 videos de alta gama de hasta 25 segundos.", "Gestión de anuncios publicitarios: Optimización avanzada de anuncios en varias plataformas con segmentación precisa.", "Consultoría estratégica de alto nivel: Estrategias de crecimiento, análisis de datos continuos y sesiones de optimización personalizadas.", "Planificación y ejecución de eventos grandes: Apoyo integral en la organización de grandes eventos o lanzamientos de productos."]'::jsonb,
'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1170&auto=format&fit=crop'),

('Plan Elite', 'plan-elite', 1, 20900.00, 'Solución completa con herramientas avanzadas y análisis estratégico.', 
'["Investigación de mercado premium: Análisis profundo de mercado, tendencias y comportamiento del consumidor.", "Creación de una estrategia de marketing premium: Estrategia multicanal integrada y seguimiento exhaustivo.", "Creación de materiales de marketing avanzados: 2 videos publicitarios de alta calidad de hasta 20 segundos cada uno.", "Gestión de anuncios publicitarios: Optimización y monitoreo en 2 plataformas (Google Ads, Facebook, Instagram o LinkedIn).", "Consultoría continua: Reunión de seguimiento y análisis de KPIs."]'::jsonb,
'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1170&auto=format&fit=crop'),

('Plan Intensivo Pro', 'plan-intensivo-pro', 1, 16300.00, 'Consolida tu marca con campañas efectivas y personalizadas.', 
'["Investigación de mercado intensiva: Análisis en profundidad con estudio de competencia detallado y encuestas directas hasta 25 personas.", "Creación de una estrategia de marketing avanzada: Estrategia integrada con canales de marketing.", "Creación de materiales de marketing avanzados: Diseño de 1 folleto, 1 logo y 2 tarjetas de presentación.", "Creación de materiales de marketing más avanzados: Video de hasta 20 segundos.", "Gestión de anuncios publicitarios: Gestión y optimización de dos anuncios en Google Ads con informes detallados.", "Consultoría media: Asesoramiento personalizado."]'::jsonb,
'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1170&auto=format&fit=crop'),

('Plan Premium', 'plan-premium', 1, 12000.00, 'Estrategia de marketing optimizada para el éxito.', 
'["Investigación de mercado avanzada: Informe detallado con segmentación, análisis de tendencias y percepción de marca.", "Creación de una estrategia de marketing avanzada: Estrategia optimizada para escalabilidad y expansión.", "Creación de materiales de marketing más avanzados: Video corto promocional.", "Gestión de anuncios publicitarios: Administración de campañas de anuncios en Facebook o Google (presupuesto adicional)."]'::jsonb,
'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1170&auto=format&fit=crop'),

('Plan Avanzado', 'plan-avanzado', 1, 8700.00, 'Impulsa tu negocio para maximizar tu alcance y fortalecer tu presencia en el mercado.', 
'["Investigación de mercado intermedia: Investigación y análisis de datos cualitativos y cuantitativos.", "Creación de una estrategia de marketing intermedia: Estrategia con objetivos medibles y ajustados a largo plazo.", "Creación de materiales de marketing básicos: 2 folletos y 2 tarjetas de presentación."]'::jsonb,
'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1170&auto=format&fit=crop'),

('Plan Intensivo', 'plan-intensivo', 1, 7140.00, 'Expande tus horizontes con esta estrategia de marketing.', 
'["Investigación de mercado intermedia: Análisis de tendencias del mercado y segmentación avanzada.", "Creación de una estrategia de marketing simple: Estrategia optimizada.", "Creación de materiales de marketing básicos: 1 folleto y 1 tarjeta de presentación."]'::jsonb,
'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1170&auto=format&fit=crop'),

('Plan Intermedio', 'plan-intermedio', 1, 5500.00, 'Da el siguiente paso en tu estrategia de marketing.', 
'["Investigación de mercado básica: Análisis más detallado con una encuesta aplicada a 10 personas.", "Creación de una estrategia de marketing simple: Estrategia básica más enfocada en las fortalezas del cliente.", "Creación de materiales de marketing básicos: 1 folleto con diseño personalizado."]'::jsonb,
'https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=1170&auto=format&fit=crop'),

('Plan Básico', 'plan-basico', 1, 3500.00, 'Tu primer gran paso a una estrategia de marketing exitosa.', 
'["Investigación de mercado básica: Análisis sencillo de mercado, competencia y perfil del cliente ideal.", "Creación de una estrategia de marketing simple: Estrategia básica adaptada a las necesidades generales del cliente."]'::jsonb,
'https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=1170&auto=format&fit=crop');

-- =====================================================================================
-- 5. INSERTAR EL "PLAN PERSONALIZADO" BASE
-- =====================================================================================
INSERT INTO public.plans_virexa (title, slug, category_id, price, description, features, image_url) 
VALUES (
  'Plan Personalizado', 
  'plan-personalizado', 
  1, 
  0.00, 
  'Estrategia de marketing altamente personalizada y adaptada a tus necesidades únicas.', 
  '[]'::jsonb,
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1170&auto=format&fit=crop'
);

-- =====================================================================================
-- 6. FUNCIÓN NECESARIA PARA NEXT.JS MIDDLEWARE
-- =====================================================================================
CREATE OR REPLACE FUNCTION set_session_id(s_id text) RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_session_id', s_id, false);
END;
$$ LANGUAGE plpgsql;