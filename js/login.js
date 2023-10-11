function showAlertSuccess() { // ALERTA SI SE REGISTRA CORRECTAMENTE
    document.getElementById("alert-success").classList.add("show");
}

function showAlertError() { // ALERTA POR SI FALTA ALGÚN CAMPO
    document.getElementById("alert-danger").classList.add("show");
}


let boton = document.getElementById("regBtn")

boton.addEventListener("click", function () {
    
    let inputs = document.getElementsByTagName("input")

     for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value.length <= 0) {
            showAlertError()
            return null
        }
    }


    let contraseña = document.getElementById("password1")
    
    if (contraseña.value.length <=0) {
        showAlertError()
        return null
    }

    let checkbox = document.getElementById("terminos")
    if (checkbox.checked === false) {
        showAlertError()
        return null
    }

    showAlertSuccess()

    // DESAFIATE 
    let email = document.getElementById("email").value;
    let passw = document.getElementById("password1").value;
    localStorage.setItem("email", email);
    localStorage.setItem("password", passw);

    document.location.href = "index.html"
})

