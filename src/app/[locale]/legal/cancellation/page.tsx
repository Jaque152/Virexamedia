import { T } from "@/components/shared/T";

export default function CancellationPage() {
  return (
    <main className="min-h-screen bg-background bg-grain pt-32 pb-24 text-foreground relative">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-gradient font-serif">
          <T>Política de Devoluciones y Reembolsos</T>
        </h1>
        
        <div className="space-y-6 text-muted-foreground leading-relaxed font-sans text-justify">
          <p>
            <T>En</T> <strong>AYRANET S.A. DE C.V.</strong> <T>(en adelante “</T><strong>VIREXA MEDIA</strong><T>”), nos esforzamos por brindar la mejor experiencia a nuestros clientes en todos nuestros servicios. Sin embargo, entendemos que pueden surgir circunstancias que requieran devoluciones o solicitudes de reembolso. A continuación, presentamos nuestra política al respecto.</T>
          </p>
          <p><T>Al realizar una compra con nosotros, usted acepta estar sujeto a la siguiente Política de Devolución y Reembolso, la cual le recomendamos leer detenidamente antes de hacer un pedido.</T></p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4"><T>CAMBIO DE ÓRDENES</T></h2>
          <p><T>Si alguna de las Partes desea cambiar el alcance o contratar servicios adicionales para completar el alcance del pedido, enviará los detalles del cambio solicitado a la otra Parte por escrito.</T> <strong>VIREXA MEDIA</strong><T>, dentro de un tiempo razonable después de dicha solicitud, proporcionará un presupuesto por escrito al Cliente de:</T></p>
          <ul className="list-disc pl-6 space-y-2">
            <li><T>El alcance y entregables de los servicios solicitados.</T></li>
            <li><T>El tiempo necesario para implementar los cambios.</T></li>
            <li><T>Ajustes en los precios.</T></li>
            <li><T>Cualquier otro impacto que el cambio pueda tener en la ejecución de este Acuerdo.</T></li>
          </ul>
          <p><T>Inmediatamente después de recibir el presupuesto por escrito, las Partes negociarán y acordarán los términos de dicho cambio (una “Orden de cambio”). Ninguna de las partes estará obligada por ninguna orden de cambio a menos que se acuerde mutuamente.</T></p>
          <p><strong>VIREXA MEDIA</strong> <T>de vez en cuando puede cambiar los Servicios sin el consentimiento del Cliente, siempre que dichos cambios no afecten materialmente la naturaleza o el alcance de los Servicios, o las tarifas o las fechas de ejecución establecidas en el Pedido.</T></p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4"><T>GARANTÍA</T></h2>
          <p><strong>VIREXA MEDIA</strong> <T>declara y garantiza al Cliente que prestará los Servicios utilizando personal con las habilidades, experiencia y calificaciones requeridas y de una manera profesional y hábil y que dedicará los recursos adecuados para cumplir con sus obligaciones en virtud de estos Términos.</T></p>
          <p><T>Si el Cliente, dentro de los 15 días posteriores a la recepción de los Servicios, notifica a</T> <strong>VIREXA MEDIA</strong> <T>que los Servicios no cumplen con los requisitos del Pedido,</T> <strong>VIREXA MEDIA</strong><T>, a su entera discreción, y como único recurso del Cliente, puede hacer lo siguiente:</T></p>
          <ul className="list-disc pl-6 space-y-2">
            <li><T>Reparar o volver a realizar dichos Servicios (o la parte defectuosa), de acuerdo a los términos de esta política.</T></li>
            <li><T>Acreditar o reembolsar el precio de dichos Servicios, de acuerdo a los términos de esta política.</T></li>
            <li><T>Rechazar el cambio, devolución o reembolso de los servicios, si no cumple con los términos de esta política para ser aplicable.</T></li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4"><T>RENUNCIA DE GARANTÍAS</T></h2>
          <p><T>Excepto por la garantía establecida en el párrafo anterior de estos términos,</T> <strong>VIREXA MEDIA</strong> <T>no otorga ninguna garantía con respecto a los servicios, incluyendo cualquier (a) garantía de comerciabilidad; (b) garantía de aptitud para un propósito particular; (c) garantía de título; o (d) garantía contra la infracción de los derechos de propiedad intelectual de un tercero; ya sea expresa o implícita por ley, curso de negociación, curso de rendimiento, uso del comercio o de otro modo.</T></p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4"><T>DEVOLUCIONES</T></h2>
          <p><T>Lamentablemente, no podemos ofrecer reembolsos ni cambios en los productos comprados a menos que presenten algún defecto. Sin embargo, en caso de recibir un producto defectuoso o si el pedido que ha recibido difiere de su intención de compra, aceptaremos devoluciones dentro de los 15 días hábiles siguientes a la fecha de recepción del servicio.</T></p>
          <p><T>Para procesar su devolución, necesitamos un recibo o comprobante de compra, así como una declaración escrita detallando los motivos de la devolución. Le solicitamos que se ponga en contacto con nuestro departamento de atención al cliente a través de nuestro sitio web.</T></p>

          <h3 className="text-xl font-bold text-foreground mt-8 mb-4"><T>Servicios Elegibles para Devolución</T></h3>
          <p><T>Las devoluciones sólo se aceptarán si los servicios presentan defectos de fabricación. En el caso de los productos digitales, solo se admitirán devoluciones si se entrega un producto incorrecto o dañado.</T></p>

          <h3 className="text-xl font-bold text-foreground mt-8 mb-4"><T>Procedimiento de Devolución</T></h3>
          <p><T>Los clientes deben notificar a</T> <strong>VIREXA MEDIA</strong> <T>su intención de devolver un servicio o producto dentro de los 15 días hábiles posteriores a la entrega. Esta notificación debe incluir detalles claros y documentados sobre el motivo de la devolución.</T></p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4"><T>INTERCAMBIOS</T></h2>
          <p><T>Nuestra política de reemplazo aplica solo a servicios defectuosos o dañados. Por favor contáctanos para notificar el problema y comenzar el proceso de reemplazo. Te pedimos que por favor nos proporciones detalles claros para una solución rápida y efectiva, ya que nos comprometemos a garantizar tu satisfacción.</T></p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4"><T>REEMBOLSOS</T></h2>
          
          <h3 className="text-xl font-bold text-foreground mt-8 mb-4"><T>Criterios de Reembolso</T></h3>
          <p><T>Los reembolsos se procesarán tras recibir y evaluar los servicios devueltos o verificar la elegibilidad del servicio para reembolso. Nos reservamos el derecho de negar un reembolso si los servicios devueltos no cumplen con las condiciones mencionadas.</T></p>
          <p><T>Una vez recibida e inspeccionada su devolución, le informaremos por correo electrónico si su devolución ha sido aprobada o rechazada. En caso de aprobación, su reembolso se procesará y se aplicará automáticamente un crédito a su tarjeta de crédito o al método de pago original.</T></p>
          <p><T>Para solicitar un reembolso, comuníquese con nuestro equipo de atención al cliente dentro de un plazo máximo de 15 días hábiles desde la fecha de entrega del servicio.</T></p>

          <h3 className="text-xl font-bold text-foreground mt-8 mb-4"><T>Condiciones de Reembolso</T></h3>
          <p><T>Los reembolsos están sujetos a evaluación y pueden variar según el tipo de servicio adquirido. Para servicios con pagos parciales o en etapas, los reembolsos se basarán en las etapas completadas y aprobadas.</T></p>
          <p><T>No se realizarán reembolsos si el cliente ha violado los términos del contrato o ha proporcionado información incorrecta o insuficiente que afecte la prestación del servicio.</T></p>
          <p><T>Los servicios que hayan sido utilizados, modificados o alterados después de la entrega no serán elegibles para reembolso, a menos que exista un defecto inherente al producto o servicio que lo haga inadecuado para su propósito previsto.</T></p>

          <h3 className="text-xl font-bold text-foreground mt-8 mb-4"><T>Entregas</T></h3>
          <p><T>Los tiempos de entrega de los proyectos se establecerán de forma detallada con cada cliente al inicio de la colaboración. Estos plazos se determinarán tras analizar en profundidad la complejidad y el alcance del proyecto, considerando aspectos como la disponibilidad de recursos, la complejidad técnica y la colaboración necesaria del cliente.</T></p>
          <p><T>En caso de surgir imprevistos o cambios en los requisitos del proyecto, informaremos de inmediato al cliente y acordaremos ajustes en los plazos de entrega. Trabajaremos para llegar a un acuerdo en caso de requerir ajustes debido a circunstancias imprevistas, lo que podría implicar reprogramar fechas límite o implementar medidas correctivas para mitigar cualquier impacto en la calidad y el resultado final del proyecto.</T></p>
          <p><T>Además, los plazos acordados incluirán períodos específicos para las revisiones por parte del cliente, estableciendo claramente las fechas límite para recibir comentarios y aprobaciones. Esto garantizará una colaboración efectiva y un proceso de revisión eficiente.</T></p>
          <p><T>En casos excepcionales, como eventos de fuerza mayor o situaciones fuera del control de ambas partes, los plazos podrían necesitar ser reajustados. En tales circunstancias,</T> <strong>VIREXA MEDIA</strong> <T>y el cliente colaborarán de buena fe para adaptar los plazos y minimizar cualquier impacto negativo.</T></p>

          <h2 className="text-2xl font-bold text-foreground mt-10 mb-4"><T>CAMBIOS A LAS POLÍTICAS</T></h2>
          <p><T>La presente Política puede sufrir modificaciones, cambios o actualizaciones derivadas de nuevos requerimientos legales; de nuestras propias necesidades por los productos o servicios que ofrecemos, de nuestras prácticas de Privacidad, de cambios en nuestro modelo de negocio o por otras causas.</T></p>
          <p><T>Nos comprometemos a mantenerlo informado sobre los cambios que pueda sufrir la presente Política por lo que le recomendamos ingresar periódicamente a nuestro sitio web.</T></p>
        </div>
      </div>
    </main>
  );
}