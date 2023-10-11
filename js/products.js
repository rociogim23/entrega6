let API_URL = `https://japceibal.github.io/emercado-api/cats_products/${localStorage.getItem(
  "catID"
)}.json`;
let API_URL_JUGUETES =
  "https://japceibal.github.io/emercado-api/cats_products/102.json";
let cardsContainer = document.getElementById("container-cards");

  //------PUNTO 1 ENTREGA 3-----
  function setProdID(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html";
  }
  //---------------------------

async function fetchProducts() {
  try {
    let response = await fetch(API_URL);
    let data = await response.json();
    return data.products;
  } catch (error) {
    console.error("Error trayendo la data:", error);
  }
}

async function displayProducts() {
  let products = await fetchProducts();

  products.forEach((product) => printProducto(product, cardsContainer) );
}
// Llamo a la func para mostrar los productos cuando la página cargue
displayProducts();

//ordena pero alfabeticamente y no por precio (porque el precio esta dentro del h2)(rocio)
document.getElementById("flecha_Ascendente").addEventListener("click", function () {
    ordenarProductos('ascendente');
  });

document.getElementById("flecha_Descendente").addEventListener("click", function () {
    ordenarProductos('descendente');
  });

document.getElementById("flecha_Relevancia").addEventListener("click", function () {
  ordenarProductos('relevante');
});


/**
 * Imprime un producto en el contenedor especificado
 */
function printProducto(product, container) {
    let card = document.createElement("div");
    card.classList.add("div-cards", "row", "container");
    card.innerHTML = `
              <img class="col-sm-12 col-md-12 img-fluid" src="${product.image}" alt="${product.name}">
              <div class="col-sm-12 col-md-12">
                  <h2>${product.name} - ${product.currency} ${product.cost}</h2>
                  <p>${product.description}</p>
              </div>
              <span class="price col-sm-12 col-md-12">${product.soldCount} vendidos</span>
          `;
    container.appendChild(card);

    card.addEventListener("click", function (e) {
      e.preventDefault();
      setProdID(product.id);
    });
}

async function ordenarProductos(x) {
  let products = await fetchProducts();

  /* Rodrigo: se usa el parseInt para bajar el numero de JSON a decimal*/
  products.sort(function (a, b) {
    let priceA = parseInt(a.cost);
    let priceB = parseInt(b.cost);
    let countA = parseInt(a.soldCount);
    let countB = parseInt(b.soldCount);

    if (x == 'ascendente') { // ascendente
      return priceA - priceB;
    } else if (x == 'descendente'){ // descendente
        return priceB - priceA;
    }else if (x == 'relevante'){ // relevante
      return  countB - countA; 
    }
  });

  while (cardsContainer.firstChild) {
    cardsContainer.removeChild(cardsContainer.firstChild);
  }

  
  // Muestra los productos ordenados
  products.forEach((producto) => printProducto(producto, cardsContainer));
}

//Funciona el boton de limpiar en products.html(rocio)
document.getElementById("clearRangeFilter").addEventListener("click", function () {
    document.getElementById("rangeFilterCountMin").value = "";
    document.getElementById("rangeFilterCountMax").value = "";

    minCount = undefined;
    maxCount = undefined;
  });

document.getElementById("Busqueda").addEventListener("input", function(event) {
  const searchTerm = event.target.value;
  clearCardsContainer(); // Limpia los productos actuales en la vista
  displayProducts(searchTerm); // Muestra los productos filtrados por término de búsqueda
});
// Función para limpiar los productos actuales en la vista
function clearCardsContainer() {
  while (cardsContainer.firstChild) {
    cardsContainer.removeChild(cardsContainer.firstChild);
  }
}

// Función displayProducts modificada para aceptar el término de búsqueda
async function displayProducts(filterTerm = "") {
  let products = await fetchProducts();

  // Filtrar los productos si se proporciona un término de búsqueda
  if (filterTerm) {
    products = products.filter(product =>
      product.name.toLowerCase().includes(filterTerm.toLowerCase())
    );
  }

  // Mostrar los productos filtrados
  products.forEach((producto) => printProducto(producto, cardsContainer));
};

async function filtrarProductos() {
  let products = await fetchProducts();
  let minCount = parseInt(document.getElementById("rangeFilterCountMin").value);
  let maxCount = parseInt(document.getElementById("rangeFilterCountMax").value);

  // Filtrar productos dentro del rango de precios especificado
  let filteredProducts = products.filter((product) => {
    let productPrice = parseInt(product.cost);
    return productPrice >= minCount && productPrice <= maxCount;
  });

  // Limpiar el contenedor de productos
  while (cardsContainer.firstChild) {
    cardsContainer.removeChild(cardsContainer.firstChild);
  }

  // Mostrar los productos filtrados
  filteredProducts.forEach((producto) => printProducto(producto, cardsContainer));
}

// Agregar un evento click al botón o elemento con el ID "rangeFilterCount"
document.getElementById("rangeFilterCount").addEventListener("click", function () {
  filtrarProductos();
});


//Cambiar de tema dark/light ENTREGA 4 PARTE 3

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