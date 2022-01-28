const API_URL = 'http://localhost:5000/api/movies'


window.addEventListener('load', function() {

    const inputPelicula = document.querySelector('#nuebo');

    document.querySelector('.button').addEventListener('click', function(event) {
        event.preventDefault();
        console.log(inputPelicula.value);

        const nuevaPeli = {
            name: inputPelicula.value,
            watched: false
        }
        agregarPelicula(API_URL, nuevaPeli)
        // document.querySelector('.button').reset();
    })

    obtenerListadoPeliculas(API_URL);
})



//botones
//const botonAgregar = document.querySelector('.button');
const botonTick = document.querySelector('.not-watched');
const botonBorrar = document.querySelector('.delete');
// const inputPelicula = document.querySelector('#nuebo');

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


// Renderizado de películas pendientes

function renderizarPelis(lista) {

const nodoPeliculasPendientes = document.querySelector('.pending-movies');
const nodoPeliculasVistas = document.querySelector('.watched');

nodoPeliculasPendientes.innerHTML= "";
nodoPeliculasVistas.innerHTML= "";

const peliculasPendientes = lista.filter(pelicula => pelicula.watched);
const peliculasVistas = lista.filter(pelicula => !pelicula.watched);

lista.forEach(pelicula => {
    if (pelicula.watched === false) {
        peliculasVistas.innerHTML += `<li class="movie">
        <div class="description">
        <div class="name">${pelicula.name}</div>
        <div>
        <button><i id="${pelicula.id}" class="fas fa-undo-alt change"></id></button>
        <button><i id="${pelicula.id}" class="far fa-trash-alt"></id></button>
        </div>
        </div> 
        </li>`
    } else {
        peliculasPendientes.innerHTML += `<li class= "movie">
        <div class= "description">
        <div class= "name">"${pelicula.name}"</div>
        <div class="not-watched"><p>✓</p></div>
        <div class="delete"><p>✗</p></div>
        </div>
        </li>`
    }
});


}
 