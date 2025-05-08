// IMPORTS
import { fetchProducts } from './fetchProducts.js'
import { fetchProductsCategories } from './fetchProductsCategories.js'

// DOM: enlaces y variables globales
const categorias = []
const carrito = []
const container = document.querySelector('div.card-container')
const buttonCarrito = document.querySelector('img[alt="Carrito"]')
const inputSearch = document.querySelector('input#inputSearch')
const filterCategories = document.querySelector('div.categories-filter')
let data = [] // importante definirla arriba
let dataCategories = [] // importante definirla arriba
let categoriaSeleccion = ""

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
        

    `
}


const modalTemplate = (producto) => {
  return   `
            <!-- Modal -->
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
    </div>
    `
}
function llenarFiltroCategorias(categoria) {
    return (
        `
        <select class="form-select" id="selectCategorias" aria-label="Default select example">
            <option ${categoriaSeleccion === "" ? "selected" : ""}>Seleccione una categoría</option>
            ${categoria.map((cat) => 
                `<option value="${cat}" ${categoriaSeleccion === cat ? "selected" : ""}>${cat}</option>`
            ).join('')}
        </select>
        `
    )
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

function cargarProductos(arrayProductos, categorias) {
    const loader = document.querySelector('.loader')
    if (loader) loader.remove() 

        console.log(categorias, "categorias")
         
        if(categorias.length > 0) {
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

// EVENTOS
inputSearch.addEventListener('search', () => {
    let valor = inputSearch.value.trim().toLowerCase()
    let productosEncontrados = data.filter((producto) =>
        producto.title.toLowerCase().includes(valor)
    )

    if (productosEncontrados.length > 0) {
        cargarProductos(productosEncontrados, dataCategories)
    } else {
        alert('🔎 No se encontraron coincidencias.')
    }
})


filterCategories.addEventListener('change', (event) => {
    const categoriaSeleccionada = event.target.value;
    console.log("Categoría seleccionada:", categoriaSeleccionada);

    categoriaSeleccion = categoriaSeleccionada // Guardar la categoría seleccionada para usarla en el filtro de búsqueda
    console.log("Categoría seleccion:", categoriaSeleccion);
    let productosEncontrados = data.filter((producto) =>
        producto.category.toLowerCase().includes(categoriaSeleccionada.toLowerCase())
    )
    if (productosEncontrados.length > 0) {
        cargarProductos(productosEncontrados, dataCategories)
    } else {
        alert('🔎 No se encontraron coincidencias.')
    }

    // Acá podés filtrar productos o hacer lo que necesites con la categoría
});

// FUNCIÓN PRINCIPAL
async function iniciarApp() {
    try {
        dataCategories= await fetchProductsCategories()
        data = await fetchProducts()
        cargarProductos(data, dataCategories)
        recuperarCarrito()
    } catch (error) {
        console.error('Error iniciando la app:', error)
        container.innerHTML = crearCardError()
    }
}

iniciarApp()
