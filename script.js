/* Titulo del Proyecto: pagina-pokemon.
Elaborado por: Carlos Leal.
Fecha de inicio: 24/09/24
Version: 1.5
Fecha de inicio de esta version: 27/09/24
Fecha de finalización de esta version: 28/09/24 */

// SELECCIONA LA UBICACION DONDE IRAN LAS TARJETAS
const cardContainer = document.getElementById('card-container');

// LISTA DE POKEMON QUE YO QUIERO MOSTRAR
const selectedPokemons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 25];

// VARIABLES PARA LA CONEXION CON LA API DE GOOGLE SHEETS
const apiKey = 'AIzaSyCJNLZzj_pS4jC3VZ4jc9EuSvPnYlyN6hY';
const sheetID = '1yyp3PBLbVy6S8SbomZy0vUgZpIRiZOIL6CJuH5nHajo';
const sheetName = 'pokemons'; // PESTAÑA DE LA HOJA DE CALCUL0
const sheetURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${apiKey}`;

// FUNCION QUE GENERA LAS TARJETAS SOLO PARA LOS POKÉMON SELECCIONADOS
function generateSelectedPokemonCards(pokemons, selectedPokemons) {
    cardContainer.innerHTML = ''; // LIMPIA EL CONTENEDOR CON CADA RECARGA

    // FILTRA LOS POKEMON POR LOS SELECCIONADOS
    const filteredPokemons = pokemons.filter(pokemon => selectedPokemons.includes(pokemon.number));

    // RECORRIDO DEL ARREGLO FILTRADO PARA GENERAR LAS TARJETAS
    filteredPokemons.forEach(pokemon => {
        console.log('Processing Pokémon:', pokemon);
        // ASIGNA EL COLOR AL POKEMON POR SU TIPO
        const typeClass = `tipo-${pokemon.type[0].toLowerCase()}`;

        // CREACION DE LA TARJETA EN HTML
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

        // INSERTA EL HTML GENERADO
        cardContainer.innerHTML += cardHTML;

        // OBTIENE EL NUMERO DEL POKEMON
        const cardImgWrapper = document.getElementById(`card-img-${pokemon.number}`);

        if (pokemon.type.length > 1) {
            // APLICA DEGRADADO AL COLOR SI EL POKEMON TIENE MAS DE UN TIPO
            const color1 = getTypeColor(pokemon.type[0]);
            const color2 = getTypeColor(pokemon.type[1]);
            cardImgWrapper.style.background = `linear-gradient(90deg, ${color1}, ${color2})`;
        } else {
            // APLICA EL COLOR SI SOLO TIENE UN TIPO
            cardImgWrapper.style.background = getTypeColor(pokemon.type[0]);
        }
    });
}

fetch(sheetURL)
    .then(response => response.json())
    .then(data => {
        pokemons = transformPokemonData(data.values.slice(1)); // IGNORA LA CABECERA

        // GENERA LAS TARJETAS SOLO PARA LOS POKÉMON QUE QUIERES MOSTRAR
        generateSelectedPokemonCards(pokemons, selectedPokemons);
    })
    .catch(error => console.error('Error al obtener los datos:', error));

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
    document.getElementById('pokemonHeight').innerText = pokemon.h.toFixed(2); // Altura en metros
    document.getElementById('pokemonWeight').innerText = pokemon.w.toFixed(1); // Peso en kilos
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
