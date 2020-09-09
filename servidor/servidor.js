//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

var controlador = require('./controladores/competenciasController')


  // pedidos al backend
app.get('/competencias', controlador.Todascompetencias);
app.get('/competencias/:id', controlador.BuscarCompetencia);
app.get('/competencias/:id/peliculas', controlador.peliculasCompetencia);
app.post('/competencias/:idCompetencia/voto', controlador.cargarVoto)
app.get('/competencias/:idcompetencia/resultados', controlador.cargarResultados)
app.post('/competencias', controlador.crearCompetencia)
app.delete('/competencias/:idCompetencia/votos', controlador.reiniciarCompetencia)
app.get('/generos', controlador.competenciaGenero)
app.get('/directores', controlador.competenciaDirectores)
app.get('/actores', controlador.competenciaActor)
app.delete('/competencias/:idCompetencia', controlador.borrarCompetencia)
app.put('/competencias/:idCompetencia', controlador.editarCompetencia)

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

