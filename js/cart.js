
const apiCarrito = "https://japceibal.github.io/emercado-api/user_cart/25801.json";
let total = 0;



let productosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

function carritoLocal() {
    
    let nuevoProducto = {
        id: localStorage.getItem("prodID"),
        imagen: localStorage.getItem("imagenCarrito"),
        nombre: localStorage.getItem("nombreCarrito"),
        costo: localStorage.getItem("costoCarrito"),
        moneda: localStorage.getItem("monedaCarrito"),
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
    console.log(element)


    //ENTREGA 5 DESAFIATE

    let cont_tabla = document.getElementById("tabla-carrito");



    


    productosCarrito.forEach((producto) => {


        

        
        let fila_tabla = document.createElement("tr");
        if(producto.nombre != null){


       fila_tabla.innerHTML = `
    <td><img class="imagen-carrito" src="${producto.imagen}"/></td>
    <td>${producto.nombre}</td>
    <td>${producto.moneda} ${producto.costo}</td>
    <td><input class="cantidadInputNuevo" type="number" value="${producto.cantidad}" id="cantidad_${producto.nombre}"></td>
    <td id="subTotal" class="negrita">${producto.moneda} <span class="costoProducto">${producto.cantidad * producto.costo}</span></td>
`;
        cont_tabla.appendChild(fila_tabla);

        
        localStorage.removeItem('nombreCarrito'); 
        localStorage.setItem('costoCarrito', producto.costo); 
       

       
        }

          
    const cantidadInputNuevo = document.querySelectorAll(".cantidadInputNuevo");
    const costoProducto = document.querySelectorAll(".costoProducto");
    
    cantidadInputNuevo.forEach((input, index) => {
        input.addEventListener("input", () => {
            const cantidadInputID = input.getAttribute("id");
            const productoNombre = cantidadInputID.split("_")[1];
            const cantidad = parseFloat(input.value);
            const producto = productosCarrito.find(item => item.nombre === productoNombre);
    
            if (!isNaN(cantidad) && producto) {
                const costo = parseFloat(producto.costo);
                const subtotal = cantidad * costo;
                costoProducto[index].textContent = ` ${subtotal}`;
            } else {
             
                costoProducto[index].textContent = `${producto.moneda} 0.00`;
            }
        });
    });



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
        var tipoMoneda = element.articles[0].currency

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


const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-theme');
  } else {

  body.classList.add('light-theme')
  }
    

btnTema.addEventListener('click', toggleTheme);

//MOSTRAR BOTON CON NOMBRE DE USUARIO
let email = localStorage.getItem("email"); // <- email 
let li_nav = document.getElementById("usuario");
li_nav.innerHTML = `<span class="nav-link">${email}</span>`;




//SUBTOTAL ENTREGA 6 PUNTO 1

const subtotaldeTodos = document.querySelector(".subtotaldeTodos");

document.addEventListener("DOMContentLoaded", function() {
    const subtotales = document.querySelectorAll(".costoProducto");
    let total = 0;
    subtotales.forEach(subtotal => {
        total += parseFloat(subtotal.textContent);
    });
    subtotaldeTodos.textContent = "USD " + total.toFixed(2);
});

document.addEventListener("input", function (event) {
    if (event.target.classList.contains("cantidadInputNuevo")) {
        const subtotales = document.querySelectorAll(".costoProducto");
        let total = 0;
        subtotales.forEach(subtotal => {
            total += parseFloat(subtotal.textContent);
        });
        subtotaldeTodos.textContent = "USD " + total.toFixed(2);
        calcularTotal();
    }
});



//COSTO DE ENVIO PARTE 6 PUNTO 1
document.addEventListener("DOMContentLoaded", function() {

    const subtotaldeTodos = document.querySelector(".subtotaldeTodos");
    const subtotaldeEnvio = document.querySelector(".subtotaldeEnvio");
    const premiumRadio = document.getElementById("premium");
    const expressRadio = document.getElementById("express");
    const standardRadio = document.getElementById("standard");

    CalcularSubtotaldeEnvio();


    premiumRadio.addEventListener("change", CalcularSubtotaldeEnvio);
    expressRadio.addEventListener("change", CalcularSubtotaldeEnvio);
    standardRadio.addEventListener("change", CalcularSubtotaldeEnvio);

    
    function CalcularSubtotaldeEnvio() {
        const subtotalTodos = parseFloat(subtotaldeTodos.textContent.replace("USD ", ""));
        let porcentajeSubtotal = 0;

        
        if (premiumRadio.checked) {
            porcentajeSubtotal = 0.15; // 15%
        } else if (expressRadio.checked) {
            porcentajeSubtotal = 0.07; // 7%
        } else if (standardRadio.checked) {
            porcentajeSubtotal = 0.05; // 5%
        }

        const subtotalconEnvio = subtotalTodos * porcentajeSubtotal;
        subtotaldeEnvio.textContent = "USD " + subtotalconEnvio.toFixed(2);
    }
});


//TOTAL ENTREGA 6 PARTE 1
document.addEventListener("DOMContentLoaded", function() {
    const subtotaldeEnvio = document.querySelector(".subtotaldeEnvio");
    const subtotaldeTodos = document.querySelector(".subtotaldeTodos");
    const totaldeTodo = document.querySelector(".totaldeTodo");

    calcularYmostrarTotal();

   
    subtotaldeEnvio.addEventListener("DOMSubtreeModified", calcularYmostrarTotal);
    subtotaldeTodos.addEventListener("DOMSubtreeModified", calcularYmostrarTotal);

    function calcularYmostrarTotal() {
        const subtotalEnvio = parseFloat(subtotaldeEnvio.textContent.replace("USD ", ""));
        const subtotalTodos = parseFloat(subtotaldeTodos.textContent.replace("USD ", ""));

        const total = subtotalTodos + subtotalEnvio;
        totaldeTodo.textContent = "USD " + total.toFixed(2);
    }
});