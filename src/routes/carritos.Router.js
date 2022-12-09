const express = require('express');

const { Router } = express;
const carritosRouter = new Router();

// importamos la clase Container
const ContenedorArchivocarrito = require('../contenedores/ContenedorArchivosCarritos');
const ContenedorArchivo = require('../contenedores/ContenedorArchivo')
// Se instancia la clase contenedor
const carritoService = new ContenedorArchivocarrito('./db/dbCarritos.json');
const productService = new ContenedorArchivo('./db/dbProductos.json')
// Endpoints
carritosRouter.post('/', async (req, res) => {
    // logica: crea un carrito y devuelve su id
        let today = Date.now();
        let fecha = new Date().toLocaleDateString();
        let id = Math.floor((1 + Math.random()) * 0x10000); //.toString(16).substring(1);
        let newCarrito = {
            id: id,
            timestamp: today,
            creationDate: fecha,
            products: [],
        }
        carritoService.nuevoCarrito(newCarrito).then(carritoservice =>{
            res.json(newCarrito.id)
        }) 
});

carritosRouter.delete('/:id', async (req, res) => {
    // logica: vacia un carrito y lo elimina
    res.json(await carritoService.borrar(req.params.id));
});

carritosRouter.get('/:id/products', async (req, res) => {
    // logica: lista los productos guardados en el carrito
    res.json(await carritoService.listar(parseInt(req.params.id)));
});

carritosRouter.post('/:idCarrito/:idProduct/producto', async (req, res) => {
    // logica: incorpora productos al carrito por su id de producto
    const newProducto = await productService.listar(req.params.idProduct)
    res.json(await carritoService.actualizar( newProducto,parseInt(req.params.idCarrito)));
});

carritosRouter.delete('/:idCarrito/:idProduct/producto', async (req, res) => {
    // logica: Elimina un producto de carrito por su id de carrito y de producto
    res.json(await carritoService.borrarProducto(parseInt(req.params.idCarrito),parseInt(req.params.idProduct)));
});

module.exports = carritosRouter;
