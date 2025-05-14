// VARIABLES
let carrito = [];

const precioTotal = document.querySelector("table tfoot td#totalPrice span");
const btnComprar = document.querySelector("button#btnBuy");
const btnRetornar = document.querySelector("button#btnReturn");
const tableBody = document.querySelector("table tbody#tableBody");
const btnDelete = document.querySelector("#btnDel");



// LÓGICA
function recuperarCarrito() {
    const datos = JSON.parse(localStorage.getItem("shoppingKart"));
    if (Array.isArray(datos)) {
        carrito = datos;
    }
}

function calcularTotalCarrito() {
    // if (carrito.length > 0) {
        const total = carrito.reduce((acc, prod) => acc + prod.price * prod.cantidad, 0);
        precioTotal.textContent = total.toFixed(2);   carrito.reduce((acc, prod) => acc + prod.price, 0).toFixed(2) || 0.0;
    // }
}


function crearFilaCarrito(prod, index) {
    return `
        <tr>
            <td><img class="img-carrito" src="${prod.image}" alt="${prod.title}" width="40"></td>
            <td>${prod.title}</td>
            <td>$${(prod.price * prod.cantidad).toFixed(2)} (${prod.cantidad} x $${prod.price})</td>
            <td>
                <button class="btnEliminar" data-index="${index}" title="Quitar producto">⛔️</button>
            </td>
        </tr>
    `;
}
function agregarEventosEliminar() {
    const botonesEliminar = document.querySelectorAll(".btnEliminar");
    botonesEliminar.forEach(btn => {
        btn.addEventListener("click", () => {
            const index = parseInt(btn.getAttribute("data-index"));
            const confirmacion = confirm("¿Estás seguro de que querés eliminar este producto?");
            if (confirmacion) {
                carrito.splice(index, 1);
                localStorage.setItem("shoppingKart", JSON.stringify(carrito));
                mostrarCarrito();
            }
        });
    });
}
function mostrarCarrito() {
    if (carrito.length > 0) {
        tableBody.innerHTML = "";
        carrito.forEach((prod, index) => {
        tableBody.innerHTML += crearFilaCarrito(prod, index);
    });
    agregarEventosEliminar();
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
    ToastIt.now({
        message: "✅ Compra finalizada. ¡Muchas gracias!",
        style: "success",
        close: true,
        duration: 3000,
        position: "bottom-center"
    });

    localStorage.removeItem("shoppingKart");
    carrito.length = 0;

    // Redirigir después de que el toast desaparezca
    setTimeout(() => btnRetornar.click(), 3000);
});



