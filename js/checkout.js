// VARIABLES
const carrito = [];

const precioTotal = document.querySelector("table tfoot td#totalPrice span");
const btnComprar = document.querySelector("button#btnBuy");
const btnRetornar = document.querySelector("button#btnReturn");
const tableBody = document.querySelector("table tbody#tableBody");
const btnDelete = document.querySelector("#btnDel");



// LÓGICA
function recuperarCarrito() {
    const recuperarCarrito = JSON.parse(localStorage.getItem("shoppingKart"));

    if (Array.isArray(recuperarCarrito)) {
        carrito.push(...recuperarCarrito);
    }
}

function calcularTotalCarrito() {
    // if (carrito.length > 0) {
        precioTotal.textContent =
            carrito.reduce((acc, prod) => acc + prod.price, 0).toFixed(2) || 0.0;
    // }
}


function crearFilaCarrito(prod) {
    return `<tr>
                <td id="pImagen"><img class="img-carrito" src=${prod.image}> </img></td>
                <td id="nombre">${prod.title}</td>
                <td id="price">$ ${prod.price.toFixed(2)}</td>
                <td id="delButton" 
                    data-codigo="${prod.id}"
                    title="Click para eliminar">
                       <button id="btnDel" onclick="eliminarProducto('${prod.id}')">
                        ⛔️
                       </button>
                </td>
            </tr>`;
}
const eliminarProducto = (codigo) => {
    console.log(codigo)
    console.log(carrito[0].id);
    const index = carrito.findIndex((prod) => prod.id == codigo);
    console.log(index);
    const res = confirm("Estas seguro que deseas eliminar el producto?","Si", "No");
    if(res){
        if (index !== -1) {
            carrito.splice(index, 1);
            localStorage.setItem("shoppingKart", JSON.stringify(carrito));
            tableBody.innerHTML = "";
            mostrarCarrito();
        }
    }

    calcularTotalCarrito();

};
function mostrarCarrito() {
    if (carrito.length > 0) {
        tableBody.innerHTML = "";
        carrito.forEach((prod) => {
            tableBody.innerHTML += crearFilaCarrito(prod);
        });
        calcularTotalCarrito();
        btnComprar.removeAttribute("disabled");
    }
}

// FUNCIÓN PRINCIPAL
recuperarCarrito();
mostrarCarrito();

// EVENTOS
btnRetornar.addEventListener("click", () => (location.href = "index.html"));

btnComprar.addEventListener("click", () => {
    alert("🛍️ Compra finalizada. Muchas gracias!");
    localStorage.removeItem("shoppingKart");
    carrito.length = 0;
    setTimeout(() => btnRetornar.click(), 2500);
});


