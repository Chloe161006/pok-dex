<script>
const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=1025'; // TOUS les Pokémon
const TYPE_URL = 'https://pokeapi.co/api/v2/type';

let allPokemon = [];

async function fetchPokemon() {
  const response = await fetch(API_URL);
  const data = await response.json();

  data.results.forEach(async (pokemon) => {
    const res = await fetch(pokemon.url);
    const pokeData = await res.json();
    allPokemon.push(pokeData);
    displayPokemon(pokeData);
  });
}

async function fetchTypes() {
  const response = await fetch(TYPE_URL);
  const data = await response.json();
  const select = document.getElementById('type-filter');

  data.results.forEach(type => {
    if (type.name !== "unknown" && type.name !== "shadow") {
      const option = document.createElement('option');
      option.value = type.name;
      option.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1);
      select.appendChild(option);
    }
  });
}

function displayPokemon(pokemon) {
  const container = document.getElementById('pokemon-container');
  const pokeElement = document.createElement('div');
  pokeElement.classList.add('pokemon');
  pokeElement.setAttribute('data-name', pokemon.name.toLowerCase());
  pokeElement.setAttribute('data-type', pokemon.types.map(t => t.type.name).join(','));

  pokeElement.innerHTML = `
    <h3>${pokemon.name.toUpperCase()}</h3>
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <p>Type: ${pokemon.types.map(t => t.type.name).join(', ')}</p>
  `;

  pokeElement.addEventListener('click', () => openModal(pokemon));
  container.appendChild(pokeElement);
}

function filterPokemon() {
  const input = document.getElementById('search').value.toLowerCase();
  const selectedType = document.getElementById('type-filter').value;
  const pokemons = document.querySelectorAll('.pokemon');

  pokemons.forEach(pokemon => {
    const name = pokemon.getAttribute('data-name');
    const type = pokemon.getAttribute('data-type');

    let show = name.includes(input);

    if (selectedType) {
      show = show && type.includes(selectedType);
    }

    pokemon.style.display = show ? 'block' : 'none';
  });
}

function openModal(pokemon) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  
  modalBody.innerHTML = `
    <h2>${pokemon.name.toUpperCase()}</h2>
    <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" style="width:150px;">
    <p><strong>Type:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}</p>
    <div class="stats">
      <p><strong>PV:</strong> ${pokemon.stats[0].base_stat}</p>
      <p><strong>Attaque:</strong> ${pokemon.stats[1].base_stat}</p>
      <p><strong>Défense:</strong> ${pokemon.stats[2].base_stat}</p>
      <p><strong>Vitesse:</strong> ${pokemon.stats[5].base_stat}</p>
    </div>
  `;

  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}

// Initialisation
fetchPokemon();
fetchTypes();
</script>
