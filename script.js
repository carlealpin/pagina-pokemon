/* Titulo del Proyecto: pagina-pokemon.
Elaborado por: Carlos Leal.
Fecha de inicio: 24/09/24
Version: 1.3
Fecha de inicio de esta version: 26/09/24
Fecha de finalización de esta version: 27/09/24 */

/* ARREGLO DE INFORMACION DE POKEMON */
const pokemons = [
    /* KANTO */
    { region: "Kanto", number: 1, name: "Bulbasaur", type: ["Planta", "Veneno"], img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png", des: "Tras nacer, crece alimentándose durante un tiempo de los nutrientes que contiene el bulbo de su lomo.", hab: ["Espesura"], h: 0.7, w: 6.9 },
    { region: "Kanto", number: 2, name: "Ivysaur", type: ["Planta", "Veneno"], img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/002.png", des: "Cuanta más luz solar recibe, más aumenta su fuerza y más se desarrolla el capullo que tiene en el lomo.", hab: ["Espesura"], h: 1.0, w: 13.0 },
    { region: "Kanto", number: 3, name: "Venusaur", type: ["Planta", "Veneno"], img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/003.png", des: "Puede convertir la luz del sol en energía. Por esa razón, es más poderoso en verano.", hab: ["Espesura"], h: 2.0, w: 100.0 },
    { region: "Kanto", number: 4, name: "Charmander", type: ["Fuego"], img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png", des: "La llama de su cola indica su fuerza vital. Si está débil, la llama arderá más tenue.", hab: ["Mar Llamas"], h: 0.6, w: 8.5 },
    { region: "Kanto", number: 5, name: "Charmeleon", type: ["Fuego"], img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/005.png", des: "Al agitar su ardiente cola, eleva poco a poco la temperatura a su alrededor para sofocar a sus rivales.", hab: ["Mar Llamas"], h: 1.1, w: 19.0 },
    { region: "Kanto", number: 6, name: "Charizard", type: ["Fuego", "Volador"], img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png", des: "Cuando se enfurece de verdad, la llama de la punta de su cola se vuelve de color azul claro.", hab: ["Mar Llamas"], h: 1.7, w: 90.5 },
    { region: "Kanto", number: 7, name: "Squirtle", type: ["Agua"], img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png", des: "Tras nacer, se le hincha el lomo y se le forma un caparazón. Escupe poderosa espuma por la boca.", hab: ["Torrente"], h: 0.5, w: 9.0 },
    { region: "Kanto", number: 8, name: "Wartortle", type: ["Agua"], img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/008.png", des: "Tiene una cola larga y peluda que simboliza la longevidad y lo hace popular entre los mayores.", hab: ["Torrente"], h: 1.0, w: 22.5 },
    { region: "Kanto", number: 9, name: "Blastoise", type: ["Agua"], img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/009.png", des: "Aumenta de peso deliberadamente para contrarrestar la fuerza de los chorros de agua que dispara.", hab: ["Torrente"], h: 1.6, w: 85.5 },
    { region: "Kanto", number: 25, name: "Pikachu", type: ["Eléctrico"], img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png", des: "Cuando se enfada, este Pokémon descarga la energía que almacena en el interior de las bolsas de las mejillas.", hab: ["Elec. Estática"], h: 0.4, w: 6.0 },
    //{ region: "", number: , name: "", type: [""], img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png", des: "C", hab: [""], h: , w:  },
];

// SELECCIONA LA UBICACION DONDE IRAN LAS TARJETAS
const cardContainer = document.getElementById('card-container');
// CAPTURA EL INPUT DE LA BARRA DE BUSQUEDA
const searchInput = document.getElementById('pokemon-search');

// FUNCION QUE GENERA LAS TARJETAS
function generatePokemonCards(pokemons) {
    cardContainer.innerHTML = ''; // Limpia el contenedor con cada recarga

    // Recorrido del arreglo de información de Pokémon
    pokemons.forEach(pokemon => {
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

// EVENTO PARA FILTRAR LOS POKEMON MIENTRAS SE ESCRIBE
searchInput.addEventListener('input', function () {
    const searchQuery = searchInput.value.toLowerCase();

    // Filtra los Pokémon que coincidan con el nombre o número
    const filteredPokemons = pokemons.filter(pokemon => {
        return pokemon.name.toLowerCase().includes(searchQuery) ||
            pokemon.number.toString().includes(searchQuery);
    });

    // Regenera las tarjetas con los Pokémon filtrados
    generatePokemonCards(filteredPokemons);
});

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
        case 'eléctrico': return 'rgba(250, 192, 0, 0.5)';
        // Agrega más casos para otros tipos de Pokémon
        default: return 'rgba(0, 0, 0, 0)'; // Color por defecto si no se encuentra el tipo
    }
}


// LLAMADA DE LA FUNCION QUE GENERA LA TARJETA
generatePokemonCards(pokemons);
