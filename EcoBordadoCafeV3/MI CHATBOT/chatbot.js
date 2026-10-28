
(function () {
  "use strict";

  function iniciarChatbot() {
    // Evitar crear el chatbot más de una vez.
    if (document.getElementById("chatWindow")) return;

    // =====================================================
    // 1. PRODUCTOS DEL CATÁLOGO
    // =====================================================

    const productosLocal = [
      { nombre: "Café preparado en taza", precio: 6000 },
      { nombre: "Café latte", precio: 10000 },
      { nombre: "Café frío", precio: 9000 },
      { nombre: "Café espresso", precio: 5000 },
      { nombre: "Capuchino preparado", precio: 9000 },
      { nombre: "Chocolate caliente", precio: 7000 },
      { nombre: "Pan de masa madre por porción", precio: 6000 },
      { nombre: "Sándwich artesanal", precio: 15000 },
      { nombre: "Porción de torta casera", precio: 8000 },
      { nombre: "Galletas artesanales", precio: 7000 }
    ];

    const productosDomicilio = [
      { nombre: "Café filtrado artesanal", precio: 40000 },
      { nombre: "Caja con sobres de capuchino", precio: 45000 },
      { nombre: "Infusiones de hierbas locales", precio: 18000 },
      { nombre: "Pan de masa madre", precio: 15000 },
      { nombre: "Galletas temáticas", precio: 15000 },
      { nombre: "Pastel mediano", precio: 16000 },
      { nombre: "Café preparado para llevar", precio: 8000 },
      { nombre: "Kit de café y galletas", precio: 35000 },
      { nombre: "Caja de regalo de café artesanal", precio: 40000 },
      { nombre: "Paquete de galletas surtidas", precio: 18000 }
    ];

    const productosBordados = [
      { nombre: "Camisas bordadas", precio: 80000 },
      { nombre: "Bolsos bordados", precio: 50000 },
      { nombre: "Manteles temáticos bordados", precio: 120000 }
    ];

    const todosLosProductos = [
      ...productosLocal.map(p => ({ ...p, categoria: "Para consumir en el local" })),
      ...productosDomicilio.map(p => ({ ...p, categoria: "Para domicilio" })),
      ...productosBordados.map(p => ({ ...p, categoria: "Bordados disponibles en el local" }))
    ];

    // =====================================================
    // 2. CREAR LA INTERFAZ DEL CHATBOT
    // =====================================================

    const botonChat = document.createElement("button");
    botonChat.id = "chatToggle";
    botonChat.className = "chat-toggle-button";
    botonChat.type = "button";
    botonChat.setAttribute("aria-label", "Abrir asistente de EcoBordado Café");
    botonChat.setAttribute("aria-controls", "chatWindow");
    botonChat.setAttribute("aria-expanded", "false");
    botonChat.innerHTML = `
      <svg
        viewBox="0 0 24 24"
        width="30"
        height="30"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z"/>
      </svg>
    `;

    const ventanaChat = document.createElement("section");
    ventanaChat.id = "chatWindow";
    ventanaChat.className = "chat-window";
    ventanaChat.setAttribute("aria-label", "Chat de EcoBordado Café");
    ventanaChat.setAttribute("aria-hidden", "true");

    ventanaChat.innerHTML = `
      <header class="chat-header">
        <div>
          <strong>EcoBordado Café</strong>
          <div class="chat-status">Asistente virtual · Aquí para ayudarte</div>
        </div>
        <button
          id="chatClose"
          type="button"
          aria-label="Cerrar chat"
          style="background:transparent;border:0;color:inherit;font-size:26px;cursor:pointer;padding:4px 8px;"
        >×</button>
      </header>

      <div
        class="chat-messages"
        id="chatMessages"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      ></div>

      <div class="chat-input-area">
        <input
          type="text"
          id="userInput"
          placeholder="Escribe tu pregunta..."
          aria-label="Escribe tu pregunta"
          maxlength="500"
          autocomplete="off"
        />
        <button id="sendButton" type="button" aria-label="Enviar mensaje">
          Enviar
        </button>
      </div>
    `;

    document.body.appendChild(botonChat);
    document.body.appendChild(ventanaChat);

    const mensajes = document.getElementById("chatMessages");
    const entrada = document.getElementById("userInput");
    const botonEnviar = document.getElementById("sendButton");
    const botonCerrar = document.getElementById("chatClose");

    // =====================================================
    // 3. FUNCIONES AUXILIARES
    // =====================================================

    function normalizar(texto) {
      return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[¿?¡!.,;:()[\]{}"']/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    function formatoPrecio(precio) {
      return "$" + precio.toLocaleString("es-CO") + " COP";
    }

    function agregarMensaje(texto, tipo) {
      const mensaje = document.createElement("div");
      mensaje.className = tipo === "usuario" ? "message user" : "message bot";

      // Usar textContent evita interpretar mensajes como código HTML.
      mensaje.textContent = texto;
      mensajes.appendChild(mensaje);
      mensajes.scrollTop = mensajes.scrollHeight;
    }

    function listarProductos(productos) {
      return productos
        .map(p => `${p.nombre}: ${formatoPrecio(p.precio)}`)
        .join("\n");
    }

    function listarProductosConStock(productos) {
      return productos
        .map(p => `${p.nombre}: ${formatoPrecio(p.precio)}. El catálogo indica 50 unidades.`)
        .join("\n");
    }

    function buscarProducto(texto) {
      const consulta = normalizar(texto);

      // Primero se buscan nombres específicos para evitar respuestas genéricas.
      const encontrados = todosLosProductos
        .filter(producto => {
          const nombre = normalizar(producto.nombre);
          return consulta.includes(nombre) || nombre.includes(consulta);
        })
        .sort((a, b) => normalizar(b.nombre).length - normalizar(a.nombre).length);

      if (encontrados.length > 0) {
        return encontrados[0];
      }

      // Sinónimos útiles para las consultas más habituales.
      const equivalencias = [
        { claves: ["capuchino", "cappuccino"], nombre: "Capuchino preparado" },
        { claves: ["espresso", "expreso"], nombre: "Café espresso" },
        { claves: ["latte", "cafe con leche"], nombre: "Café latte" },
        { claves: ["sandwich", "emparedado"], nombre: "Sándwich artesanal" },
        { claves: ["camisa bordada", "camisas bordadas"], nombre: "Camisas bordadas" },
        { claves: ["bolso bordado", "bolsos bordados"], nombre: "Bolsos bordados" },
        { claves: ["mantel bordado", "manteles bordados"], nombre: "Manteles temáticos bordados" },
        { claves: ["cafe para llevar", "cafe preparado para llevar"], nombre: "Café preparado para llevar" },
        { claves: ["galletas surtidas"], nombre: "Paquete de galletas surtidas" },
        { claves: ["caja de regalo", "regalo de cafe"], nombre: "Caja de regalo de café artesanal" }
      ];

      for (const equivalencia of equivalencias) {
        if (equivalencia.claves.some(clave => consulta.includes(normalizar(clave)))) {
          const producto = todosLosProductos.find(
            p => normalizar(p.nombre) === normalizar(equivalencia.nombre)
          );
          if (producto) return producto;
        }
      }

      return null;
    }

    function contieneAlguna(texto, palabras) {
      return palabras.some(palabra => texto.includes(palabra));
    }

    // =====================================================
    // 4. RESPUESTAS DEL CHATBOT
    // =====================================================

    function encontrarRespuesta(mensajeUsuario) {
      const texto = normalizar(mensajeUsuario);

      if (!texto) {
        return "¡Estoy aquí para ayudarte! Puedes preguntarme por nuestros productos, precios, horarios o servicios.";
      }

      // Saludos.
      if (
        /^(hola|holi|buenas|buenos dias|buenas tardes|buenas noches|hey|saludos)\b/.test(texto)
      ) {
        return "¡Hola! ☕🌿 Te damos la bienvenida a EcoBordado Café. Somos un espacio que combina café, gastronomía, bordados y cultura local. ¿Qué te gustaría conocer?";
      }

      // Ayuda y opciones.
      if (contieneAlguna(texto, ["que puedes hacer", "que sabes", "ayudame", "ayuda", "opciones", "que ofrecen"])) {
        return "Puedo ayudarte con:\n• Productos y precios.\n• Café, panadería y artesanías.\n• Productos para domicilio.\n• Camisas, bolsos y manteles bordados.\n• Formas de pago.\n• Horarios y ubicación.\n• Nuestra historia, misión, visión y valores.\n• Talleres, pedidos y contacto.\n\nEscríbeme tu pregunta y con gusto te ayudo.";
      }

      // Productos exactos antes de categorías generales.
      const producto = buscarProducto(texto);

      if (producto) {
        return `${producto.nombre}\nPrecio publicado: ${formatoPrecio(producto.precio)}.\nCategoría: ${producto.categoria}.\n\nEl catálogo indica 50 unidades disponibles. Para confirmar existencias actuales, te recomendamos comunicarte con el equipo de EcoBordado Café.`;
      }

      // Consultas por precios.
      if (contieneAlguna(texto, ["precio", "precios", "cuanto cuesta", "cuanto vale", "valor de", "tarifa", "cuanto valen"])) {
        if (contieneAlguna(texto, ["bordado", "camisa", "bolso", "mantel", "artesania", "artesanias"])) {
          return "Estos son nuestros productos bordados:\n" + listarProductos(productosBordados);
        }

        if (contieneAlguna(texto, ["domicilio", "envio", "regalo", "llevar", "casa"])) {
          return "Estos son algunos de nuestros productos para domicilio:\n" + listarProductos(productosDomicilio);
        }

        if (contieneAlguna(texto, ["cafe", "bebida", "panaderia", "pan", "galleta", "torta", "chocolate", "sandwich"])) {
          return "Estos son nuestros productos para consumir en el local:\n" + listarProductos(productosLocal) + "\n\nTambién contamos con productos para domicilio y artículos bordados. Pregúntame por cualquiera de ellos.";
        }

        return "¡Claro! Estos son nuestros productos y precios publicados.\n\nPARA CONSUMIR EN EL LOCAL\n" +
          listarProductos(productosLocal) +
          "\n\nPARA DOMICILIO\n" +
          listarProductos(productosDomicilio) +
          "\n\nPRODUCTOS BORDADOS\n" +
          listarProductos(productosBordados);
      }

      // Catálogo y productos para consumir en el local.
      if (contieneAlguna(texto, ["productos del local", "para consumir", "catalogo", "menu", "menú", "que venden", "que productos tienen", "que productos ofrecen", "productos disponibles"])) {
        return "Nuestro catálogo incluye café, bebidas, panadería artesanal y productos bordados.\n\nPARA CONSUMIR EN EL LOCAL\n" +
          listarProductos(productosLocal) +
          "\n\nTambién tenemos productos para domicilio y bordados. Puedes preguntarme por una categoría específica.";
      }

      if (contieneAlguna(texto, ["domicilio", "domicilios", "para llevar", "envios", "envio a casa", "entrega a domicilio"])) {
        return "Estos son los productos de nuestro catálogo para domicilio:\n" +
          listarProductosConStock(productosDomicilio) +
          "\n\nPara confirmar cobertura, costo de entrega y disponibilidad actual, contacta directamente al equipo. No tengo acceso a un sistema de domicilios en tiempo real.";
      }

      if (contieneAlguna(texto, ["bordado", "bordados", "camisas", "bolsos", "manteles", "artesanias", "artesania"])) {
        return "En EcoBordado Café valoramos el trabajo artesanal. Estos son los productos bordados publicados en el catálogo:\n" +
          listarProductosConStock(productosBordados) +
          "\n\nLos bordados celebran la creatividad y la tradición local.";
      }

      if (contieneAlguna(texto, ["cafe", "cafes", "bebidas", "espresso", "latte", "capuchino", "chocolate"])) {
        return "¡Nos encanta el café! ☕ Estos son nuestros productos para disfrutar en el local:\n" +
          listarProductos(productosLocal.filter(p =>
            contieneAlguna(normalizar(p.nombre), ["cafe", "latte", "espresso", "capuchino", "chocolate"])
          )) +
          "\n\nTambién tenemos café artesanal y kits para llevar o regalar.";
      }

      if (contieneAlguna(texto, ["panaderia", "pan", "galletas", "torta", "pastel", "sandwich"])) {
        return "¡Tenemos opciones deliciosas de panadería!\n" +
          listarProductos(productosLocal.filter(p =>
            contieneAlguna(normalizar(p.nombre), ["pan", "galleta", "torta", "sandwich"])
          )) +
          "\n\nPara domicilio también contamos con pan de masa madre, pasteles y diferentes presentaciones de galletas.";
      }

      // Disponibilidad y existencias.
      if (contieneAlguna(texto, ["stock", "existencias", "disponibilidad", "disponible", "unidades", "hay todavia", "queda"])) {
        return "El catálogo de productos indica 50 unidades para cada artículo publicado. Sin embargo, no estoy conectado a un inventario en tiempo real, así que las existencias actuales deben confirmarse con el equipo de EcoBordado Café.";
      }

      // Empresa e historia.
      if (contieneAlguna(texto, ["empresa", "quienes son", "quien eres", "sobre nosotros", "historia", "que es ecobordado", "que es eco bordado"])) {
        return "EcoBordado Café es más que una cafetería: es un espacio que une el café colombiano, la gastronomía y el arte del bordado hecho a mano. Buscamos que cada visita permita disfrutar, aprender, apoyar a los artesanos locales y llevarse un recuerdo con significado. Estamos en Cartago, Valle del Cauca.";
      }

      // Misión.
      if (contieneAlguna(texto, ["mision", "proposito", "objetivo de la empresa"])) {
        return "Nuestra misión es ofrecer experiencias gastronómicas y culturales de calidad, fortalecer el trabajo artesanal, impulsar el turismo sostenible y contribuir al desarrollo de la comunidad.";
      }

      // Visión.
      if (contieneAlguna(texto, ["vision", "futuro de la empresa", "vision 2030"])) {
        return "Nuestra visión es convertirnos, para el año 2030, en un referente de turismo cultural en el Valle del Cauca, destacándonos por la innovación, la sostenibilidad y el apoyo al talento local.";
      }

      // Valores.
      if (contieneAlguna(texto, ["valores", "comunidad", "creatividad", "sostenibilidad", "medio ambiente"])) {
        return "Nuestros valores principales son:\n\n• Comunidad: trabajamos en equipo y apoyamos lo local.\n• Creatividad: transformamos las tradiciones artesanales en experiencias memorables.\n• Sostenibilidad: promovemos decisiones responsables con las personas y el medio ambiente.";
      }

      // Equipo.
      if (contieneAlguna(texto, ["equipo", "gerente", "secretario", "vendedor", "personal", "trabajadores", "quienes trabajan"])) {
        return "Nuestro equipo cumple funciones importantes para mantener la esencia del proyecto:\n\n• Gerente: lidera el proyecto y ayuda a preservar su esencia cultural.\n• Secretario: apoya la organización y las tareas cotidianas.\n• Vendedor - Local y Entregas: contribuye a ofrecer los productos y la atención que necesitan nuestros clientes.\n\nTrabajamos con pasión, compromiso, calidad y tradición.";
      }

      // Pagos.
      if (contieneAlguna(texto, ["pago", "pagos", "nequi", "daviplata", "tarjeta", "efectivo", "transferencia", "transferencias", "factura"])) {
        return "Según la información de nuestro servicio, los medios de pago contemplados son:\n• Efectivo.\n• Tarjetas débito y crédito.\n• Transferencias bancarias.\n• Nequi.\n• Daviplata.\n• Factura electrónica.\n\nTe recomendamos confirmar con el equipo cuáles están habilitados al momento de tu compra.";
      }

      // Ubicación.
      if (contieneAlguna(texto, ["ubicacion", "direccion", "donde quedan", "donde estan", "como llegar", "ciudad"])) {
        return "EcoBordado Café se encuentra en la zona del centro histórico de Cartago, Valle del Cauca, Colombia. No tengo una dirección exacta confirmada en este momento. Puedes solicitarla a través de la página Contacto.";
      }

      // Horarios.
      if (contieneAlguna(texto, ["horario", "horarios", "abren", "abierto", "cierran", "a que hora", "que dias"])) {
        return "El horario publicado de EcoBordado Café es de lunes a sábado, de 8:00 a. m. a 7:00 p. m. Te recomendamos confirmar posibles cambios o festivos con el equipo.";
      }

      // Contacto.
      if (contieneAlguna(texto, ["contacto", "contactar", "telefono", "celular", "correo", "email", "whatsapp", "comunicarme"])) {
        return "Puedes comunicarte con EcoBordado Café mediante el formulario de la página Contacto de nuestro sitio web. Allí podrás enviar tus preguntas sobre productos, pedidos y servicios.";
      }

      // Talleres y cultura.
      if (contieneAlguna(texto, ["taller", "talleres", "aprender a bordar", "bordar", "actividad cultural", "evento", "eventos"])) {
        return "EcoBordado Café promueve talleres de bordado y encuentros culturales para compartir saberes, creatividad y tradición. Para conocer las próximas fechas, cupos y precios, consulta la página Contacto.";
      }

      // Pedidos.
      if (contieneAlguna(texto, ["pedido", "pedidos", "comprar", "compra", "encargar", "reservar", "tienda online"])) {
        return "¡Gracias por tu interés en nuestros productos! Para consultar o gestionar un pedido, comunícate mediante el formulario de la página Contacto. La disponibilidad, las entregas y las condiciones de compra deben confirmarse directamente con el equipo.";
      }

      // Envíos nacionales.
      if (contieneAlguna(texto, ["envio nacional", "envios nacionales", "otras ciudades", "fuera de cartago"])) {
        return "La información del proyecto contempla una futura tienda en línea y envíos nacionales. No puedo confirmar que ese servicio esté activo actualmente; por favor, consulta al equipo mediante la página Contacto.";
      }

      // Sostenibilidad.
      if (contieneAlguna(texto, ["sostenible", "sostenibilidad", "ecologico", "ecologia", "responsable"])) {
        return "La sostenibilidad es uno de nuestros valores. Buscamos apoyar a la comunidad, fortalecer el talento local y promover decisiones responsables con las personas y el medio ambiente.";
      }

      // Despedidas.
      if (contieneAlguna(texto, ["adios", "hasta luego", "chao", "nos vemos", "gracias", "muchas gracias"])) {
        return "¡Gracias por visitar EcoBordado Café! ☕🌿 Será un gusto recibirte. Si necesitas más información sobre nuestros productos o servicios, aquí estaré para ayudarte.";
      }

      // Respuesta predeterminada.
      return "¡Gracias por escribir a EcoBordado Café! ☕🌿 Todavía no tengo una respuesta específica para esa pregunta, pero puedo ayudarte con productos, precios, domicilios, bordados, horarios, ubicación, pagos, talleres e información de nuestra empresa. ¿Qué te gustaría consultar?";
    }

    // =====================================================
    // 5. ENVIAR Y RECIBIR MENSAJES
    // =====================================================

    let esperandoRespuesta = false;

    function enviarMensaje() {
      const texto = entrada.value.trim();

      if (!texto || esperandoRespuesta) return;

      agregarMensaje(texto, "usuario");
      entrada.value = "";
      esperandoRespuesta = true;
      botonEnviar.disabled = true;

      // Mantiene una pequeña pausa para que la conversación sea natural.
      window.setTimeout(() => {
        const respuesta = encontrarRespuesta(texto);
        agregarMensaje(respuesta, "bot");
        esperandoRespuesta = false;
        botonEnviar.disabled = false;
        entrada.focus();
      }, 300);
    }

    function abrirChat() {
      ventanaChat.classList.add("open");
      ventanaChat.setAttribute("aria-hidden", "false");
      botonChat.setAttribute("aria-expanded", "true");
      entrada.focus();
    }

    function cerrarChat() {
      ventanaChat.classList.remove("open");
      ventanaChat.setAttribute("aria-hidden", "true");
      botonChat.setAttribute("aria-expanded", "false");
      botonChat.focus();
    }

    // =====================================================
    // 6. EVENTOS
    // =====================================================

    botonChat.addEventListener("click", () => {
      if (ventanaChat.classList.contains("open")) {
        cerrarChat();
      } else {
        abrirChat();
      }
    });

    botonCerrar.addEventListener("click", cerrarChat);
    botonEnviar.addEventListener("click", enviarMensaje);

    entrada.addEventListener("keydown", evento => {
      if (evento.key === "Enter" && !evento.shiftKey) {
        evento.preventDefault();
        enviarMensaje();
      }
    });

    document.addEventListener("keydown", evento => {
      if (evento.key === "Escape" && ventanaChat.classList.contains("open")) {
        cerrarChat();
      }
    });

    // =====================================================
    // 7. MENSAJE INICIAL
    // =====================================================

    agregarMensaje(
      "¡Hola! 👋 Bienvenido a EcoBordado Café.\n\nSoy tu asistente virtual. Puedo ayudarte con nuestros cafés, productos de panadería, artículos bordados, precios, domicilios y la historia de nuestra empresa.\n\n¿Qué te gustaría saber?",
      "bot"
    );
  }

  // Iniciar cuando el documento esté listo.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarChatbot);
  } else {
    iniciarChatbot();
  }
})();
