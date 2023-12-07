async function excentrica_isquiotibiales(){
    let smoothed_data=[];
    let smoothed_data2=[];
    let globalx=[];
    let picos=[];
    let localizaciones=[];
    let combinada=[];
    let angulos=[];
    let angulos_max_force_smoothed_data=[];
    let angulos_max_force_smoothed_data2=[];
    let angulos_max_force_combinada=[];
    let angulo_quiebre=[];
    let tasa_perdida=[100];
//Funciones-----------------------------------------
//Crear matrices de nxm
    function crearMatrizDeCeros(n, m) {
        var matriz = [];

        for (var i = 0; i < n; i++) {
            var fila = [];
            for (var j = 0; j < m; j++) {
                fila.push(0);
            }
            matriz.push(fila);
        }

        return matriz;
    }
//Leer archivos de un documento .txt
    function leerArchivoEnMatriz(rutaArchivo) {
        return new Promise((resolve, reject) => {
            fs.readFile(rutaArchivo, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                try {
                    const lineas = data.trim().split('\n');
                    const matriz = lineas.map(linea => 
                        linea.trim().split(/\s+/).map(Number)
                    );
                    resolve(matriz);
                //console.log(matriz)
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
    const { Console } = require('console');


    function suavizarDatos(datos, ventana) {
        let resultado = [];

        for (let i = 0; i < datos.length; i++) {
            let suma = 0;
            let contador = 0;
        
            for (let j = i; j < i + ventana && j < datos.length; j++) {
                suma += datos[j];
                contador++;
            }
        
            resultado.push(suma / contador);
        }

        return resultado;
    }   

    function findPeaks(data, minPeakHeight, minPeakDistance) {
        let peaks = [];
        let locations = [];
        let max = Math.max(...data);

        for (let i = 0; i < data.length; i++) {
            if (data[i] > minPeakHeight * max) {
                // Comprobar si el pico es el más alto en la distancia mínima especificada
                let isPeak = true;
                let start = Math.max(0, i - minPeakDistance);
                let end = Math.min(data.length - 1, i + minPeakDistance);

                for (let j = start; j <= end; j++) {
                    if (data[i] < data[j] && j !== i) {
                        isPeak = false;
                        break;
                    }
                }

                if (isPeak) {
                    peaks.push(data[i]);
                    locations.push(i);
                    i += minPeakDistance; // Avanzar para respetar la distancia mínima entre picos
                }
            }
        }

        return { peaks, locations };
    }






//


//Constantes----------------------------

    const express = require('express');
    const app = express();
    const port = 3000;

    const PorcentajeAlturaMaxima = 0.6; // Umbral de altura m�nima para considerar un pico
    const MinimaDistanciaEntrePicos = 50; // Ajusta esta distancia seg�n tus necesidades
    const fs = require('fs');

    const ventana=10;// Suavizado de datos.


//const fs = require('fs');


//Main----------------------------------

    archivos = ['DiegoAlviz2208_1.txt', 'DiegoAlvis2208_2.txt', 'DiegoAlviz2308_1.txt', 'DiegoAlbis-2408_3.txt', 'DiegoAlbis-2508_4.txt']
    let tasa_perdida_labels=["Pre","Pos","24Hrs","48Hrs","72Hrs"]


    let maximos=crearMatrizDeCeros(2, archivos.length)




    for (var i = 0; i < (archivos.length); i++) {
        const data = leerArchivoEnMatriz(archivos[i]);
        const matriz=await data.then()
        smoothed_data.push(  suavizarDatos(matriz.map(fila => fila[0]), ventana) ); //  % Suaviza la primera columna
        smoothed_data2.push( suavizarDatos(matriz.map(fila => fila[1]), ventana) );// % Suaviza la segunda columna
        combinada.push(smoothed_data[i].map((valor, indice) => valor + smoothed_data2[i][indice]));
        angulos.push(matriz.map(fila => fila[2]));
        // Para la primera Columna---------------------
        let info=findPeaks(smoothed_data[i],PorcentajeAlturaMaxima,MinimaDistanciaEntrePicos);
        let pks=info.peaks;
        let locs=info.locations;
    // Para la segunda Columna--------------------
        let info2=findPeaks(smoothed_data2[i],PorcentajeAlturaMaxima,MinimaDistanciaEntrePicos);
        let pks2=info2.peaks;
        let locs2=info2.locations;
    //Combinada
        let info_combinada=findPeaks(combinada[i],PorcentajeAlturaMaxima,MinimaDistanciaEntrePicos);
        let pks_combinada=info_combinada.peaks;
        let locs_combinada=info_combinada.locations;        
    //Cargado de los datos-----
    picos.push([pks,pks2]);
    localizaciones.push([locs,locs2])
    //Maximos
    //% Encuentra el valor m�ximo de la primera columna de datos
        let maximo_archivo1 = Math.max(...smoothed_data[i]);
    //% Encuentra el valor m�ximo de la segunda columna de datos
        let maximo_archivo2 = Math.max(...smoothed_data2[i]);
    //% Almacena los valores m�ximos en la matriz
        //console.log(smoothed_data[i])
        maximos[0][i]=maximo_archivo1;
        maximos[1][i]=maximo_archivo2;
        globalx.push( Array.from({ length: smoothed_data[i].length }, (_, i) => i + 1) );
        //% Para hallar los angulos de fuerza maxima, utiliza este comando (pico maximo)
        angulos_max_force_combinada.push(locs_combinada.map(indice => angulos[i][indice])  )
        //% Para hallar el angulo de fuerza m�xima, utiliza este comando (pico m�ximo)
        angulo_quiebre.push(locs_combinada.map(indice => angulos[i][indice]+1)  )
        //% Para calcular la tasa de perdida, puedes usar una regla de tres. Por ejemplo:
    }

    for (var i = 0; i < (archivos.length-1); i++){
        tasa_perdida.push(100*((maximos[0][0]+maximos[1][0])-(maximos[0][i+1]+maximos[1][i+1]))/(maximos[0][0]+maximos[1][0]))
    }
    

    //tasa_perdida = ((maximos(1, 1) - maximos(1, 2)) / maximos(1, 1)) * 100 (ejemplo)
    //let tasa_perdida=100*(((maximos[0][0]+maximos[1][0])-(maximos[0][1]+maximos[1][1]))/(maximos[0][0]+maximos[1][0]))

    
    let alldata={
        datos_pierna_derecha: smoothed_data,
        datos_pierna_izquierda: smoothed_data2,
        datos_pierna_combinada: combinada,
        datos_angulo: angulos,
        datos_angulo_fuerza_maxima: angulos_max_force_combinada,
        datos_angulo_quiebre: angulo_quiebre,
        datos_tasa_perdida: tasa_perdida,
        datos_tasa_perdida_labels: tasa_perdida_labels,
        datos_x: globalx,
        datos_maximos: maximos,
        datos_picos: picos,
        datos_localizaciones: localizaciones
    };


    return { alldata };


}
exports.excentrica_isquiotibiales = excentrica_isquiotibiales;




