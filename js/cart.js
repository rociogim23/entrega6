let apiCarrito = "https://japceibal.github.io/emercado-api/user_cart/25801.json";
let total = 0;

let productosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

function carritoLocal() {
    let nuevoProducto = {
        id: localStorage.getItem("prodID"),
        imagen: localStorage.getItem("imagenCarrito"),
        nombre: localStorage.getItem("nombreCarrito"),
        costo: localStorage.getItem("costoCarrito"),
        moneda: localStorage.getItem("monedaCarrito"),
        cantidad: 1,
    };

    let productoExistente = productosCarrito.find(item => item.nombre === nuevoProducto.nombre);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        nuevoProducto.cantidad = 1;
        productosCarrito.push(nuevoProducto);
    }

    localStorage.setItem('carrito', JSON.stringify(productosCarrito));
}

async function carritoFetch() {
    let res = await fetch(apiCarrito);
    let data = await res.json();
    return data;
}

mostrarCarrito();

async function mostrarCarrito() {
    let element = await carritoFetch();
    let contenedor = document.querySelector("main .container");

    contenedor.innerHTML += `
        <h2 class="container text-center">Carrito de Compras</h2>
        <br>
        <h3>Artículos a comprar</h3>
        <br>
        <table class="tabla-carrito" id="tabla-carrito">
            <tr class="titulos">
                <th></th>
                <th>Nombre</th>
                <th>Costo</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acciones</th>
            </tr>
            <br>
            <tr>
                <td><img class="imagen-carrito" src="${element.articles[0].image}"/></td>
                <td>${element.articles[0].name}</td>
                <td>${element.articles[0].currency} ${element.articles[0].unitCost}</td>
                <td><input id="cantidadInput" value="1" type="number" name="${element.articles[0].unitCost}"></td>
                <td id="total" class="negrita">${element.articles[0].currency} ${element.articles[0].unitCost}</td> 
            </tr>
        </table>
    `;

    let cont_tabla = document.getElementById("tabla-carrito");

    productosCarrito.forEach((producto) => {
        let fila_tabla = document.createElement("tr");
        if (producto.nombre != null) {
            fila_tabla.innerHTML = `
                <td><img class="imagen-carrito" src="${producto.imagen}"/></td>
                <td>${producto.nombre}</td>
                <td>${producto.moneda} ${producto.costo}</td>
                <td><input class="cantidadInputNuevo" type="number" value="${producto.cantidad}" id="cantidad_${producto.nombre}"></td>
                <td id="subTotal" class="negrita">${producto.moneda} <span class="costoProducto">${producto.cantidad * producto.costo}</span></td>
                <td><button class="btn-quitar-producto, quitarProducto" data-nombre="${producto.nombre}">Eliminar</button></td>
            `;

            cont_tabla.appendChild(fila_tabla);

            localStorage.removeItem('nombreCarrito');
            localStorage.setItem('costoCarrito', producto.costo);
        }

        let cantidadInputNuevo = document.querySelectorAll(".cantidadInputNuevo");
        let costoProducto = document.querySelectorAll(".costoProducto");

        cantidadInputNuevo.forEach((input, index) => {
            input.addEventListener("input", () => {
                let cantidadInputID = input.getAttribute("id");
                let productoNombre = cantidadInputID.split("_")[1];
                let cantidad = parseFloat(input.value);
                let producto = productosCarrito.find(item => item.nombre === productoNombre);

                if (!isNaN(cantidad) && producto) {
                    let costo = parseFloat(producto.costo);
                    let subtotal = cantidad * costo;
                    costoProducto[index].textContent = ` ${subtotal}`;
                } else {
                    costoProducto[index].textContent = `${producto.moneda} 0.00`;
                }
            });
        });
        actualizarPrecios()
    });

    let cantidadInput = document.getElementById("cantidadInput");
    let totalTd = document.getElementById("total");

    cantidadInput.addEventListener("input", calcularTotal);

    async function calcularTotal() {
        let element = await carritoFetch();
        let cantidad = cantidadInput.value;
        let precioUnitario = element.articles[0].unitCost;
        let total = cantidad * precioUnitario;
        let tipoMoneda = element.articles[0].currency;

        totalTd.textContent = tipoMoneda + " " + total;
    }
}

