// Base de datos del menú
let menu = [
    { nombre: "Pollo Grille con Guarnicion (pechuga)", precio: 9000 },
    { nombre: "Pollo Provenzal/Mostaza/Verdeo con Guarnicion", precio: 10500 },
    { nombre: "Costillitas con Guarnicion", precio: 8500 },
    { nombre: "Costillitas Provenzal/Mostaza/Verdeo", precio: 9800 },
    { nombre: "Bife con Guarnicion", precio: 12000 },
    { nombre: "Bife a caballo con Guarnicion", precio: 14000 },
    { nombre: "Bondiola con Guarnicion", precio: 9000 },
    { nombre: "Milanesa Ternera con Guarnicion", precio: 9500 },
    { nombre: "Milanesa Pollo con Guarnicion", precio: 8500 },
    { nombre: "Suprema con Guarnicion", precio: 9500 },
    { nombre: "Milanesa Napo Carne con Guarnicion", precio: 14000 },
    { nombre: "Milanesa Napo Pollo con Guarnicion", precio: 12000 },
    { nombre: "Milanesa Grande p/2 Napo con Guarnicion", precio: 22000 },
    { nombre: "Milanesa de carne a la Pizza con Guarnicion", precio: 12000 },
    { nombre: "Tallarin Bolognesa", precio: 5000 },
    { nombre: "Tallarin Estofado", precio: 7500 },
    { nombre: "tallarin / arroz tuco", precio: 4500 },
    { nombre: "Raviol Bolognesa", precio: 8500 },
    { nombre: "Raviol Estofado", precio: 10500 },
    { nombre: "Arroz Bolognesa", precio: 5000 },
    { nombre: "Canelones Salsa Mixta", precio: 7000 },
    { nombre: "Canelones Bolognesa", precio: 9000 },
    { nombre: "Canelones Estofado", precio: 11000 },
    { nombre: "Porcion Ensalada", precio: 5000 },
    { nombre: "Porcion Frita/Pure Mixto/Ens Mixta", precio: 5000 },
    { nombre: "Guarnicion Frita/ensl", precio: 4000 },
    { nombre: "Porcion Arroz/Tallarines", precio: 3500 },
    { nombre: "Sandwich Mila Solo", precio: 5000 },
    { nombre: "Sandwich Mila Pollo con Fritas", precio: 8000 },
    { nombre: "Empanada", precio: 1200 },
    { nombre: "Empanadas Doc", precio: 14400 },
    { nombre: "Sandwich de Mila de Pollo Solo", precio: 6000 },
    { nombre: "Sandwich Mila y Fritas", precio: 6500 },
    { nombre: "Tortilla Papa", precio: 6000 },
    { nombre: "Tortilla Ensalada", precio: 7500 },
    { nombre: "Omelette Ensalada", precio: 8000 },
    { nombre: "Bebida chica", precio: 2000 },
    { nombre: "Bebida grande", precio: 4000 },
    { nombre: "Vino 1/4", precio: 3000 },
    { nombre: "Vino 1/2", precio: 4000 },
    { nombre: "Soda", precio: 1500 },
    { nombre: "Filet con guarnicion", precio: 8500 }

];

// Cargar menú desde localStorage si existe
if(localStorage.getItem('menu')) {
    menu = JSON.parse(localStorage.getItem('menu'));
}

let pedidoActual = [];
let historialPedidos = [];
let transferenciaActiva = false;

let extra = 0;

const PASSWORD = "bar"; // Contraseña para acceder a configuración

// Elementos del DOM
const buscarPlatoInput = document.getElementById('buscarPlato');
const sugerenciasDiv = document.getElementById('sugerencias');
const listaPedidos = document.getElementById('listaPedidos');
const totalSpan = document.getElementById('total');
const nuevoPedidoBtn = document.getElementById('nuevoPedido');
const verHistorialBtn = document.getElementById('verHistorial');
const historyContainer = document.getElementById('historyContainer');
const historyItems = document.getElementById('historyItems');
const transferenciaToggle = document.getElementById('transferenciaToggle');
const configBtn = document.getElementById('configBtn');
const configContainer = document.getElementById('configContainer');
const menuConfigItems = document.getElementById('menuConfigItems');
const addMenuItem = document.getElementById('addMenuItem');
const saveMenu = document.getElementById('saveMenu');
const passwordModal = document.getElementById('passwordModal');
const passwordInput = document.getElementById('passwordInput');
const submitPassword = document.getElementById('submitPassword');
const cancelPassword = document.getElementById('cancelPassword');
const volverInicio = document.getElementById('volverInicio');

