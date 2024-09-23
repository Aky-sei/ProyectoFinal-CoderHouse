import {faker} from '@faker-js/faker'

fetch('http://localhost:8080/api/sessions/register', {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        name: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        age: faker.number.int({min:18,max:99}),
        password: "123",
        role: "USER"
    })
})

// fetch('http://localhost:8080/api/', {
//     method: "POST",
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify({
        
//     })
// })