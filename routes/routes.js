const Consultas = require('../consultas.js')
const { Router } = require('express');
const route = Router()

// instancia
const consulta = new Consultas('localhost', 'root', '2605', 'crud');

// rutas registro
route.get('/registrar', async (req, res) => {
    try {
        res.render('index');
        await consulta.closeConect();
    } catch (error) {
        res.status(404).send('ERROR 404 ' + error)
        await consulta.closeConect();
    }
})

//Insert tabla registro
route.post('/registro', async (req, res) => {
    try {
        const { id, nombre, correo, pass } = req.body;
        req.session.nombre = nombre
        const result = await consulta.insert('clientes', `('${id}', '${nombre}', '${correo}', '${pass}')`)
        console.log(result)

        res.status(200).redirect('/iniciar-sesion');
        consulta.closeConect();
    } catch (error) {
        res.status(400).send('Error: ' + error.message);
        consulta.closeConect();
    }
})

// rutas iniciar sesión
route.get('/iniciar-sesion', async (req, res) => {
    try {
        res.render('inicioSesion');
        await consulta.closeConect();
    } catch (error) {
        res.status(404).send('ERROR 404 ' + error)
        await consulta.closeConect();
    }
})

// ruta que recibe los datos y hace validación inicio sesión
route.post('/inicio-sesion', async (req, res) => {
    try {
        const { correo, pass } = req.body;
        const result = await consulta.select('clientes')
        req.session.nombre = correo
        let usuarioAutenticado = false;

        result.forEach(resul => {
            if (correo === resul.correo_electronico && pass === resul.contraseña) {
                usuarioAutenticado = true;
            }
        });

        if (usuarioAutenticado) {
            res.redirect('/')
        } else {
            res.status(200).redirect('/iniciar-sesion');
        }

        consulta.closeConect();

    } catch (error) {
        res.status(400).send('Error: ' + error.message);
        await consulta.closeConect();
    }
})


//ruta home
route.get('/', async (req, res) => {
    try {
        const nombre = req.session.nombre
        if (nombre) {

            const resul = await consulta.select('peliculas')
            res.render('home', { peliculas: resul, nombre })
            await consulta.closeConect()
        } else {
            res.render('alertaSesion')
        }
    }
    catch (error) {
        res.status(400).send('Error:' + error.message)
        await consulta.closeConect()
    }
})

// eliminar pelicula
route.post('/eliminar', async (req, res) => {
    try {
        const { peliculaId } = req.body
        await consulta.delete('peliculas', `id = ${peliculaId}`)
        res.status(200).redirect('/');
        await consulta.closeConect()
    }
    catch (error) {
        res.status(400).send('Error:' + error.message)
        await consulta.closeConect()
    }
})

// ruta crear pelicula
route.get('/crear-pelicula', async (req, res) => {
    try {
        res.render('crearPelicula')
        await consulta.closeConect()
    }
    catch (error) {
        res.status(400).send('Error:' + error.message)
        await consulta.closeConect()
    }
})

// Insert tabla peliculas
route.post('/pelicula-creada', async (req, res) => {
    try {
        const { id, titulo, anio, director, duracion, poster, calificacion, genero } = req.body
        console.log(id, anio, duracion, calificacion)

        const result = await consulta.insert('peliculas', `('${id}', '${titulo}', ${anio}, '${director}', ${duracion}, '${poster}', ${calificacion}, '${genero}')`)
        res.status(200).redirect('/crear-pelicula');
        await consulta.closeConect();
    }
    catch (error) {
        res.status(400).send('Error:' + error.message)
        await consulta.closeConect()
    }
})

// ruta para modificar pelicula
route.get('/modificar-pelicula', (req, res) => {
    res.render('modificarPelicula')
})

// Update tabla peliculas
route.post('/pelicula-modificada', async (req, res) => {
    const data = req.body
    console.log(data)
    res.status(200).redirect('/modificar-pelicula')
    let updateString = '';
    for (let clave in data) {
        if (data.hasOwnProperty(clave)) {
            let value = data[clave];
            if (value != '') {
                // Verifica si el valor es un número
                const isNumeric = !isNaN(value) && value !== '' && value !== null;

                // Construir la parte de la cadena de actualización
                updateString += `${clave} = ${isNumeric ? value : `'${value}'`}, `;
            }
        }
    }
    // Eliminar la coma y el espacio al final de la cadena
    updateString = updateString.slice(0, -2);
    let result = await consulta.update('peliculas', updateString, `id = ${data.id}`);
    console.log(result)
})


route.get('/cerrar-sesion', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión: ' + err.message);
        }
        res.redirect('/');
    });
})

module.exports = route