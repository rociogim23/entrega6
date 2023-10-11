const carrusel = document.getElementById('toggle');

document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("cars").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("toys").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("furniture").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});

function isLoggedIn() {
    let dato = localStorage.getItem("email");
    if (dato){
        return true;
    }else{
        return false;
    }
}

// entrea 4, parte 2: función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem("email");
    window.location.href = 'login.html'; //redirige al inicio
}

// entrega 4, parte 2: evento click cerrar sesión
document.getElementById("cerrarSesion").addEventListener("click", function() {
    cerrarSesion();
} );


window.addEventListener('load', function() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
});

//Entregable 2

let email = localStorage.getItem("email"); // <- email = "emilianopintos18@gmail.com"

let li_nav = document.getElementById("usuario");


li_nav.innerHTML = `<span class="nav-link">${email}</span>`;







