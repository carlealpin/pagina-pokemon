/* Titulo del Proyecto: pagina-pokemon.
Elaborado por: Carlos Leal.
Fecha de inicio: 24/09/24
Version: 1.2 
Fecha de inicio de esta version: 26/09/24
Fecha de finalización de esta version: 26/09/24 */

// SELECCIONA LA UBICACION DONDE IRAN LAS TARJETAS
const cardContainer = document.getElementById('card-container');

// URL de la API de Google Sheets (debes reemplazar 'YOUR_API_KEY' con tu clave API y 'ID_DE_TU_HOJA' con el ID de tu hoja)
const apiKey = 'AIzaSyCJNLZzj_pS4jC3VZ4jc9EuSvPnYlyN6hY';
const sheetID = '1yyp3PBLbVy6S8SbomZy0vUgZpIRiZOIL6CJuH5nHajo';
const sheetName = 'pokemons'; // Nombre de la pestaña de la hoja de cálculo
const sheetURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${apiKey}`;

// FUNCION QUE GENERA LAS TARJETAS
function generatePokemonCards(pokemons) {
    cardContainer.innerHTML = ''; // Limpia el contenedor con cada recarga

    // Recorrido del arreglo de información de Pokémon
    pokemons.forEach(pokemon => {
        console.log('Processing Pokémon:', pokemon);
        // Asigna el color del tipo de Pokémon
        const typeClass = `tipo-${pokemon.type[0].toLowerCase()}`;

        // Creación de HTML de la tarjeta
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

        // Inserta el HTML generado
        cardContainer.innerHTML += cardHTML;

        // Aplicar el degradado o el color al contenedor de la imagen
        const cardImgWrapper = document.getElementById(`card-img-${pokemon.number}`);

        if (pokemon.type.length > 1) {
            // Si tiene dos tipos, aplicar un degradado entre ambos colores
            const color1 = getTypeColor(pokemon.type[0]);
            const color2 = getTypeColor(pokemon.type[1]);
            cardImgWrapper.style.background = `linear-gradient(90deg, ${color1}, ${color2})`;
        } else {
            // Si solo tiene un tipo, usar el color correspondiente
            cardImgWrapper.style.background = getTypeColor(pokemon.type[0]);
        }
    });
}

// FUNCION PARA MOSTRAR EL MODAL
function showPokemonDetails(pokemonNumber) {
    // ENCUENTRA EL POKEMON POR SU NUMERO
    const pokemon = pokemons.find(p => p.number === pokemonNumber);

    // Obtener el encabezado del modal
    const modalHeader = document.getElementById('modal-header');

    // Si el Pokémon tiene más de un tipo, creamos un degradado, si no, usamos un solo color
    if (pokemon.type.length > 1) {
        const color1 = getTypeColor(pokemon.type[0]); // Color del primer tipo
        const color2 = getTypeColor(pokemon.type[1]); // Color del segundo tipo

        // Aplicar el degradado como fondo al encabezado del modal
        modalHeader.style.background = `linear-gradient(90deg, ${color1}, ${color2})`;
    } else {
        // Si tiene solo un tipo, asignamos un solo color de fondo
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

// Función para obtener el color del tipo de Pokémon
function getTypeColor(type) {
    switch (type.toLowerCase()) {
        case 'agua': return 'rgba(41, 128, 239, 0.5)';
        case 'fuego': return 'rgba(240, 128, 48, 0.5)';
        case 'planta': return 'rgba(63, 161, 41, 0.5)';
        case 'veneno': return 'rgba(145, 65, 203, 0.5)';
        case 'volador': return 'rgba(129, 185, 239, 0.5)';
        // Agrega más casos para otros tipos de Pokémon
        default: return 'rgba(0, 0, 0, 0)'; // Color por defecto si no se encuentra el tipo
    }
}

// FUNCION PARA TRANSFORMAR LOS DATOS OBTENIDOS DE GOOGLE SHEETS
function transformPokemonData(data) {
    return data.map(row => {
        return {
            region: row[0],           // Región del Pokémon
            number: parseInt(row[1]), // Número del Pokémon
            name: row[2],             // Nombre del Pokémon
            type: row[3].split(','),  // Tipos del Pokémon, separados por comas
            img: row[4],              // URL de la imagen
            des: row[5],              // Descripción del Pokémon
            hab: row[6].split(','),   // Habilidades del Pokémon, separadas por comas
            h: parseFloat(row[7]),    // Altura en metros
            w: parseFloat(row[8])     // Peso en kilogramos
        };
    });
}

// FUNCION PARA OBTENER LOS DATOS DE GOOGLE SHEETS
fetch(sheetURL)
  .then(response => response.json())
  .then(data => {
      pokemons = transformPokemonData(data.values.slice(1)); // Ignora la primera fila (cabecera)
      generatePokemonCards(pokemons); // Genera las tarjetas con los datos obtenidos
  })
  .catch(error => console.error('Error al obtener los datos:', error));
