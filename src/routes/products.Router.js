const express = require('express');

const { Router } = express;
const productosRouter = new Router();

// importamos la clase Container
const ContenedorArchivo = require('../contenedores/ContenedorArchivo');

// Se instancia la clase contenedor
const productService = new ContenedorArchivo("./db/dbProductos.json");

// funcion Error
function crearErrorNoEsAdmin(ruta, metodo) {
    const error = {
        error: -1,
    };
    if (ruta && metodo) {
        error.descripcion = `ruta '${ruta}' metodo '${metodo}' no autorizado`;
    } else {
        error.descripcion = 'no autorizado';
    }
    return error;
}

// Middleware para Administrador
const esAdmin = true;

function soloAdmins(req, res, next) {
    if (!esAdmin) {
        res.json(crearErrorNoEsAdmin(req.url, req.method));
    } else {
        next();
    }
}

// Endpoints
productosRouter.get('/',soloAdmins, async (req, res) => {
    // logica: lista todos los productos
    res.json(await productService.listarAll())
});
//    -->   /api/productos/5
productosRouter.get('/:id', async (req, res) => {
    // logica:lista un producto por su id
    res.json(await productService.listar(req.params.id));
});

// tiene permisos un admin
productosRouter.post('/', soloAdmins, async (req, res) => {
    // logica:crea un producto 
        const data = req.body;
        let today = Date.now();
        let fecha = new Date().toLocaleDateString();
        let id = Math.floor((1 + Math.random()) * 0x10000); //.toString(16).substring(1);
       
        let newProduct = {
            id: id,
            timestamp: today,
            creationDate: fecha,
            data: data,
        };

        productService.nuevoProducto(newProduct).then((ProductService) => {
            res.json(newProduct.id);
        });
});

productosRouter.put('/:id', soloAdmins, async (req, res) => {
    // logica: actualiza un producto por su id
    const data = req.body;
    res.json(await productService.actualizar(data, parseInt(req.params.id)));
});

productosRouter.delete('/:id', soloAdmins, async (req, res) => {
    // logica: borra un producto por su id
    res.json(await productService.borrar(req.params.id));
});

module.exports = productosRouter;
