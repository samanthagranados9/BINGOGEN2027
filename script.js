// Lista de productos extraída del menú original
const productos = [
  { id: 1, nombre: "Arroz con pollo + refresco", precio: 2500 },
  { id: 2, nombre: "Empanadas arregladas", precio: 1500 },
  { id: 3, nombre: "Entero de arroz con pollo", precio: 4000 },
  { id: 4, nombre: "Frijoles blancos + arroz + refresco", precio: 2500 },
  { id: 5, nombre: "Gallo de salchichón + refresco", precio: 1000 },
  { id: 6, nombre: "Medio de picadillo", precio: 2500 },
  { id: 7, nombre: "Picadillo de arracache + refresco", precio: 1000 },
  { id: 8, nombre: "Picadillo de papa + refresco", precio: 1000 },
  { id: 9, nombre: "Tamal + café", precio: 1500 },
  { id: 10, nombre: "Alfajores", precio: 500 },
  { id: 11, nombre: "Arroz con leche", precio: 500 },
  { id: 12, nombre: "Donas + refresco", precio: 1000 },
  { id: 13, nombre: "Agua dulce", precio: 500 },
  { id: 14, nombre: "Café con refill", precio: 500 },
  { id: 15, nombre: "Té frío", precio: 500 },
  { id: 16, nombre: "Churchill", precio: 2500 },
  { id: 17, nombre: "Granizado", precio: 2000 }
];

// Objeto para llevar el control de cantidades
let cantidades = {};

// Cargar menú en la página HTML
function cargarMenu() {
  const container = document.getElementById('menu-container');
  container.innerHTML = '';

  productos.forEach(p => {
    cantidades[p.id] = 0;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'menu-item';
    itemDiv.innerHTML = `
      <div class="item-info">
        <div class="item-name">${p.nombre}</div>
        <div class="item-price">₡${p.precio.toLocaleString('es-CR')}</div>
      </div>
      <div class="controls">
        <button class="btn-qty" onclick="cambiarCant(${p.id}, -1)">-</button>
        <input type="number" id="cant-${p.id}" class="qty-input" value="0" min="0" readonly>
        <button class="btn-qty" onclick="cambiarCant(${p.id}, 1)">+</button>
      </div>
      <div class="subtotal" id="sub-${p.id}">₡0</div>
    `;
    container.appendChild(itemDiv);
  });
}

// Cambiar la cantidad del producto
function cambiarCant(id, cambio) {
  let actual = cantidades[id] + cambio;
  if (actual < 0) actual = 0;
  
  cantidades[id] = actual;
  document.getElementById(`cant-${id}`).value = actual;

  const prod = productos.find(p => p.id === id);
  const subtotal = actual * prod.precio;
  document.getElementById(`sub-${id}`).innerText = `₡${subtotal.toLocaleString('es-CR')}`;

  calcularTotal();
}

// Calcular Total General
function calcularTotal() {
  let total = 0;
  productos.forEach(p => {
    total += cantidades[p.id] * p.precio;
  });
  document.getElementById('total-monto').innerText = `₡${total.toLocaleString('es-CR')}`;
}

// Mostrar/Ocultar información de SINPE
function togglePago() {
  const metodo = document.querySelector('input[name="pago"]:checked').value;
  const sinpeInfo = document.getElementById('sinpe-info');
  if (metodo === 'sinpe') {
    sinpeInfo.classList.remove('hidden');
  } else {
    sinpeInfo.classList.add('hidden');
  }
}

// Enviar el pedido listo por WhatsApp
function enviarWhatsApp() {
  const metodo = document.querySelector('input[name="pago"]:checked').value;
  let itemsSeleccionados = [];
  let total = 0;

  productos.forEach(p => {
    const cant = cantidades[p.id];
    if (cant > 0) {
      const sub = cant * p.precio;
      total += sub;
      itemsSeleccionados.push(`• ${cant}x ${p.nombre} (₡${sub.toLocaleString('es-CR')})`);
    }
  });

  if (itemsSeleccionados.length === 0) {
    alert('Por favor selecciona al menos un producto.');
    return;
  }

  let texto = `*NUEVO PEDIDO - BINGO GEN27*\n\n`;
  texto += itemsSeleccionados.join('\n');
  texto += `\n\n*Total a pagar:* ₡${total.toLocaleString('es-CR')}`;
  texto += `\n*Método de Pago:* ${metodo === 'sinpe' ? 'SINPE Móvil' : 'Efectivo'}`;

  if (metodo === 'sinpe') {
    texto += `\n\n*Datos SINPE:*`;
    texto += `\nNúmero: 8362-4868`;
    texto += `\nA nombre de: Laura Jiménez`;
    texto += `\n*(Adjuntaré el comprobante)*`;
  }

  // Número de envío de comprobante: 7279-8825
  const url = `https://wa.me/50672798825?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
}

// Inicializar menú al cargar la página
cargarMenu();