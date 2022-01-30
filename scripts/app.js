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

// Renderizado de películas pendientes

function renderizarPelis(lista) {

const nodoPeliculasPendientes = document.querySelector('.pending-movies');
const nodoPeliculasVistas = document.querySelector('.watched');

nodoPeliculasPendientes.innerHTML= "";
nodoPeliculasVistas.innerHTML= "";

lista.forEach(pelicula => {
    if (pelicula.watched) {
        nodoPeliculasVistas.innerHTML += `<li class="movie" data-id="${pelicula.id}">
        <div class="description">
        <div class="name">${pelicula.name}</div>
        <div>
        <button><i class="fas fa-undo-alt change"></i></button>
        <button><i class="far fa-trash-alt"></i></button>
        </div>
        </div> 
        </li>`
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

}
 