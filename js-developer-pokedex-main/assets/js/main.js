const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 151;
const limit = 10;
let offset = 0;
let pokemons = [];

function convertPokemonToLi(pokemon) {
  const firstType = pokemon.types[0];
  return `
    <li class="pokemon ${firstType}" data-pokemon-number="${pokemon.number}">
      <span class="number">#${pokemon.number}</span>
      <span class="name">${pokemon.name}</span>
  
      <div class="detail">
        <ol class="types">
          ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
        </ol>
  
        <img src="${pokemon.photo}" alt="${pokemon.name}">
      </div>
    </li>
  `;
}

function loadPokemonItems(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemonsData = []) => {
    pokemons = pokemonsData;
    const newHtml = pokemons.map(convertPokemonToLi).join('');
    pokemonList.innerHTML += newHtml;

    const pokemonElements = document.getElementsByClassName('pokemon');
    Array.from(pokemonElements).forEach((element) => {
      const pokemonNumber = parseInt(element.dataset.pokemonNumber);
      element.addEventListener('click', (event) => showPokemonCard(event, pokemonNumber));
    });
  });
}

loadPokemonItems(offset, limit);

loadMoreButton.addEventListener('click', () => {
  offset += limit;
  const qtdRecordsWithNextPage = offset + limit;

  if (qtdRecordsWithNextPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItems(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItems(offset, limit);
  }
});

function showPokemonCard(event, pokemonNumber) {
  const listItem = event.currentTarget;
  const pokemon = pokemons.find((p) => p.number === pokemonNumber);

  if (!pokemon) {
    console.error(`Pokemon with number ${pokemonNumber} not found.`);
    return;
  }

  const existingOverlay = document.querySelector('.pokemon-card-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }

  const cardOverlay = document.createElement('div');
  cardOverlay.className = 'pokemon-card-overlay';

  const cardContent = `
    <div class="pokemon-card">
      <button class="close-button">&times;</button>
      <h2 class="card-title">#${pokemon.number} - ${pokemon.name}</h2>
      <div class="card-detail">
        <div class="card-image">
          <img src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
        <div class="card-info">
          <p><strong>Type:</strong> ${pokemon.types.join(', ')}</p>
          <!-- Adicione mais informações do Pokémon aqui -->
        </div>
      </div>
    </div>
  `;

  cardOverlay.innerHTML = cardContent;

  const closeButton = cardOverlay.querySelector('.close-button');
  closeButton.addEventListener('click', () => {
    cardOverlay.remove();
  });

  document.body.appendChild(cardOverlay);
}
