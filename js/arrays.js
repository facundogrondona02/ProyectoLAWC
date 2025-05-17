
function filtrarProductosPorNombre() {
    let valor = prompt('Ingrese el nombre de producto a filtrar:')
    valor = valor.trim().toLowerCase()
    
    // Camino Feliz
    // let productosEncontrados = productos.filter((producto)=> producto.nombre === valor )

    // Búsqueda dentro de un texto
    // let productosEncontrados = productos.filter((producto)=> producto.nombre.includes(valor) )

    // Normalizar texto de búsqueda
    let productosEncontrados = productos.filter((producto)=> producto.nombre.toLowerCase().includes(valor) )
}

/*
    {
        id: "1",
        imagen: "🍌",
        nombre: "Bananas",
        precio: 1220,
        categoria: "Fruta"
    }
*/

function mapearProductos() {
    let nuevoArray = productos.map((producto)=> {
        return {
            codigo: producto.id,
            nombre: producto.nombre.toUpperCase(),
            importe: producto.precio
        }
    })
    console.log(nuevoArray)
}

function ordenarProductos() {
    let veces = 0
    productos.sort((a, b)=> { // ordenar por precio
        veces++
        if (a.precio > b.precio) {
            return -1
        }
        if (a.precio < b.precio) {
            return 1
        }
        return 0
    })
    console.log("Veces iteradas:", veces)
    console.table(productos)
}
