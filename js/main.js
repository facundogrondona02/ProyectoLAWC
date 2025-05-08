// IMPORTS
import { fetchProducts } from './fetchProducts.js'

// DOM: enlaces y variables globales
const categorias = []
const carrito = []
const container = document.querySelector('div.card-container')
const buttonCarrito = document.querySelector('img[alt="Carrito"]')
const inputSearch = document.querySelector('input#inputSearch')

let data = [] // importante definirla arriba

// LÓGICA
function crearCardHTML(producto) {
    return `<div class="col">
                <div class="card h-100">
                    <img src="${producto.image}" class="card-img-top p-3" alt="${producto.title}" style="max-height: 200px; object-fit: contain;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${producto.title}</h5>
                        <p class="card-text fw-bold">$${producto.price}</p>
                        <button class="btn btn-success mt-auto buttonComprar" data-codigo="${producto.id}">COMPRAR</button>
                    </div>
                </div>
            </div>`
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
    ToastIt.now({
        style: estilo,
        message: mensaje,
        close: true,
    })
}

function agregarEventosClick() {
    const botonesComprar = document.querySelectorAll('button.buttonComprar')
    if (botonesComprar.length > 0) {
        botonesComprar.forEach((boton) => {
            boton.addEventListener('click', () => {
                let productoElegido = data.find((datita) => datita.id == boton.dataset.codigo)
                if (productoElegido !== undefined) {
                    carrito.push(productoElegido)
                    mostrarToast(`'${productoElegido.title}' agregado al carrito`, 'success')
                    guardarCarrito()
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
    }
}

function recuperarCarrito() {
    const recuperarCarrito = JSON.parse(localStorage.getItem('shoppingKart'))
    if (Array.isArray(recuperarCarrito)) {
        carrito.push(...recuperarCarrito)
    }
}

function cargarProductos(arrayProductos) {
    const loader = document.querySelector('.loader')
    if (loader) loader.remove()

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
inputSearch.addEventListener('search', () => {
    let valor = inputSearch.value.trim().toLowerCase()
    let productosEncontrados = data.filter((producto) =>
        producto.title.toLowerCase().includes(valor)
    )

    if (productosEncontrados.length > 0) {
        cargarProductos(productosEncontrados)
    } else {
        alert('🔎 No se encontraron coincidencias.')
    }
})

// FUNCIÓN PRINCIPAL
async function iniciarApp() {
    try {
        data = await fetchProducts()
        cargarProductos(data)
        recuperarCarrito()
    } catch (error) {
        console.error('Error iniciando la app:', error)
        container.innerHTML = crearCardError()
    }
}

iniciarApp()
