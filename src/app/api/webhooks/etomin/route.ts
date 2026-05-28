import { NextResponse } from 'next/server';

// Next.js requiere que la función se llame exactamente como el método HTTP (POST, GET, etc.)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Aquí irá tu lógica futura para procesar notificaciones de Octano
    console.log("Notificación de Octano recibida:", body);

    // Siempre debes devolver una respuesta al webhook para que no reintente
    return NextResponse.json({ success: true, message: "Webhook recibido" }, { status: 200 });
  } catch (error) {
    console.error("Error en webhook de Octano:", error);
    return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
  }
}

// Opcional: Si necesitas bloquear métodos GET
export async function GET() {
  return NextResponse.json({ message: "Método no permitido" }, { status: 405 });
}