let btnTema = document.getElementById('btnTema');
let body = document.body;

// Función para cambiar el tema
function toggleTheme() {
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
}

let currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-theme');
} else {
    body.classList.add('light-theme');
}

btnTema.addEventListener('click', toggleTheme);

//MOSTRAR BOTON CON NOMBRE DE USUARIO
let email = localStorage.getItem("email");
let li_nav = document.getElementById("usuario");
li_nav.innerHTML = `<span class="nav-link">${email}</span>`;

//INICIO ENTREGA 6 PUNTO 1

//SUBTOTAL ENTREGA 6 PUNTO 1

let subtotaldeTodos = document.querySelector(".subtotaldeTodos");

document.addEventListener("DOMContentLoaded", function () {
    let subtotales = document.querySelectorAll(".costoProducto");
    let total = 0;
    subtotales.forEach(subtotal => {
        total += parseFloat(subtotal.textContent);
    });
    subtotaldeTodos.textContent = "USD " + total.toFixed(2);
});

document.addEventListener("input", function (event) {
    if (event.target.classList.contains("cantidadInputNuevo")) {
        let subtotales = document.querySelectorAll(".costoProducto");
        let total = 0;
        subtotales.forEach(subtotal => {
            total += parseFloat(subtotal.textContent);
        });
        subtotaldeTodos.textContent = "USD " + total.toFixed(2);
        calcularTotal();
    }
});

//COSTO DE ENVIO ENTREGA 6 PUNTO 1
document.addEventListener("DOMContentLoaded", function () {

    let subtotaldeTodos = document.querySelector(".subtotaldeTodos");
    let subtotaldeEnvio = document.querySelector(".subtotaldeEnvio");
    let premiumRadio = document.getElementById("premium");
    let expressRadio = document.getElementById("express");
    let standardRadio = document.getElementById("standard");

    CalcularSubtotaldeEnvio();

    premiumRadio.addEventListener("change", CalcularSubtotaldeEnvio);
    expressRadio.addEventListener("change", CalcularSubtotaldeEnvio);
    standardRadio.addEventListener("change", CalcularSubtotaldeEnvio);

    function CalcularSubtotaldeEnvio() {
        let subtotalTodos = parseFloat(subtotaldeTodos.textContent.replace("USD ", ""));
        let porcentajeSubtotal = 0;

        if (premiumRadio.checked) {
            porcentajeSubtotal = 0.15; // 15%
        } else if (expressRadio.checked) {
            porcentajeSubtotal = 0.07; // 7%
        } else if (standardRadio.checked) {
            porcentajeSubtotal = 0.05; // 5%
        }

        let subtotalconEnvio = subtotalTodos * porcentajeSubtotal;
        subtotaldeEnvio.textContent = "USD " + subtotalconEnvio.toFixed(2);
    }
});

//TOTAL ENTREGA 6 PARTE 1
document.addEventListener("DOMContentLoaded", function () {
    let subtotaldeEnvio = document.querySelector(".subtotaldeEnvio");
    let subtotaldeTodos = document.querySelector(".subtotaldeTodos");
    let totaldeTodo = document.querySelector(".totaldeTodo");

    calcularYmostrarTotal();

    subtotaldeEnvio.addEventListener("DOMSubtreeModified", calcularYmostrarTotal);
    subtotaldeTodos.addEventListener("DOMSubtreeModified", calcularYmostrarTotal);

    function calcularYmostrarTotal() {
        let subtotalEnvio = parseFloat(subtotaldeEnvio.textContent.replace("USD ", ""));
        let subtotalTodos = parseFloat(subtotaldeTodos.textContent.replace("USD ", ""));

        let total = subtotalTodos + subtotalEnvio;
        totaldeTodo.textContent = "USD " + total.toFixed(2);
    }
});

