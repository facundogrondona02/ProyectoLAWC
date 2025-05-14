// IMPORTS
import { fetchProducts } from './fetchProducts.js'
// DOM: enlaces y variables globales
const categorias = []
const carrito = []

const container = document.querySelector('div.card-container')
/*
const buttonCarrito = document.querySelector('div.shoping-cart')
*/
const buttonCarrito = document.getElementById('btnCarrito') //id del HTML

const inputSearch = document.querySelector('input#inputSearch')
const seccionCategorias = document.querySelector('article.categories')
const sidebarCarrito = document.getElementById('sidebarCarrito')
const cerrarCarrito = document.getElementById('cerrarCarrito')
const contenidoCarrito = document.getElementById('contenidoCarrito')


// LÓGICA
function crearCardHTML(producto) {
    return `<div class="card">
                <img class="product-image" src=${producto.image}></img>
                <div class="product-name">${producto.title}</div>
                <div class="product-price">$ ${producto.price}</div>
                <div class="buy-button"><button id="buttonComprar" data-codigo="${producto.id}">COMPRAR</button></div>
            </div>`
}

function crearCardError() {
    return `<div class="card-error">
                <div class="error-title">
                    <h3>Se ha producido un error inesperado.</h3>
                    <div class="emoji-error">🔌</div>
                    <h4>Por favor, intenta acceder nuevamente en unos instantes.</h4>
                    <p>No estamos pudiendo cargar el listado de productos para tu compra.</p>
                    <div class="emoji-error">
                        <span>🥑</span>
                        <span>🍉</span>
                        <span>🍋‍🟩</span>
                        <span>🍏</span>
                    </div>
                </div>
            </div>`
}

function mostrarToast(mensaje, estilo) {
    ToastIt.now({
        style: estilo,
        message: mensaje,
        close: true,
    })
}
function agregarEventosClick() {
    const botonesComprar = document.querySelectorAll('button#buttonComprar')

    if (botonesComprar.length > 0) {
        botonesComprar.forEach((boton) => {
            boton.addEventListener('click', () => {
                const productoElegido = data.find((prod) => prod.id == boton.dataset.codigo)

                if (productoElegido !== undefined) {
                    const existente = carrito.find((item) => item.id === productoElegido.id)

                    if (existente) {
                        existente.cantidad += 1
                    } else {
                        carrito.push({ ...productoElegido, cantidad: 1 })
                    }

                    mostrarToast(`'${productoElegido.title}' agregado al carrito`, 'success')
                    guardarCarrito()
                    actualizarSidebarCarrito() // esta función la vamos a crear más adelante para mostrar el carrito
                } else {
                    alert("⛔️ No se pudo agregar el producto al carrito.")
                }
            })
        })
    }
}


function guardarCarrito() {
    if (carrito.length > 0) {
        let kart = JSON.stringify(carrito)
        localStorage.setItem('shoppingKart', kart)
    }
}

function recuperarCarrito() {
    const recuperarCarrito = JSON.parse(localStorage.getItem('shoppingKart'))

    if (Array.isArray(recuperarCarrito)) {
        carrito.push(...recuperarCarrito)
    }
}

function cargarProductos(arrayProductos) {
    if (arrayProductos.length > 0) {
        container.innerHTML = ''
        arrayProductos.forEach((producto) => {
            container.innerHTML += crearCardHTML(producto)
        })
        agregarEventosClick()
    } else {
        container.innerHTML = crearCardError()
        console.error("No se pudieron cargar los productos.")
    }
}

// EVENTOS
buttonCarrito.addEventListener('click', () => {
    if (carrito.length > 0) {
        sidebarCarrito.classList.add('show');
        actualizarSidebarCarrito(); // actualiza el contenido al abrir
    } else {
        mostrarToast('⛔️ Tu carrito está vacío.', 'danger');
    }
});

cerrarCarrito.addEventListener('click', () => {
    sidebarCarrito.classList.remove('show');
});


inputSearch.addEventListener('search', () => {
    let valor = inputSearch.value.trim().toLowerCase()
    let productosEncontrados = productos.filter((producto) => producto.nombre.toLowerCase().includes(valor))

    if (productosEncontrados.length > 0) {
        cargarProductos(productosEncontrados)
    } else {
        alert('🔎 No se encontraron coincidencias.')
    }
})

function actualizarSidebarCarrito() {
    if (carrito.length === 0) {
        contenidoCarrito.innerHTML = `<p class="text-muted">Tu carrito está vacío.</p>`
        return
    }

    contenidoCarrito.innerHTML = carrito.map(item => `
        <div class="item-carrito mb-3 border-bottom pb-3 d-flex align-items-center">
            <img src="${item.image}" alt="${item.title}" width="50" height="50" class="me-2">
            <div class="flex-grow-1">
                <strong>${item.title}</strong>
                <div class="d-flex align-items-center mt-1">
                    <button class="btn btn-sm btn-outline-secondary btn-restar" data-id="${item.id}" ${item.cantidad === 1 ? 'disabled' : ''}>-</button>
                    <span class="mx-2">${item.cantidad}</span>
                    <button class="btn btn-sm btn-outline-secondary btn-sumar" data-id="${item.id}">+</button>
                    <button class="btn btn-sm btn-danger ms-3 btn-eliminar" data-id="${item.id}">Eliminar</button>
                </div>
                <div class="mt-1 text-muted">$${(item.price * item.cantidad).toFixed(2)}</div>
            </div>
        </div>
    `).join('')

    // Asignar eventos a botones
    document.querySelectorAll('.btn-restar').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id)
            const producto = carrito.find(p => p.id === id)
            if (producto && producto.cantidad > 1) {
                producto.cantidad--
                guardarCarrito()
                actualizarSidebarCarrito()
            }
        })
    })

    document.querySelectorAll('.btn-sumar').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id)
            const producto = carrito.find(p => p.id === id)
            if (producto) {
                producto.cantidad++
                guardarCarrito()
                actualizarSidebarCarrito()
            }
        })
    })

    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id)
            const index = carrito.findIndex(p => p.id === id)
            if (index !== -1) {
                carrito.splice(index, 1)
                guardarCarrito()
                actualizarSidebarCarrito()
            }
        })
    })
}


let data = []; // importante definirla arriba

async function iniciarApp() {
    try {
        data = await fetchProducts();
        cargarProductos(data);
        recuperarCarrito();
    } catch (error) {
        console.error('Error iniciando la app:', error);
        container.innerHTML = crearCardError();
    }
}

iniciarApp();