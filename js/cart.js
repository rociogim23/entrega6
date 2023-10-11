
const apiCarrito = "https://japceibal.github.io/emercado-api/user_cart/25801.json";

// Obtener productos del carrito almacenados en localStorage
let productosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

function carritoLocal() {
    // Crear un nuevo producto
    let nuevoProducto = {
        id: localStorage.getItem("prodID"),
        imagen: localStorage.getItem("imagenCarrito"),
        nombre: localStorage.getItem("nombreCarrito"),
        costo: localStorage.getItem("costoCarrito"),
        moneda: localStorage.getItem("monedaCarrito"),
    };

    // Verificar si el producto ya existe en el carrito
    let productoExistente = productosCarrito.find(item => item.nombre === nuevoProducto.nombre);

    if (productoExistente) {
        // Si el producto existe, incrementar la cantidad en el objeto existente
        productoExistente.cantidad++;
    } else {
        // Agregar el nuevo producto al array
        nuevoProducto.cantidad = 1; // Establecer la cantidad en 1 para un nuevo producto
        productosCarrito.push(nuevoProducto);
    }

    // Actualizar el carrito en el almacenamiento local
    localStorage.setItem('carrito', JSON.stringify(productosCarrito));
}






async function carritoFetch() {
    const res = await fetch(apiCarrito);
    const data = await res.json();
    return data;
}




mostrarCarrito();

async function mostrarCarrito() {
    const element = await carritoFetch();
    let contenedor = document.querySelector("main .container");


    contenedor.innerHTML += `
        <h2 class="h1Carrito">Carrito de Compras</h2>
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
            </tr>
            <br>
            <tr>
                <td><img class="imagen-carrito" src="${element.articles[0].image}"/></td>
                <td>${element.articles[0].name}</td>
                <td>${element.articles[0].currency} ${element.articles[0].unitCost}</td>
                <td><input id="cantidadInput" type="number"  name="${element.articles[0].unitCost}"></td>
                <td id="total" class="negrita">${element.articles[0].currency} ${element.articles[0].unitCost}</td>
            </tr>
        </table>
    `;


    //ENTREGA 5 DESAFIATE

    let cont_tabla = document.getElementById("tabla-carrito");


    productosCarrito.forEach((producto) => {
        let fila_tabla = document.createElement("tr");
        fila_tabla.innerHTML = `
            <td><img class="imagen-carrito" src="${producto.imagen}"/></td>
            <td>${producto.nombre}</td>
            <td>${producto.moneda} ${producto.costo}</td>
            <td><input id="cantidadInputNuevo" type="number" value="${producto.cantidad}" name="${element.articles[0].unitCost}"></td>
            <td id="totalCarrito" class="negrita">${producto.moneda} ${producto.costo}</td>
        `;
        cont_tabla.appendChild(fila_tabla);
    });

    //FIN ENTREGA 5 DESAFIATE

    
    //ENTREGA 5 PARTE 3


   
    var cantidadInput = document.getElementById("cantidadInput");
    var totalTd = document.getElementById("total");

    cantidadInput.addEventListener("input", calcularTotal);
    


   async function calcularTotal() {
        const element = await carritoFetch();
        var cantidad = cantidadInput.value;        
        var precioUnitario = element.articles[0].unitCost;      
        var total = cantidad * precioUnitario;

        totalTd.textContent = "$" + total.toFixed(2);
    }


     /*
let cantidadCarrito = document.getElementById("cantidadInputNuevo");
let subtotalCarrito = document.getElementById("totalCarrito");

cantidadCarrito.addEventListener("input", calcularTotal2);


async function calcularTotal2() {
    var cantidad = cantidadCarrito.value; 
    
    
    var precioUnitario = 8000;


    var total = cantidad * precioUnitario;

    subtotalCarrito.textContent = "$" + total.toFixed(2);
}
*/


// Obtén los elementos de cantidad y subtotal del carrito
let cantidadInputNuevo = document.getElementById("cantidadInputNuevo");
let subtotalCarrito = document.getElementById("totalCarrito");

// Agrega un evento de escucha para la entrada de cantidad
cantidadInputNuevo.addEventListener("input", calcularTotal2);

async function calcularTotal2() {
    // Obtén la cantidad ingresada por el usuario
    var cantidad = cantidadInputNuevo.value;

    // Obtén el precio unitario del producto (ajústalo según tus datos reales)
    var precioUnitario = products.cost; 

    // Calcula el nuevo subtotal
    var total = cantidad * precioUnitario;

    // Actualiza el contenido del elemento que muestra el subtotal
    subtotalCarrito.textContent = "$" + total.toFixed(2);
}


}