function actualizarPrecios() {
    let subtotaldeTodos = document.querySelector(".subtotaldeTodos");
    let subtotaldeEnvio = document.querySelector(".subtotaldeEnvio");
    let totaldeTodo = document.querySelector(".totaldeTodo");
    
    let subtotales = document.querySelectorAll(".costoProducto");
    let totalSubtotal = 0;
    
    subtotales.forEach(subtotal => {
        totalSubtotal += parseFloat(subtotal.textContent);
    });
    
    let premiumRadio = document.getElementById("premium");
    let expressRadio = document.getElementById("express");
    let standardRadio = document.getElementById("standard");
    let porcentajeSubtotal = 0;
    
    if (premiumRadio.checked) {
        porcentajeSubtotal = 0.15; // 15%
    } else if (expressRadio.checked) {
        porcentajeSubtotal = 0.07; // 7%
    } else if (standardRadio.checked) {
        porcentajeSubtotal = 0.05; // 5%
    }
    
    let subtotalEnvio = totalSubtotal * porcentajeSubtotal;
    let total = totalSubtotal + subtotalEnvio;
    
    subtotaldeTodos.textContent = "USD " + totalSubtotal.toFixed(2);
    subtotaldeEnvio.textContent = "USD " + subtotalEnvio.toFixed(2);
    totaldeTodo.textContent = "USD " + total.toFixed(2);
}




//FIN ENTREGA 6 PARTE 1

//INICIO ENTREGA 6 PARTE 2

let creditoRadio = document.getElementById("credito");
let transferenciaRadio = document.getElementById("transferencia");
let inputsTarjetaCredito = document.querySelectorAll("#tarjetaCredito input");
let inputsTransferencia = document.querySelectorAll("#transferenciaBancaria input");

creditoRadio.addEventListener("change", function () {
    let isCreditoSelected = creditoRadio.checked;
    inputsTarjetaCredito.forEach(input => {
        input.disabled = !isCreditoSelected;
    });

    if (isCreditoSelected) {
        inputsTransferencia.forEach(input => {
            input.disabled = true;
        });
    }
});

transferenciaRadio.addEventListener("change", function () {
    let isTransferenciaSelected = transferenciaRadio.checked;
    inputsTransferencia.forEach(input => {
        input.disabled = !isTransferenciaSelected;
    });

    if (isTransferenciaSelected) {
        inputsTarjetaCredito.forEach(input => {
            input.disabled = true;
        });
    }
});

let isModalOpen = false;

function closeModal() {
    isModalOpen = false;
    let modal = document.getElementById("openModal");
    modal.style.display = "none";
    document.body.classList.remove("blur-background");
}

function openModal() {
    isModalOpen = true;
    let modal = document.getElementById("openModal");
    modal.style.display = "block";
    document.body.classList.add("blur-background");
    localStorage.setItem('modalOpened', 'true');
}

document.querySelector('a[href="#close"]').addEventListener('click', function (event) {
    event.preventDefault();
    closeModal();
});

document.querySelector('a[href="#openModal"]').addEventListener('click', function (event) {
    event.preventDefault();
    openModal();
});

//FIN ENTREGA 6 PARTE 2

//ENTREGA 6 Desafiate 

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("quitarProducto")) {

        let productName = event.target.getAttribute("data-nombre");

        productosCarrito = productosCarrito.filter(product => product.nombre !== productName);

        localStorage.setItem('carrito', JSON.stringify(productosCarrito));

        event.target.closest("tr").remove();
    }
});

//Actualiza el Precio al quitar un producto
document.addEventListener("DOMContentLoaded", actualizarPrecios);
// Llama a la función para actualizar los precios cuando se elimina un producto
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("quitarProducto")) {
        actualizarPrecios();
    }
});

