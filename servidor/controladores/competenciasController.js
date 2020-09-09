var con = require('../lib/conexionbd')

var response ={
    id: '',
    data: ''
}

var data ={
    competencia:'',
    peliculas:'',
}

var competencia = {
    id :'',
    nombre: '',
    genero_id : '',
    director_id:'',
    actor_id:''
}

//funcion que obtiene todas las competencias
function Todascompetencias(req, res){

    var sql = `SELECT * from competencia`;

    con.query(sql, function(error,resultado,fields){
        if(error){
            console.log("Hubo un error en la consulta",error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        response = resultado;
        res.send(JSON.stringify(response));
    });    
}

function BuscarCompetencia(req,res){

    resulta = {
        id: '',
        nombre:'',
        genero_nombre: '',
        actor_nombre: '',
        director_nombre:''
    }

    var id = req.params.id;

    var sql1 = `SELECT competencia.id,competencia.nombre,actor.nombre as actor_nombre,director.nombre as director_nombre,genero.nombre as genero_nombre FROM competencia
    LEFT JOIN actor ON competencia.actor_id = actor.id 
    LEFT JOIN director ON competencia.director_id = director.id 
    LEFT JOIN genero ON competencia.genero_id = genero.id 
    WHERE competencia.id=${id}`;
    console.log(sql1);
    con.query(sql1, function(error,resultado){

        if(error){
            console.log("Hubo un error en la consulta",error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        resulta = resultado;
        console.log(resulta);
        res.send(resulta[0]);    

    })
}    

//funcion que ingresa a ver una competencia especifica
function peliculasCompetencia(req, res){
    var idcomp = req.params.id;

    var sql1 = `SELECT * FROM competencia WHERE id=${idcomp}`;
    con.query(sql1, function(error,resultado){

        if(error){
            console.log("Hubo un error en la consulta",error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        competencia = resultado[0];

        if(competencia.id != 0){

        data.competencia = competencia.nombre
        console.log(competencia)

        sql2 = `SELECT * FROM pelicula`
        var inner = ""
        var where = ""
    
        //CONSULTAS PARA LAS COMPETENCIAS PRE-CREADAS
        if(competencia.id<=9){
            switch(competencia.id){
            case 1:  sql2 = `SELECT * from pelicula ORDER BY RAND() LIMIT 0,2`;
                    break;
            case 2: sql2 = `SELECT * from pelicula where puntuacion<= 6 ORDER BY RAND() LIMIT 0,2`;
                     break;
            case 3: sql2 = `SELECT * from pelicula where puntuacion>= 6 ORDER BY RAND() LIMIT 0,2`;
                     break;
            case 4: sql2 = `SELECT * from pelicula where genero_string='Action' ORDER BY RAND() LIMIT 0,2`;
                     break;
            case 5: sql2 = `SELECT * from pelicula INNER JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id INNER JOIN actor ON actor.id = actor_pelicula.actor_id WHERE actor.id = '946' ORDER BY RAND() LIMIT 0,2 `;
                     break;
            case 6: sql2 = `SELECT * from pelicula WHERE director = 'Woody Allen' ORDER BY RAND() LIMIT 0,2`
                     break;
            case 7: sql2 = `SELECT * from pelicula where genero_string= 'comedy' ORDER BY RAND() LIMIT 0,2 `
                     break;
            case 8: sql2 = `SELECT * from pelicula where genero_string= 'Drama' ORDER BY RAND() LIMIT 0,2 `
                     break;
            case 9: sql2 = `SELECT * from pelicula where genero_string= 'horror' ORDER BY RAND() LIMIT 0,2 `
                     break;
            }
        }
        if(competencia.id>=10){
            //CONSULTA PARA LAS CONSULTAS CREADAS POR EL USUARIO
            if(competencia.genero_id!=0){
                where += ` genero_id = ${competencia.genero_id}`
            }
            if(competencia.director_id!=0){
                inner += `INNER JOIN director_pelicula ON pelicula.id = director_pelicula.pelicula_id inner join director on director.id = director_pelicula.director_id `
                where += `${where && ' AND '} director.id = ${competencia.director_id}`;
            }
            if(competencia.actor_id!=0){
                inner += `INNER JOIN actor_pelicula ON actor_pelicula.pelicula_id = pelicula.id INNER JOIN actor ON actor.id = actor_pelicula.actor_id `
                where += `${where && ' AND '} actor.id = ${competencia.actor_id}`;
            }
            if(inner){
                sql2 += ` ${inner} where ${where} ORDER BY RAND() LIMIT 0,2;`;
            }else{
                sql2 += ` where ${where} ORDER BY RAND() LIMIT 0,2;`;
            }
        }
        
        console.log(sql2);
        con.query(sql2, function(error,resultado){
            if(error){
                console.log("Hubo un error en la consulta",error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }
            data.peliculas = resultado;
            // console.log(resultado);
            if(data.peliculas==null){
                return res.status(404).send("NO EXISTEN PELICULAS CON EL CRITERIO DE BUSQUEDA");
            }
            res.send(JSON.stringify(data));
        });
        }else{
        return res.status(404).send("NO EXISTE LA COMPETENCIA SOLICITADA");
        }
    })
    
}

function cargarVoto(req,res){

    var data = { 
        pelicula_id :'',
        competencia_id: ''
        }
    
    var idcompetencia = req.params.idCompetencia;
    var idpelicula = req.body.idPelicula

    
    //primera consulta para obtener los datos de la competencia y comprobar que exista
    sql1 =  `SELECT id FROM competencia WHERE id=${idcompetencia}`;
    con.query(sql1, function(error,resultado){
        if(error){
            console.log("Hubo un error en la consulta",error.message);
            return res.status(404).send("Hubo un error en la consulta, No existe la Competencia");
        }
        
        data.competencia_id = resultado;

        if(resultado){
            var sql2 = `INSERT INTO voto (pelicula_id,competencia_id) VALUES (${idpelicula},${idcompetencia})`

            console.log(sql2)
            //segunda consulta para ingresar un voto a la pelicula seleccionada
            con.query(sql2, function(error,resultado){
                if(error){
                    console.log("Hubo un error en la consulta",error.message);
                    return res.status(404).send("Hubo un error en la consulta");
                }
                console.log(resultado);
                res.status(200).send("EL VOTO FUE CARGADO CON EXITO")
            })
        }else{
            console.log("Hubo un error en la consulta",error.message);
            return res.status(404).send("NO EXISTE LA COMPETENCIA SOLICITADA");

        }
    })

    
    
    

}

function cargarResultados(req,res){

    var idcompetencia = req.params.idcompetencia;

    var data = {
        competencia : '',
        resultados:{
            idpelicula: '',
            poster: '',
            titulo:'',
            votos:''
        }
    }

    sql1 = `SELECT nombre as competencia from competencia where id = ${idcompetencia}`
    
    console.log(sql1)
    con.query(sql1, function(error,resultado){
        if(error){
            console.log("Hubo un error en la consulta",error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        
        data.competencia = JSON.stringify(resultado[0].competencia);
     
    })


    // primera consulta para contar las peliculas mas votadas
    sql2 = `SELECT pelicula_id as idpelicula, COUNT(pelicula_id) AS votos, pelicula.titulo as titulo, pelicula.poster as poster FROM VOTO INNER JOIN pelicula ON voto.pelicula_id = pelicula.id WHERE competencia_id = ${idcompetencia} GROUP BY pelicula_id ORDER BY votos DESC LIMIT 0,3;`
    console.log(sql2)
    con.query(sql2, function(error,resultado){
        if(error){
            console.log("Hubo un error en la consulta",error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        
        data.resultados = resultado;
        res.send(JSON.stringify(data));
    })
}

function crearCompetencia(req,res){

    var competencia = {
        nombre:'',
        genero:'',
        director:'',
        actor:'',
        Guardar:''
     };

    competencia = req.body;

    console.log(competencia);

    sql1 = `SELECT * FROM competencia WHERE nombre='${competencia.nombre}'`;
    console.log(sql1)
      con.query(sql1, function(error,resultado){
            if(error){
                console.log("Hubo un error en la consulta",error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }    
            //console.log(resultado)
            if(resultado == ''){
                var parametros = '';
                var campos ='';

                var sql2 = `SET FOREIGN_KEY_CHECKS = 0; `
                con.query(sql2, function(error,resultado){
                    if(error){
                        console.log("Hubo un error en la consulta",error.message);
                        return res.status(404).send("Hubo un error en la consulta");
                    }    

                    campos += 'genero_id,director_id,actor_id';
                    parametros += `${parseInt(competencia.genero)},${parseInt(competencia.director)},${parseInt(competencia.actor)}`;

                    if(competencia.nombre){
                        campos +=`${campos && ','}nombre`;
                        parametros += `${parametros && ','}'${competencia.nombre}'`
                    }

                    //CONSULTA PARA VERIFICAR QUE EXISTAN 2 PELICULAS O MAS
                    sql4 = `SELECT * FROM pelicula`
                    var inner = ""
                    var where = ""
                        if(competencia.genero!=0){
                            where += ` genero_id = ${competencia.genero}`
                        }
                        if(competencia.director!=0){
                            inner += `INNER JOIN director_pelicula ON pelicula.id = director_pelicula.pelicula_id inner join director on director.id = director_pelicula.director_id `
                            where += `${where && ' AND '} director.id = ${competencia.director}`;
                        }
                        if(competencia.actor!=0){
                            inner += `INNER JOIN actor_pelicula ON actor_pelicula.pelicula_id = pelicula.id INNER JOIN actor ON actor.id = actor_pelicula.actor_id `
                            where += `${where && ' AND '} actor.id = ${competencia.actor}`;
                        }
                        if(inner){
                            sql4 += ` ${inner} where ${where};`;
                        }else{
                            sql4 += ` where ${where}`;
                        }
                    
                    console.log(sql4)
                    con.query(sql4, function(error,resultado){
                        if(error){
                            console.log("Hubo un error en la consulta",error.message);
                            return res.status(404).send("Hubo un error en la consulta");
                        }
                        console.log(resultado.length)
                        if(resultado.length >= 2){

                            //CONSULTA CREACION DE COMPETENCIA
                            sql3 = `INSERT INTO competencia(${campos}) VALUES (${parametros})`

                            con.query(sql3, function(error,resultado){
                                if(error){
                                    console.log("Hubo un error en la consulta",error.message);
                                    return res.status(404).send("Hubo un error en la consulta");
                                }    
        
                            console.log(resultado);})
                            res.status(200).send("COMPETENCIA CARGADA CON EXITO")
                    }
                    else{
                        return res.status(404).send("LA COMPETENCIA NO POSEE 2 PELICULAS MINIMAS");        
                    }       
                    });
                    
                })
            }else{
                return res.status(404).send("YA EXISTE UNA COMPETENCIA CON ESE NOMBRE");
            }

            })
}

function reiniciarCompetencia(req,res){

    var idcompetencia = req.params.idCompetencia;

    //consulta para validar que exista la competencia
    sql1 = `SELECT * FROM COMPETENCIA WHERE id=${idcompetencia}`;
    
      con.query(sql1, function(error,resultado){
            if(error){
                console.log("Hubo un error en la consulta",error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }    
            response = resultado;

            })

    //consulta para reinicar los votos de la competencia
    sql2 = `DELETE FROM voto WHERE competencia_id = '${idcompetencia}'`;
    if(response!= null){
        con.query(sql2, function(error,resultado){
            if(error){
                console.log("Hubo un error en la consulta",error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }    
            //console.log(resultado);
                res.status(200).send("LA COMPETENCIA HA SIDO REINICIADA")
            })
    }
}

function competenciaGenero(req,res){

    var genero = {
        id:'',
        nombre:''
    };
    
    sql1 = `SELECT * FROM genero`;

    con.query(sql1, function(error,resultado){
        if(error){
            console.log("Hubo un error en la consulta",error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }    
        genero = resultado;
        res.send(JSON.stringify(genero));
        })
}

function competenciaDirectores(req,res){
    var director = {
        id:'',
        nombre:''
    };
    
    sql1 = `SELECT * FROM director`;

    con.query(sql1, function(error,resultado){
        if(error){
            console.log("Hubo un error en la consulta",error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }    
        director = resultado;
        res.send(JSON.stringify(director));
        })

}

function competenciaActor(req,res){

    var actor = {
        id:'',
        nombre:''
    };
    
    sql1 = `SELECT * FROM actor`;

    con.query(sql1, function(error,resultado){
        if(error){
            console.log("Hubo un error en la consulta",error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }    
        actor = resultado;
        res.send(JSON.stringify(actor));
        })
}

function borrarCompetencia(req,res){

    id = req.params.idCompetencia;

    sql2 = `delete from competencia where id=${id}`
    console.log(sql2);
    con.query(sql2, function(error,resultado){
        if(error){
            console.log("Hubo un error en la consulta",error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }    
            console.log(resultado);
            res.status(200).send("LA COMPETENCIA HA SIDO EDITADA")
        })

}

function editarCompetencia(req,res){

    var id = req.params.idCompetencia;

    var nombre = req.body.nombre;

    sql2 = `update competencia set nombre = '${nombre}' where id=${id}`;  
        console.log(sql2);
        con.query(sql2, function(error,resultado){
            if(error){
                console.log("Hubo un error en la consulta",error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }    
            console.log(resultado);
                res.status(200).send("LA COMPETENCIA HA SIDO EDITADA")
            })

}

module.exports = {
    Todascompetencias: Todascompetencias,
    peliculasCompetencia: peliculasCompetencia,
    cargarVoto: cargarVoto,
    cargarResultados: cargarResultados,
    crearCompetencia: crearCompetencia,
    reiniciarCompetencia:reiniciarCompetencia,
    competenciaGenero: competenciaGenero,
    competenciaDirectores: competenciaDirectores,
    competenciaActor:competenciaActor,
    borrarCompetencia: borrarCompetencia,
    BuscarCompetencia:BuscarCompetencia,
    editarCompetencia:editarCompetencia
}