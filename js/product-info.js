let api_info = `https://japceibal.github.io/emercado-api/products/${localStorage.getItem("prodID") + EXT_TYPE
    }`;
let api_comments = `https://japceibal.github.io/emercado-api/products_comments/${localStorage.getItem("prodID") + EXT_TYPE
    }`;

console.log(api_info);
console.log(api_comments);

async function fetchProducts() {
    try {
        let response = await fetch(api_info);
        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Re-throw the error so it can be handled outside this function
    }
}

async function fetchComments() {
    try {
        let response = await fetch(api_comments);
        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Re-throw the error so it can be handled outside this function
    }
}

function crearRatingEstrellas(puntaje) {
    const maxEstrellas = 5;
    const ratingEstrellas = document.createElement("div");

    for (let i = 1; i <= maxEstrellas; i++) {
        const estrella = document.createElement("span");
        estrella.classList.add("fa", "fa-star");
        if (puntaje >= i) {
            estrella.classList.add("checked");
        }
        ratingEstrellas.appendChild(estrella);
    }

    return ratingEstrellas;
}
//Comentarios (reubicados)
function crearCardComentario(comentario) {
    let puntaje = comentario.score;
    let ratingEstrellas = crearRatingEstrellas(puntaje);
    let card = document.createElement("div");
    card.classList.add("estilo-comentarios");

    card.innerHTML = `
	<p><strong>${comentario.user}</strong> -${comentario.dateTime} -<br>
	${comentario.description}</p>
	`;

    card.appendChild(ratingEstrellas);

    return card;
}

function getContenedorDeComentarios() {
    return document.getElementById("contenedor");
}

async function nuevoDisplay() {
    let products = await fetchProducts();
    let contenedor = getContenedorDeComentarios();
    let comentarios = await fetchComments();
    //Caracteristicas Productos
    contenedor.innerHTML = `


    <div id="btnComprar"> <input type="button"  value="Comprar" id="btnAgregarCarrito" class="btn btn-primary btn-lg"></div>


    <div id="nombre"> <h1>${products.name}</h1>
    </div>
    
    <hr>

    <ul class="estilo-lista">
        <li>
            <strong>Precio</strong>
            <br>
            ${products.currency} ${products.cost}
        </li>
        <br>
        <li>
            <strong>Descripción</strong>
            <br>
            ${products.description}
        </li>
        <br>
        <li>
            <strong>Categoría</strong>
            <br>
            ${products.category}
        </li>
        <br>
        <li>
            <strong>Cantidad de vendidos</strong>
            <br>
            ${products.soldCount}
        </li>
        <br>
        </li>
        
        <li>
        <strong>Imágenes ilustrativas</strong>
        <br>
        <br>
        <div id="carouselExample" class="carousel slide">
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <img src="${products.images[0]}" class="d-block w-100" alt="...">
                </div>
                <div class="carousel-item">
                    <img src="${products.images[1]}" class="d-block w-100" alt="...">
                </div>
                <div class="carousel-item">
                    <img src="${products.images[2]}" class="d-block w-100" alt="...">
                </div>
                <div class="carousel-item">
                    <img src="${products.images[3]}" class="d-block w-100" alt="...">
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Anterior</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Siguiente</span>
            </button>
        </div>
    </li>
    
    </ul>
    

    <h2>Comentarios</h2> `;
    // comentarios
    comentarios.forEach((comentario) => {
        const card = crearCardComentario(comentario);

        contenedor.appendChild(card);
    });

    let btnAgregar = document.getElementById("btnAgregarCarrito");
    // Entrega 5 --- DESAFIATE
    btnAgregar.addEventListener("click", async function () {

     window.location.reload();

        let productoCarrito = await fetchProducts();

alert('Tu producto se agregó correctamente al carrito de compras')
        localStorage.setItem("imagenCarrito", `${productoCarrito.images[0]}`);
        localStorage.setItem("nombreCarrito", `${productoCarrito.name}`);
        localStorage.setItem("costoCarrito", `${productoCarrito.cost}`);
        localStorage.setItem("monedaCarrito", `${productoCarrito.currency}`);
    })


    carritoLocal();

    
   
}

let boton = document.getElementById("btnEnviar");

boton.addEventListener("click", function () {
    const fecha = new Date();
    const now = fecha.toLocaleString();

    const comentarioNuevo = {
        user: localStorage.getItem("email"),
        description: document.getElementById("areaDeTexto").value,
        score: document.getElementById("estrellas-enviadas").value,
        dateTime: now
    };
    const cardComentario = crearCardComentario(comentarioNuevo);

    const contenedor = getContenedorDeComentarios();
    contenedor.appendChild(cardComentario)
});

// Call nuevoDisplay to fetch and display products
nuevoDisplay();


// funcion que guarda el id
function prodID(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
}



// Función para mostrar productos en la página
async function mostrarProductosrelacionados() {
    let products = await fetchProducts()
    const productosContainer = document.getElementById("productos-container");

    products.relatedProducts.forEach(element => {
        productosContainer.innerHTML +=
            `
        
        
        <ul class="producto"class="productoReferencia" onclick="prodID(${element.id})">
            <li>
            <div id="nombre"> <img src="${element.image}"></img> </div>
                <br>
                <div id="nombre"> <h1>${element.name}</h1> </div>
            </li>

            
            </ul>             
            
            `


    })



}

// Llamar a la función para mostrar productos cuando la página cargue
window.onload = mostrarProductosrelacionados;






// entrega 5 carrito



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
        

            productoExistente.cantidad++;

       
            
    } else {
        // Agregar el nuevo producto al array
        nuevoProducto.cantidad = 1; // Establecer la cantidad en 1 para un nuevo producto
        productosCarrito.push(nuevoProducto);
    }

    // Actualizar el carrito en el almacenamiento local
    localStorage.setItem('carrito', JSON.stringify(productosCarrito));
}


const btnTema = document.getElementById('btnTema');
const body = document.body;

// Función para cambiar el tema
function toggleTheme() {
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light'); // Guardar el tema en el almacenamiento local
    } else {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark'); // Guardar el tema en el almacenamiento local
    }
}

// Verificar el tema almacenado en el almacenamiento local y aplicarlo si existe
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-theme');
  } else {

  body.classList.add('light-theme')
  }
    
// Agregar un listener al botón para cambiar el tema cuando se hace clic
btnTema.addEventListener('click', toggleTheme);



let email = localStorage.getItem("email"); // <- email = "emilianopintos18@gmail.com"




let li_nav = document.getElementById("usuario");


li_nav.innerHTML = `<span class="nav-link">${email}</span>`;