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
                <td><button class="btn-quitar-producto, quitarProducto" data-nombre="${producto.nombre}"> <i class="bi bi-trash">Eliminar</i></button></td>
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




const btnTema = document.getElementById('btnTema');
const body = document.body;

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