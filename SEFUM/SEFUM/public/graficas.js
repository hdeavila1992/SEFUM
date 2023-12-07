fetch('/datos-grafico')
.then(response => response.json())
    .then(datos => {
        var ctx = document.getElementById('Fuerza_Excentrica').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.alldata.datos_x[0] ,
                datasets: [{
                    label: 'Fuerza pierna derecha versus indice de dato',
                    data: datos.alldata.datos_pierna_derecha[0],
                    // Estilos del gráfico...
                },
                {
                    label: 'Fuerza pierna izquierda versus indice de dato',
                    data: datos.alldata.datos_pierna_izquierda[0],
                    // Estilos del gráfico...
                    
                },
                {
                    label: 'Fuerza combinada versus indice de dato',
                    data: datos.alldata.datos_pierna_combinada[0],
                    // Estilos del gráfico...
                    
                }
            ]
            },
            // Opciones del gráfico...
        });
    })
    .catch(error => console.error('Error al obtener datos:', error));

fetch('/datos-grafico')
.then(response => response.json())
    .then(datos => {
        var ctx = document.getElementById('Tendencias').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datos.alldata.datos_tasa_perdida_labels,
                datasets: [{
                    label: 'Tasa de perdida',
                    data: datos.alldata.datos_tasa_perdida,
                    // Estilos del gráfico...
                    borderDash: [5, 5],
                    pointStyle: 'rect',
                    pointRadius: 10
                }
            ]
            },
            // Opciones del gráfico...
        });
    })
    .catch(error => console.error('Error al obtener datos:', error));