# Servidor con Express, Coderhouse

## Primera pre-entrega del proyecto final para el curso de BackEnd de CoerHouse

En el proyecto se presenta un servidor con express con las funcionaldiades requeridas por las consignas.

La estructura de archivos se bassa en separar las clases, los routers y los archivos donde se almacenan los datos.

Se conserva las clases como documentos aparte para reutilizar facilmente el codigo que se fue trabajndo en los desafios.

Accediendo a las rutas:
- /api/products
- /api/products?limit=
- /api/products/:pid
- /api/carts
- /api/carts/:cid
- /api/carts/:cid/products/:pid

Se puede acceder a las funcionalidades del servidor.

Se trabajó con ""type": "module"," dentro del package.json para manejar más comodamente las importaciones y exportaciones entre los archivos.

Los archivos .json vienen con algunos productos y carritos pre-creados para poder facilitar la revisión.