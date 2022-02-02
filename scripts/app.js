const API_URL = 'http://localhost:3000/api/movies'


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
    .then(respuesta => respuesta.json())
    .then (data => {
        console.log(data);
    })
    .catch(error => {
        console.log(error);
    })
}

// GET: traer películas 
function obtenerListadoPeliculas (url) {
    const config = {
        method: 'GET',
        // headers: {
        //     'Content-type': 'application/json'
        // }
    }

    fetch(url, config)
    .then(respuesta => respuesta.json())
    .then(data => {
        console.log(data);
        renderizarPelis(data);
    })
}


// DELETE: eliminar peliculas

function eliminarPelicula() {
    const botonEliminar = document.querySelectorAll('.borro')


    botonEliminar.forEach( boton => {
        boton.addEventListener('click', function (event) {
            const id = event.target.closest('li').getAttribute('data-id')
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


// Función para pasar de pendiente a vista PUT
//Problemas: creo que el problema viene de la API y es que me pide que pase si o si un "name" en el payload,
//el tema es que no se como pasarle un nombre. Intenté con text content para traer el contenido que tiene 
//el nodo pero creo que lo estoy haciendo mal porque no me trae lo que está renderizado de la API sino
//lo que yo ya tengo escrito como ejemplo en el HTML.
// Creo que el problema también está que en la configuración de la API que hice no tengo la manera de poner que 
// "watched" es algo que se requiere para hacer el cambio de estado y por eso me lo rechaza cuando hago el fetch.

function peliculaVista () {
    const botonVista = document.querySelectorAll('.not-watched')
   // console.log(botonVista);


    botonVista.forEach (boton => {
        boton.addEventListener('click', function (event) {
            const id = event.target.closest('li').getAttribute('data-id')

            // const name = document.querySelector('.nombre')
            // console.log(name.textContent);

            const url = `${API_URL}/${id}`

            const nuevaPeli = {
                vista: true
            }
            
            const config = {
                method: 'PUT',
                headers:  {
                        'Content-type': 'application/json'
                    },

                body: JSON.stringify(nuevaPeli)
            }

            fetch (url, config)
            .then(respuesta => respuesta.json())
            // .then(respuesta => respuesta.text())
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

// Modificar pelicula de vista a pendiente. Despues buscar forma de armar la misma funcion que la anterior asi no repito el mismo codigo

function vistaAPendiente(){
    const botonPendiente = document.querySelectorAll('.undo')
    
    botonPendiente.forEach(boton => {
        boton.addEventListener('click', function (event) {
            const id = event.target.closest('ul').getAttribute('data-id')

            const url = `${API_URL}/${id}`

            const rewatchPeli = {
                vista: false
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


//Eliminar forever
function eliminarForever () {
    const botonEliminar = document.querySelectorAll('.trash')


    botonEliminar.forEach( boton => {
        boton.addEventListener('click', function (event) {
            const id = event.target.closest('ul').getAttribute('data-id')
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
        <div>
        <button class="undo"><i class="fas fa-undo-alt change"></i></button>
        <button class= "trash"><i class="far fa-trash-alt"></i></button>
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
eliminarPelicula();
peliculaVista();
vistaAPendiente();
eliminarForever();

}
