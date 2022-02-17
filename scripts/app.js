const API_URL = 'http://localhost:5000/api/movies'


window.addEventListener('load', function() {
   
    const inputPelicula = document.querySelector('#nuebo');

    document.querySelector('.button').addEventListener('click', function(event) {
        event.preventDefault();
        console.log(inputPelicula.value);

        const nuevaPeli = {
            name: inputPelicula.value,
        }

        agregarPelicula(API_URL, nuevaPeli)
        document.querySelector('.new-movie').reset();
    })

    obtenerListadoPeliculas(API_URL);

})



//botones
//const botonAgregar = document.querySelector('.button');
const botonTick = document.querySelector('.not-watched');
const botonBorrar = document.querySelector('.delete');
const inputPelicula = document.querySelector('#nuebo');
const botonVista = document.querySelectorAll('.vista')


//agregar peli 
function agregarPeliSola(peli) {
    const nodoPeliculasPendientes = document.querySelector('.pending-movies');

    nodoPeliculasPendientes.innerHTML += `<li class= "movie" data-id="${peli.id}">
    <div class= "description">
    <div class= "name">${peli.name}</div>
    <div class="not-watched"><p>✓</p></div>
    <div class="delete"><p class='borro'>✗</p></div>
    </div>
    </li>`
}


// POST: crear película pendiente 
function agregarPelicula (url, payload) {
    const config = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
    }

    fetch(url, config)
    .then (response => response.json())
    .then (response => { if(response.status == 200) {
        console.log(response);
        obtenerListadoPeliculas(`${API_URL}`) 
    } else {
        showError(); 
    } 
        })     
    .catch(error => console.log(error))
    
    //todo esto está mal pero no lo puedo arreglar.
} 

// GET: traer películas 
function obtenerListadoPeliculas (url) {
    const config = {
        method: 'GET',
        headers: {
             'Content-type': 'application/json'
        }
    }

    fetch(url, config)
    .then(respuesta => respuesta.json())
    .then(data => {
        console.log(data);
        renderizarPelis(data);
    })
}


//DELETE: borrar peliculas de forma permanente en pendientes o vistas.

function registrarListenerEliminar (boton, tag) {
    const botonEliminar = document.querySelectorAll(boton)


    botonEliminar.forEach( boton => {
        boton.addEventListener('click', function (event) {
            const id = event.target.closest(tag).getAttribute('data-id')
            const url = `${API_URL}/${id}`

            const config = {
                method: 'DELETE',
            }
            
            fetch(url, config)
            .then(respuesta => respuesta.json())
            .then(data => {
                console.log(data);
                obtenerListadoPeliculas(`${API_URL}`);
            })

        })
    })

}

// PUT: modificaciones en las peliculas de pendientes a vistas y visceversa.

function registrarListenerVistaPendiente (boton, tag, visibilidad) {
    const botonPendiente = document.querySelectorAll(boton)
    
    botonPendiente.forEach(boton => {
        boton.addEventListener('click', function (event) {
            const id = event.target.closest(tag).getAttribute('data-id')

            const url = `${API_URL}/${id}`

            const rewatchPeli = {
                watched: visibilidad
            }


            const config = {
                method: 'PUT',
                headers:  {
                        'Content-type': 'application/json'
                    },

                body: JSON.stringify(rewatchPeli)
            }

            fetch (url, config)
            .then(respuesta => respuesta.json())
            .then(text => {
                console.log(text);
                obtenerListadoPeliculas(`${API_URL}`);
            })
            .catch(error => {
                console.log(error);
            })

        })
    })
}




// Renderizado de películas pendientes y vistas

function renderizarPelis(lista) {

    const nodoPeliculasPendientes = document.querySelector('.pending-movies');
    const nodoPeliculasVistas = document.querySelector('.watched');

    nodoPeliculasPendientes.innerHTML= "";
    nodoPeliculasVistas.innerHTML= "";

    lista.forEach(pelicula => {
        if (pelicula.watched) {
            nodoPeliculasVistas.innerHTML += `<ul class="watched" data-id="${pelicula.id}">
            <div class="description">
            <div class="name">${pelicula.name}</div>
            <div class="conteiner">
            <button class="undo"><i class="fas fa-undo-alt change"></i></button>
            <button class= "trash"><i class="far fa-trash-alt"></i></button>
            <div class= "time">${formatDate(pelicula.updatedAt)}</div>
            </div>
            </div> 
            </ul>`
        } else {
            nodoPeliculasPendientes.innerHTML += `<li class= "movie" data-id="${pelicula.id}">
            <div class= "description">
            <div class= "name">${pelicula.name}</div>
            <div class="not-watched"><p>✓</p></div>
            <div class="delete"><p class='borro'>✗</p></div>
            </div>
            </li>`
        }
    });

    registrarListenerVistaPendiente('.not-watched', 'li', true)
    registrarListenerVistaPendiente('.undo', 'ul', false)
    registrarListenerEliminar('.borro', 'li')
    registrarListenerEliminar('.trash', 'ul')

}

// Fecha 

function formatDate(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleDateString()
}


// Mostrar error 
//Esto es lo que quiero mostrar cuando se hace produce el error. El problema es que creo que no 
//se está haciendo el catch error cuando ejecuto.
function showError() {
    document.querySelector('#error-container').classList.remove('hidden')
    document.querySelector('#error-container').innerHTML = '<small>El campo ingresado no puede estar vacío o la película ya existe</small>'
    
}

