let form = document.getElementById("loginForm")
form.addEventListener("submit", async (e) => {
    e.preventDefault()
    await fetch(`/api/sessions/login`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: form[0].value,
            password: form[1].value
        })
    }).then(res => res.json())
    .then((body) => {
        if(body.status === "success") {
            window.location.href = '/profile'
        } else {
            console.log(body)
            if(body.errorMessage === "Usuario-no-encontrado") {
                Swal.fire({
                    title:"No se encontro al usuario en la base de datos",
                    showCancelButton: true,
                    cancelButtonText: "Intentar de nuevo",
                    confirmButtonText: "Registrarse",
                    allowOutsideClick:true
                }).then((result) => {
                    if(result.isConfirmed) {
                        window.location.href = '/register'
                    }
                })
            } else if (body.errorMessage === "Contraseña-incorrecta") {
                Swal.fire({
                    title:"Constraseña incorrecta",
                    allowOutsideClick: true
                })
            }
        }
    })
})