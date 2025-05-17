// IMPORTS
import { fetchProducts } from './fetchProducts.js'
import { fetchProductsCategories } from './fetchProductsCategories.js'

// DOM y variables globales
const categorias = []
const carrito = []
const container = document.querySelector('div.card-container')
const buttonCarrito = document.getElementById('btnCarrito')
const  btnCheckout = document.getElementById("btnCheckout")
const btnEliminarCarrito = document.getElementById('btnEliminarCarrito');
const inputSearch = document.querySelector('input#inputSearch')
const filterCategories = document.querySelector('div.categories-filter')
const sidebarCarrito = document.getElementById('sidebarCarrito')
const cerrarCarrito = document.getElementById('cerrarCarrito')
const contenidoCarrito = document.getElementById('contenidoCarrito')
let data = []
let dataCategories = []
let categoriaSeleccion = ""
let arrayDeFiltros = [{ producto: "", categoria: "" }]

// FUNCIONES
function crearCardHTML(producto) {
    return `
    <div class="col">
        <div class="card h-100">
            <div class="card-header text-center">
                <img src="${producto.image}" 
                     class="card-img-top p-3" 
                     alt="${producto.title}" 
                     style="max-height: 200px; object-fit: contain; cursor:pointer"
                     data-bs-toggle="modal" 
                     data-bs-target="#modal-${producto.id}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title" 
                        style="cursor:pointer" 
                        data-bs-toggle="modal" 
                        data-bs-target="#modal-${producto.id}">
                        ${producto.title}
                    </h5>
                    <p class="card-text fw-bold">$${producto.price}</p>
                    <button class="btn btn-success mt-auto buttonComprar" data-codigo="${producto.id}">
                        COMPRAR
                    </button>
                </div>
            </div>
        </div>
    </div>
    `
}

const modalTemplate = (producto) => {
    return `
        <div class="modal fade" id="modal-${producto.id}" tabindex="-1" aria-labelledby="modalLabel-${producto.id}" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalLabel-${producto.id}">${producto.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <img src="${producto.image}" class="img-fluid mb-3 d-block mx-auto" style="width:400px; height: 400px" alt="${producto.title}">
                        <p><strong>Precio:</strong> $${producto.price}</p>
                        <p>${producto.description}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button class="btn btn-primary buttonComprar" data-codigo="${producto.id}">Agregar al carrito</button>
                    </div>
                </div>
            </div>
        </div>
    `
}

function llenarFiltroCategorias(categoria) {
    return `
        <select class="form-select" id="selectCategorias" aria-label="Default select example">
            <option ${categoriaSeleccion === "" ? "selected" : ""}>Seleccione una categoría</option>
            ${categoria.map((cat) => 
                `<option value="${cat}" ${categoriaSeleccion === cat ? "selected" : ""}>${cat}</option>`
            ).join('')}
        </select>
    `
}

function crearCardError() {
    return `<div class="col-12">
                <div class="alert alert-danger text-center" role="alert">
                    <h4 class="alert-heading">Se ha producido un error inesperado ⚠️</h4>
                    <p>No estamos pudiendo cargar el listado de productos para tu compra. Por favor, intenta nuevamente en unos instantes.</p>
                </div>
            </div>`
}

function mostrarToast(mensaje, estilo) {
    ToastIt.now({ style: estilo, message: mensaje, close: true })
}

function agregarEventosClick() {
    const botonesComprar = document.querySelectorAll('button.buttonComprar')
    if (botonesComprar.length > 0) {
        botonesComprar.forEach((boton) => {
            boton.addEventListener('click', () => {
                let productoElegido = data.find((datita) => datita.id == boton.dataset.codigo)
                if (productoElegido !== undefined) {
                    const existente = carrito.find((item) => item.id === productoElegido.id)
                    if (existente) {
                        existente.cantidad += 1
                    } else {
                        carrito.push({ ...productoElegido, cantidad: 1 })
                    }
                    mostrarToast(`'${productoElegido.title}' agregado al carrito`, 'success')
                    guardarCarrito()
                    actualizarSidebarCarrito()
                } else {
                    alert("⛔️ No se pudo agregar el producto al carrito.")
                }
            })
        })
    }
}

function guardarCarrito() {
    if (carrito.length > 0) {
        localStorage.setItem('shoppingKart', JSON.stringify(carrito))
    } else {
        localStorage.removeItem('shoppingKart')
    }
}

function recuperarCarrito() {
    const recuperarCarrito = JSON.parse(localStorage.getItem('shoppingKart'))
    if (Array.isArray(recuperarCarrito)) {
        carrito.push(...recuperarCarrito)
    }
}

function cargarProductos(arrayProductos, categorias) {
    const loader = document.querySelector('.loader')
    if (loader) loader.remove()

    if (categorias.length > 0) {
        filterCategories.innerHTML = llenarFiltroCategorias(categorias)
    }

    if (arrayProductos.length > 0) {
        container.innerHTML = ''
        arrayProductos.forEach((producto) => {
            container.innerHTML += crearCardHTML(producto)
            container.innerHTML += modalTemplate(producto)
        })
        agregarEventosClick()
    } else {
        container.innerHTML = crearCardError()
        console.error("No se pudieron cargar los productos.")
    }
}