// Función para formatear precios
function formatearPrecio(precio) {
    return precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Evento de búsqueda
buscarPlatoInput.addEventListener('input', function() {
    const texto = this.value.toLowerCase();
    if(texto.length < 2) {
        sugerenciasDiv.style.display = 'none';
        return;
    }
    
    const sugerencias = menu.filter(item => 
        item.nombre.toLowerCase().includes(texto)
    );
    
    mostrarSugerencias(sugerencias);
});

// Mostrar sugerencias
function mostrarSugerencias(sugerencias) {
    if(sugerencias.length === 0) {
        sugerenciasDiv.style.display = 'none';
        return;
    }
    
    sugerenciasDiv.innerHTML = '';
    sugerencias.forEach(item => {
        const elemento = document.createElement('button');
        elemento.className = 'list-group-item list-group-item-action';
        elemento.innerHTML = `
            <span>${item.nombre}</span>
            <span class="badge">$${formatearPrecio(item.precio)}</span>
        `;
        elemento.addEventListener('click', () => agregarAlPedido(item));
        sugerenciasDiv.appendChild(elemento);
    });
    
    sugerenciasDiv.style.display = 'block';
}

// Agregar item al pedido
function agregarAlPedido(item) {
    // Verificar si el item ya está en el pedido
    const itemExistente = pedidoActual.find(p => p.nombre === item.nombre);
    
    if(itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        pedidoActual.push({
            ...item,
            cantidad: 1
        });
    }
    
    actualizarListaPedidos();
    buscarPlatoInput.value = '';
    sugerenciasDiv.style.display = 'none';
    buscarPlatoInput.focus();
}

// Calcular total con transferencia
function calcularTotal() {
    let total = pedidoActual.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    if(transferenciaActiva) {
        total *= 1.05; // Añadir 5% por transferencia
    }
    
    return total + extra;
}

// Actualizar lista de pedidos
function actualizarListaPedidos() {
    listaPedidos.innerHTML = '';
    const total = calcularTotal();
    
    pedidoActual.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <span>${item.nombre}</span>
                    <span class="precio-unitario">$${formatearPrecio(item.precio)}</span>
                </div>
                <div class="d-flex align-items-center">
                    <div class="contador me-2">
                        <button class="btn btn-sm btn-outline-secondary decrementar" data-index="${index}" ${item.cantidad <= 1 ? 'disabled' : ''}>-</button>
                        <span class="mx-2">${item.cantidad}</span>
                        <button class="btn btn-sm btn-outline-secondary incrementar" data-index="${index}">+</button>
                    </div>
                    <span class="subtotal">$${formatearPrecio(subtotal)}</span>
                    <span class="delete-item" data-index="${index}">✕</span>
                </div>
            </div>
        `;
        listaPedidos.appendChild(li);
    });
    
    // Eventos para los botones de incrementar/decrementar
    document.querySelectorAll('.incrementar').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            pedidoActual[index].cantidad += 1;
            actualizarListaPedidos();
        });
    });
    
    document.querySelectorAll('.decrementar').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            if(pedidoActual[index].cantidad > 1) {
                pedidoActual[index].cantidad -= 1;
                actualizarListaPedidos();
            }
        });
    });
    
    // Eventos para eliminar
    document.querySelectorAll('.delete-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            pedidoActual.splice(index, 1);
            actualizarListaPedidos();
        });
    });
    
    totalSpan.textContent = formatearPrecio(total);
    // Actualizar contador de ítems en el header
    document.querySelector('.card-header .badge').textContent = `${pedidoActual.length} ítems`;
}

// Nuevo pedido
nuevoPedidoBtn.addEventListener('click', function() {
    if(pedidoActual.length > 0 || extra > 0) {
        if(confirm('¿Estás seguro de iniciar un nuevo pedido? Se perderán todos los ítems actuales y el extra.')) {
            guardarEnHistorial();
            pedidoActual = [];
            extra = 0;
            document.getElementById('extraInput').value = '';
            transferenciaActiva = false;
            transferenciaToggle.checked = false;
            actualizarListaPedidos();
        }
    }
});

// Guardar pedido en el historial
function guardarEnHistorial() {
    if(pedidoActual.length === 0 && extra === 0) return;
    
    const total = calcularTotal();
    const nuevoPedido = {
        fecha: new Date().toLocaleString(),
        items: [...pedidoActual],
        extra: extra,
        total: total,
        transferencia: transferenciaActiva
    };
    
    historialPedidos.unshift(nuevoPedido);
    historialPedidos = historialPedidos.slice(0, 4);
    
    actualizarHistorial();
}


// Actualizar vista del historial
function actualizarHistorial() {
    historyItems.innerHTML = '';
    
    if(historialPedidos.length === 0) {
        historyItems.innerHTML = '<p>No hay pedidos recientes</p>';
        return;
    }
    
    historialPedidos.forEach((pedido, index) => {
        const pedidoElement = document.createElement('div');
        pedidoElement.className = 'history-item';
        
        let itemsHtml = '';
        pedido.items.forEach(item => {
            itemsHtml += `
                <div class="d-flex justify-content-between">
                    <span>${item.nombre} x${item.cantidad}</span>
                    <span>$${formatearPrecio(item.precio * item.cantidad)}</span>
                </div>
            `;
        });
        
        if(pedido.extra > 0) {
            itemsHtml += `
                <div class="d-flex justify-content-between">
                    <span>Extra</span>
                    <span>$${formatearPrecio(pedido.extra)}</span>
                </div>
            `;
        }
        
        pedidoElement.innerHTML = `
            <div class="d-flex justify-content-between mb-2">
                <strong>Pedido ${index + 1}</strong>
                <small>${pedido.fecha}</small>
            </div>
            ${itemsHtml}
            ${pedido.transferencia ? '<div class="text-warning"><small>Pago por transferencia (+5%)</small></div>' : ''}
            <div class="d-flex justify-content-between mt-2 pt-2 border-top">
                <strong>Total:</strong>
                <strong>$${formatearPrecio(pedido.total)}</strong>
            </div>
        `;
        
        historyItems.appendChild(pedidoElement);
    });
}


// Toggle del historial
verHistorialBtn.addEventListener('click', function() {
    historyContainer.classList.toggle('show');
    this.textContent = historyContainer.classList.contains('show') ? 'Ocultar Historial' : 'Historial';
});

// Toggle transferencia
transferenciaToggle.addEventListener('change', function() {
    transferenciaActiva = this.checked;
    actualizarListaPedidos();
});

// Mostrar modal de contraseña para configuración
configBtn.addEventListener('click', function() {
    passwordModal.style.display = 'flex';
    passwordInput.focus();
});

// Cancelar ingreso de contraseña
cancelPassword.addEventListener('click', function() {
    passwordModal.style.display = 'none';
    passwordInput.value = '';
});

// Verificar contraseña
submitPassword.addEventListener('click', function() {
    if(passwordInput.value === PASSWORD) {
        passwordModal.style.display = 'none';
        passwordInput.value = '';
        configContainer.classList.toggle('show');
        if(configContainer.classList.contains('show')) {
            cargarConfiguracionMenu();
        }
    } else {
        alert('Contraseña incorrecta');
        passwordInput.value = '';
        passwordInput.focus();
    }
});

// Cargar configuración del menú
function cargarConfiguracionMenu() {
    menuConfigItems.innerHTML = '';
    
    menu.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'menu-item-config d-flex gap-2';
        itemElement.innerHTML = `
            <input type="text" class="form-control form-control-sm nombre-item" value="${item.nombre}" placeholder="Nombre del plato">
            <input type="number" class="form-control form-control-sm precio-item" value="${item.precio}" placeholder="Precio" step="100" min="0">
            <button class="btn btn-sm btn-outline-danger delete-menu-item" data-index="${index}">
                <i class="bi bi-trash"></i>
            </button>
        `;
        menuConfigItems.appendChild(itemElement);
    });
}

// Agregar nuevo item al menú
addMenuItem.addEventListener('click', function() {
    const itemElement = document.createElement('div');
    itemElement.className = 'menu-item-config d-flex gap-2';
    itemElement.innerHTML = `
        <input type="text" class="form-control form-control-sm nombre-item" placeholder="Nombre del plato">
        <input type="number" class="form-control form-control-sm precio-item" placeholder="Precio" step="100" min="0">
        <button class="btn btn-sm btn-outline-danger delete-menu-item">
            <i class="bi bi-trash"></i>
        </button>
    `;
    menuConfigItems.appendChild(itemElement);
});

// Eliminar item del menú
menuConfigItems.addEventListener('click', function(e) {
    if(e.target.classList.contains('delete-menu-item') || e.target.parentElement.classList.contains('delete-menu-item')) {
        const button = e.target.classList.contains('delete-menu-item') ? e.target : e.target.parentElement;
        const itemElement = button.closest('.menu-item-config');
        itemElement.remove();
    }
});

// Guardar menú
saveMenu.addEventListener('click', function() {
    const nuevosItems = [];
    const inputs = menuConfigItems.querySelectorAll('.menu-item-config');
    
    inputs.forEach(item => {
        const nombre = item.querySelector('.nombre-item').value;
        const precio = parseFloat(item.querySelector('.precio-item').value);
        
        if(nombre && !isNaN(precio) && precio > 0) {
            nuevosItems.push({
                nombre: nombre,
                precio: precio
            });
        }
    });
    
    if(nuevosItems.length > 0) {
        menu = nuevosItems;
        localStorage.setItem('menu', JSON.stringify(menu));
        alert('Menú guardado correctamente');
        configContainer.classList.remove('show');
    } else {
        alert('Error: El menú no puede estar vacío');
    }
});

// Volver al inicio desde configuración
volverInicio.addEventListener('click', function() {
    configContainer.classList.remove('show');
});

document.getElementById('extraInput').addEventListener('input', function() {
    const value = parseFloat(this.value) || 0;
    extra = value;
    actualizarListaPedidos();
});











// Inicializar
actualizarListaPedidos();
actualizarHistorial();