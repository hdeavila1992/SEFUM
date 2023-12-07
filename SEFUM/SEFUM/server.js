const express = require('express');
const app = express();
const port = 3000;
//const excentrica_isquiotibiales=require('./public/excentrica_isquiotibiales'); 
const { excentrica_isquiotibiales } = require('./public/excentrica_isquiotibiales');
//const hola=require("./public/test")

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

//Función principal 
app.get('/datos-grafico', async (req, res) => {
    try {
        const {alldata} = await excentrica_isquiotibiales(); // Espera a que se resuelva la promesa
        res.json({ alldata });
        //console.log("Enviando datos:", alldata);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).send('Error al obtener los datos');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});module.exports = excentrica_isquiotibiales;

