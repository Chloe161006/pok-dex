let allPokemon = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

const pokedex = document.getElementById('pokedex');
const searchInput = document.getElementById('search');
const generationFilter = document.getElementById('generationFilter');
const typeFilter = document.getElementById('typeFilter');
const themeSwitch = document.getElementById('themeSwitch');
const exportFavoritesBtn = document.getElementById('exportFavorites');
const importFavoritesBtn = document.getElementById('importFavorites');

async function fetchPokemon() {
    const response = await fetch('data/pokemon.json');
    allPokemon = await response.json();
    populateTypeFilter();
    displayPokemon(allPokemon);
}

function displayPokemon(pokemonList) {
    pokedex.innerHTML = '';
    pokemonList.forEach(pokemon => {
        const cardTemplate = document.getElementById('pokemon-card').content.cloneNode(true);
        cardTemplate.querySelector('.pokemon-name').textContent = pokemon.name;
        cardTemplate.querySelector('.pokemon-id').textContent = `#${pokemon.id.toString().padStart(3, '0')}`;
        cardTemplate.querySelector('.pokemon-image').src = pokemon.image;
        cardTemplate.querySelector('.pokemon-types').innerHTML = pokemon.types.map(t => `<span>${t}</span>`).join('');
        
        const favButton = cardTemplate.querySelector('.favorite-button');
        if (favorites.includes(pokemon.id)) {
            favButton.textContent = '★';
        }
        
        favButton.addEventListener('click', () => toggleFavorite(pokemon.id, favButton));
        
        pokedex.appendChild(cardTemplate);
    });
}

function toggleFavorite(id, button) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(fav => fav !== id);
        button.textContent = '☆';
    } else {
        favorites.push(id);
        button.textContent = '★';
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function filterPokemon() {
    const search = searchInput.value.toLowerCase();
    const gen = generationFilter.value;
    const type = typeFilter.value;
    
    const filtered = allPokemon.filter(pokemon => {
        const matchesSearch = pokemon.name.toLowerCase().includes(search);
        const matchesGen = gen ? pokemon.generation == gen : true;
        const matchesType = type ? pokemon.types.includes(type) : true;
        return matchesSearch && matchesGen && matchesType;
    });
    
    displayPokemon(filtered);
}

function populateTypeFilter() {
    const types = [...new Set(allPokemon.flatMap(p => p.types))];
    types.sort();
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeFilter.appendChild(option);
    });
}

themeSwitch.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

searchInput.addEventListener('input', filterPokemon);
generationFilter.addEventListener('change', filterPokemon);
typeFilter.addEventListener('change', filterPokemon);

exportFavoritesBtn.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(favorites)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'favorites.json';
    a.click();
    URL.revokeObjectURL(url);
});

importFavoritesBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.addEventListener('change', event => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = e => {
            favorites = JSON.parse(e.target.result);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            filterPokemon();
        };
        reader.readAsText(file);
    });
    input.click();
});

fetchPokemon();
