const fs = require('fs').promises;

class ContenedorArchivosCarritos {
    constructor(ruta) {
        this.ruta = ruta;
    }

    async listar(id) {
        try {
            const read = await fs.readFile(this.ruta, 'utf-8');
            const data = JSON.parse(read);
            const element = data.find((element) => id === element.id);

            if (!element) {
                return null;
            }
            return element.products;
        } catch (error) {
            console.log(error);
        }
    }

    async listarAll() {
        try {
            const read = await fs.readFile(this.ruta, 'utf-8');
            return JSON.parse(read);
        } catch (error) {
            console.log(error);
        }
    }

    async nuevoCarrito(obj) {
        try {
            const leer = await fs.readFile(this.ruta, 'utf-8');
            let data = JSON.parse(leer);
            data.push(obj);
            await fs.writeFile(
                this.ruta,
                JSON.stringify(data, null, 2),
                'utf-8'
            );
            return obj.id;
        } catch (error) {
            errorMsg = 'no se pudo crear el carrito';
            return errorMsg;
        }
    }
    async actualizar(element, id) {
        try {
            const read = await fs.readFile(this.ruta, 'utf-8');
            let data = JSON.parse(read);

            let cart = data.find((element) => id === element.id);
            cart.products.push(element);

            const filteredElements = data.filter(
                (element) => element.id !== id
            );
            data = [...filteredElements, cart];

            await fs.writeFile(
                this.ruta,
                JSON.stringify(data, null, 2),
                'utf-8'
            );

            return cart.products;
        } catch (error) {
            console.log(error);
        }
    }
    async borrar(id) {
        try {
            const read = await fs.readFile(this.ruta, 'utf-8');
            const data = JSON.parse(read);

            const newData = data.filter((element) => element.id != id);
            await fs.writeFile(
                this.ruta,
                JSON.stringify(newData, null, 2),
                'utf-8'
            );

            return newData;
        } catch (error) {
            console.log(error);
        }
    }

    async borrarProducto(idCart, idProduct) {
        try {
            const read = await fs.readFile(this.ruta, 'utf-8');
            let data = JSON.parse(read);

            let cart = data.find((element) => idCart === element.id);
            const newProducts = cart.products.filter(
                (element) => element.id != idProduct
            );
            cart.products = newProducts;

            const filteredElements = data.filter(
                (element) => element.id !== idCart
            );
            data = [...filteredElements, cart];

            await fs.writeFile(
                this.ruta,
                JSON.stringify(data, null, 2),
                'utf-8'
            );

            return cart;
        } catch (error) {
            console.log(error);
        }
    }

    async borrarAll() {
        try {
            await fs.writeFile(this.ruta, JSON.stringify([], null, 2), 'utf-8');
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = ContenedorArchivosCarritos;
