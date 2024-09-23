import 'dotenv/config'

let userId = document.getElementById("userId").innerHTML

let form = document.getElementById("updateForm")
form.addEventListener("submit", async (e) => {
    e.preventDefault()
    await fetch(`${process.env.HOST}/api/users/${userId}`, {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            role: form[0].value
        })
    })
})

let deleteButton = document.getElementById("deleteUser")
deleteButton.addEventListener("click", async (e) => {
    e.preventDefault()
    await fetch(`${process.env.HOST}/api/users/${userId}`, {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'}
    })
})