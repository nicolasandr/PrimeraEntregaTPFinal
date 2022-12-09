const { promises: fs } = require('fs');
// const fs = require('fs').promises;
class ContenedorArchivo {
    constructor(ruta) {
        this.ruta = ruta;
    }

    async listar(id) {
        try {
            const leer = await fs.readFile(this.ruta, 'utf-8');
            const data = JSON.parse(leer);
            const element = data.find((element) => parseInt(id) === element.id);

            if (!element) {
                return null;
            }
            return element;
        } catch (error) {
            console.log(error);
        }
    }

    async listarAll() {
        const leer = await fs.readFile(this.ruta, 'utf-8');
        return JSON.parse(leer);
    }

    async nuevoProducto(obj) {

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
            const leer = await fs.readFile(this.ruta, 'utf-8');
            let data = JSON.parse(leer);

            const filteredElements = data.filter(
                (element) => element.id !== id
            );
            const newElement = { id, ...element };
            data = [...filteredElements, newElement];

            await fs.writeFile(
                this.ruta,
                JSON.stringify(data, null, 2),
                'utf-8'
            );

            return newElement;
        } catch (error) {
            console.log(error);
        }
    }

    async borrar(id) {
        try {
            const leer = await fs.readFile(this.ruta, 'utf-8');
            const data = JSON.parse(leer);

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

    async borrarAll() {
        try {
            await fs.writeFile(this.ruta, JSON.stringify([], null, 2), 'utf-8');
            return await fs.readFile(this.ruta, 'utf-8');
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = ContenedorArchivo;