function filtrarProductos() {
    let productosFiltrados = data

    if (arrayDeFiltros[0].producto !== "") {
        productosFiltrados = productosFiltrados.filter((producto) =>
            producto.title.toLowerCase().includes(arrayDeFiltros[0].producto)
        )
    }

    if (arrayDeFiltros[0].categoria !== "" && arrayDeFiltros[0].categoria !== "Seleccione una categoría") {
        productosFiltrados = productosFiltrados.filter((producto) =>
            producto.category.toLowerCase().includes(arrayDeFiltros[0].categoria.toLowerCase())
        )
    }

    if (productosFiltrados.length > 0) {
        cargarProductos(productosFiltrados, dataCategories)
    } else {
        mostrarToast(`No se encontró el producto`, 'error')
        cargarProductos(data, dataCategories)
    }
}

function actualizarSidebarCarrito() {
    if (carrito.length === 0) {
        contenidoCarrito.innerHTML = `<p class="text-muted">Tu carrito está vacío.</p>`
        const totalCarrito = document.getElementById('totalCarrito')
        if (totalCarrito) totalCarrito.textContent = 'Total: $0.00'
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

    const totalCarrito = document.getElementById('totalCarrito');
if (totalCarrito) {
    const total = carrito.reduce((sum, item) => sum + (item.price * item.cantidad), 0);
    totalCarrito.textContent = `Total: $${total.toFixed(2)}`;
}
    // Agregar eventos a los botones del carrito después de renderizar
    agregarEventosBotonesCarrito()
}

function agregarEventosBotonesCarrito() {
    // Botones para sumar cantidad
    const botonesSumar = document.querySelectorAll('.btn-sumar')
    botonesSumar.forEach(boton => {
        boton.addEventListener('click', () => {
            const id = boton.dataset.id
            const producto = carrito.find(item => item.id == id)
            if (producto) {
                producto.cantidad++
                guardarCarrito()
                actualizarSidebarCarrito()
            }
        })
    })

    // Botones para restar cantidad
    const botonesRestar = document.querySelectorAll('.btn-restar')
    botonesRestar.forEach(boton => {
        boton.addEventListener('click', () => {
            const id = boton.dataset.id
            const producto = carrito.find(item => item.id == id)
            if (producto && producto.cantidad > 1) {
                producto.cantidad--
                guardarCarrito()
                actualizarSidebarCarrito()
            }
        })
    })

    // Botones para eliminar producto
    const botonesEliminar = document.querySelectorAll('.btn-eliminar')
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', () => {
            const id = boton.dataset.id
            const index = carrito.findIndex(item => item.id == id)
            if (index !== -1) {
                carrito.splice(index, 1)
                guardarCarrito()
                actualizarSidebarCarrito()
            }
        })
    })
}

// EVENTOS
inputSearch.addEventListener('input', (event) => {
    arrayDeFiltros[0].producto = inputSearch.value.trim().toLowerCase()
    filtrarProductos()
})

filterCategories.addEventListener('change', (event) => {
    arrayDeFiltros[0].categoria = event.target.value
    categoriaSeleccion = event.target.value
    filtrarProductos()
})

buttonCarrito.addEventListener('click', () => {
    if (carrito.length > 0) {
        sidebarCarrito.classList.add('show')
        actualizarSidebarCarrito()
    } else {
        mostrarToast('⛔️ Tu carrito está vacío.', 'danger')
    }
})

cerrarCarrito.addEventListener('click', () => {
    sidebarCarrito.classList.remove('show')
})
btnCheckout.addEventListener('click', () => {
    if (carrito.length === 0) {
        mostrarToast('⛔️ Tu carrito está vacío.', 'danger');
        return;
    }
    carrito.length = 0;
    location.href = 'checkout.html';
    mostrarToast('✅ Compra realizada con éxito.', 'success');
});

btnEliminarCarrito.addEventListener('click', () => {
    if (carrito.length === 0) {
        mostrarToast('⛔️ Tu carrito ya está vacío.', 'danger');
        return;
    }
    carrito.length = 0;
    guardarCarrito();
    actualizarSidebarCarrito();
    sidebarCarrito.classList.remove('show');
    mostrarToast('🗑️ Todos los productos fueron eliminados.', 'warning');
});

// FUNCIÓN PRINCIPAL
async function iniciarApp() {
    try {
        dataCategories = await fetchProductsCategories()
        data = await fetchProducts()
        cargarProductos(data, dataCategories)
        recuperarCarrito()
        actualizarSidebarCarrito() // para mostrar carrito si ya hay productos guardados
    } catch (error) {
        console.error('Error iniciando la app:', error)
        container.innerHTML = crearCardError()
    }
}

iniciarApp()
