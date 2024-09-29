/* Titulo del Proyecto: pagina-pokemon.
Elaborado por: Carlos Leal.
Fecha de inicio: 24/09/24
Version: 1.5
Fecha de inicio de esta version: 27/09/24
Fecha de finalización de esta version: 28/09/24 */

// SELECCIONA LA UBICACION DONDE IRAN LAS TARJETAS
const cardContainer = document.getElementById('card-container');
// CAPTURA EL INPUT DE LA BARRA DE BUSQUEDA
const searchInput = document.getElementById('pokemon-search');
// SELECCIONA LA UBICACION DEL BOTON CARGAR MAS
const loadMoreBtn = document.getElementById('load-more');

// VARIABLES PARA LA CONEXION CON LA API DE GOOGLE SHEETS
const apiKey = 'AIzaSyCJNLZzj_pS4jC3VZ4jc9EuSvPnYlyN6hY';
const sheetID = '1yyp3PBLbVy6S8SbomZy0vUgZpIRiZOIL6CJuH5nHajo';
const sheetName = 'pokemons'; // PESTAÑA DE LA HOJA DE CALCUL0
const sheetURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${apiKey}`;

// VARIABLES DE CONTROL PARA LA PAGINACIÓN
let currentIndex = 0; // ÍNDICE ACTUAL DE PÁGINA
const pageSize = 30; // NÚMERO DE POKÉMON POR CARGA

// FUNCIÓN QUE GENERA LAS TARJETAS, LIMITANDO LA CANTIDAD SEGÚN EL ÍNDICE ACTUAL
function generatePokemonCards(pokemons, append = false) {
    if (!append) {
        cardContainer.innerHTML = ''; // LIMPIA EL CONTENEDOR SOLO SI NO SE ESTÁ AÑADIENDO MÁS
    }

    if (pokemons.length === 0) {

        const totalPokemons = 0; // TOTAL DE POKEMON ENCONTRADOS
        const pokemonCountElement = document.getElementById('pokemon-count'); // SELECCIONA LA UBICACION DEL CONTADOR
        pokemonCountElement.textContent = `Se encontraron ${totalPokemons} Pokémon en nuestra base de datos.`;

        // MENSAJE DE QUE NO SE ENCONTRÓ POKÉMON
        cardContainer.innerHTML = `
            <div class="d-flex justify-content-center align-items-center" style="height: 40vh; width: 100%;">
                <div class="alert alert-warning text-center p-5" role="alert" style="font-size: 1.5rem; max-width: 400px;">
                    No se encontraron Pokémon con ese nombre o número. Verifica el nombre y no coloques ceros antes del número.
                </div>
            </div>
        `;
        return;        
    }

    // RECORRIDO DEL ARREGLO LIMITADO DE POKÉMON SEGÚN LA PÁGINA ACTUAL
    const slicedPokemons = pokemons.slice(currentIndex, currentIndex + pageSize);
    slicedPokemons.forEach(pokemon => {
        console.log('Processing Pokémon:', pokemon);

        // ASIGNA EL COLOR AL POKÉMON POR SU TIPO
        const typeClass = `tipo-${pokemon.type[0].toLowerCase()}`;

        // CREACIÓN DE LA TARJETA EN HTML
        const cardHTML = `
            <div class="col">
                <div class="card h-100" data-bs-toggle="modal" data-bs-target="#pokemonModal" onclick="showPokemonDetails(${pokemon.number})">
                    <div class="card-img-wrapper" id="card-img-${pokemon.number}">
                        <img src="${pokemon.img}" class="card-img-top" alt="${pokemon.name}">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${pokemon.name} (#${pokemon.number.toString().padStart(4, '0')})</h5>
                        <p class="card-text">Tipo: ${pokemon.type.join(', ')}</p>
                    </div>
                </div>
            </div>
        `;

        const totalPokemons = pokemons.length; // TOTAL DE POKEMON ENCONTRADOS
        const pokemonCountElement = document.getElementById('pokemon-count'); // SELECCIONA LA UBICACION DEL CONTADOR
        pokemonCountElement.textContent = `Se encontraron ${totalPokemons} Pokémon en nuestra base de datos.`;

        // INSERTA EL HTML GENERADO
        cardContainer.innerHTML += cardHTML;

        // OBTIENE EL NÚMERO DEL POKÉMON
        const cardImgWrapper = document.getElementById(`card-img-${pokemon.number}`);

        if (pokemon.type.length > 1) {
            // APLICA DEGRADADO AL COLOR SI EL POKÉMON TIENE MÁS DE UN TIPO
            const color1 = getTypeColor(pokemon.type[0]);
            const color2 = getTypeColor(pokemon.type[1]);
            cardImgWrapper.style.background = `linear-gradient(90deg, ${color1}, ${color2})`;
        } else {
            // APLICA EL COLOR SI SOLO TIENE UN TIPO
            cardImgWrapper.style.background = getTypeColor(pokemon.type[0]);
        }
    });

    // ACTUALIZA EL ÍNDICE PARA LA PRÓXIMA PÁGINA
    currentIndex += pageSize;

    // VERIFICA SI HAY MÁS POKÉMON POR CARGAR
    if (currentIndex >= pokemons.length) {
        loadMoreBtn.style.display = 'none'; // OCULTA EL BOTÓN SI YA NO HAY MÁS
    } else {
        loadMoreBtn.style.display = 'block'; // MUESTRA EL BOTÓN SI HAY MÁS
    }
}

// EVENTO PARA CARGAR MÁS POKÉMON
loadMoreBtn.addEventListener('click', () => {
    generatePokemonCards(pokemons, true); // AÑADE MÁS TARJETAS
});

// EVENTO PARA FILTRAR LOS POKÉMON MIENTRAS SE ESCRIBE
searchInput.addEventListener('input', function () {
    const searchQuery = searchInput.value.toLowerCase();

    // FILTRA LOS POKÉMON QUE COINCIDAN CON EL NOMBRE O NÚMERO
    const filteredPokemons = pokemons.filter(pokemon => {
        return pokemon.name.toLowerCase().includes(searchQuery) ||
            pokemon.number.toString().includes(searchQuery);
    });

    // REINICIA EL ÍNDICE Y GENERA LAS TARJETAS CON LA BÚSQUEDA
    currentIndex = 0;
    generatePokemonCards(filteredPokemons);
});

// FUNCION PARA MOSTRAR EL MODAL
function showPokemonDetails(pokemonNumber) {
    // ENCUENTRA EL POKEMON POR SU NUMERO
    const pokemon = pokemons.find(p => p.number === pokemonNumber);

    // OBTENER EL ENCABEZADO DEL MODAL
    const modalHeader = document.getElementById('modal-header');

    // APLICA DEGRADADO AL ENCABEZADO DEL MODAL SI EL POKEMON TIENE MAS DE UN TIPO
    if (pokemon.type.length > 1) {
        const color1 = getTypeColor(pokemon.type[0]);
        const color2 = getTypeColor(pokemon.type[1]);

        // APLICA EL DEGRADADO SI TIENE DOS TIPOS
        modalHeader.style.background = `linear-gradient(90deg, ${color1}, ${color2})`;
    } else {
        // SI TIENE SOLO UN TIPO SE ASIGNA EL COLOR
        modalHeader.style.background = getTypeColor(pokemon.type[0]);
    }

    // RELLENA INFORMACION EN EL MODAL
    document.getElementById('pokemonModalLabel').innerText = `${pokemon.name} (#${pokemon.number.toString().padStart(4, '0')})`;
    document.getElementById('pokemonImage').src = pokemon.img;
    document.getElementById('pokemonDescription').innerText = pokemon.des;
    document.getElementById('pokemonRegion').innerText = pokemon.region;
    document.getElementById('pokemonHab').innerText = pokemon.hab.join(', ');
    document.getElementById('pokemonHeight').innerText = pokemon.h.toFixed(2);
    document.getElementById('pokemonWeight').innerText = pokemon.w.toFixed(1);
    document.getElementById('pokemonType').innerText = pokemon.type.join(', ');
}

// FUNCION PARA OBTENER EL COLOR DEL TIPO
function getTypeColor(type) {
    switch (type.toLowerCase()) {
        case 'acero': return 'rgba(96, 161, 184, 0.5)';
        case 'agua': return 'rgba(41, 128, 239, 0.5)';
        case 'bicho': return 'rgba(145, 161, 25, 0.5)';
        case 'dragón': return 'rgba(80, 96, 225, 0.5)';
        case 'eléctrico': return 'rgba(250, 192, 0, 0.5)';
        case 'fantasma': return 'rgba(112, 65, 112, 0.5)';
        case 'fuego': return 'rgba(240, 128, 48, 0.5)';
        case 'hada': return 'rgba(239, 112, 239, 0.5)';
        case 'hielo': return 'rgba(61, 206, 243, 0.5)';
        case 'lucha': return 'rgba(255, 128, 0, 0.5)';
        case 'normal': return 'rgba(159, 161, 159, 0.5)';
        case 'planta': return 'rgba(63, 161, 41, 0.5)';
        case 'psíquico': return 'rgba(239, 65, 121, 0.5)';
        case 'roca': return 'rgba(175, 169, 129, 0.5)';
        case 'siniestro': return 'rgba(98, 77, 78, 0.5)';
        case 'tierra': return 'rgba(145, 81, 33, 0.5)';
        case 'veneno': return 'rgba(145, 65, 203, 0.5)';
        case 'volador': return 'rgba(129, 185, 239, 0.5)';

        default: return 'rgba(0, 0, 0, 0)'; // COLOR POR DEFECTO EN CASO DE QUE NO SE ENCUENTRE EL TIPO
    }
}

// FUNCION PARA TRANSFORMAR LOS DATOS OBTENIDOS DE GOOGLE SHEETS
function transformPokemonData(data) {
    return data.map(row => {
        return {
            region: row[0],
            number: parseInt(row[1]),
            name: row[2],
            type: row[3].split(','),
            img: row[4],
            des: row[5],
            hab: row[6].split(','),
            h: parseFloat(row[7]),
            w: parseFloat(row[8])
        };
    });
}

// FUNCION PARA OBTENER LOS DATOS DE GOOGLE SHEETS
fetch(sheetURL)
    .then(response => response.json())
    .then(data => {
        pokemons = transformPokemonData(data.values.slice(1)); // IGNORA LA CABECERA
        generatePokemonCards(pokemons); // GENERA LAS TARJETAS DE LOS DATOS OBTENIDOS
    })
    .catch(error => console.error('Error al obtener los datos:', error));
