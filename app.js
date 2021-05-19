const typeColorPairs = {
  bug: 'rgb(176, 191, 48)',
  dark: 'rgb(54, 42, 30)',
  dragon: 'rgb(104, 87, 191)',
  electric: 'rgb(245, 196, 245)',
  fairy: 'rgb(253, 182, 21)',
  fighting: 'rgb(131, 57, 36)',
  fire: 'rgb(237, 64, 14)',
  flying: 'rgb(141, 159, 235)',
  ghost: 'rgb(98, 95, 179)',
  grass: 'rgb(103, 188, 43)',
  ground: 'rgb(208, 174, 84)',
  ice: 'rgb(164, 230, 251)',
  normal: 'rgb(193, 189, 175)',
  poison: 'rgb(145, 68, 148)',
  psychic: 'rgb(221, 70, 123)',
  rock: 'rgb(161, 140, 79)',
  steel: 'rgb(172, 173, 185)',
  water: 'rgb(46, 133, 220)',
};

function getTypeColor(type) {
  const key = type.toLowerCase();
  return typeColorPairs[key];
}

const main = document.querySelector('main');
function makeEntry(pokeData) {
  const entry = document.createElement('div');
  entry.classList.toggle('entry');
  entry.id = pokeData.id;
  entry.innerHTML = `
    <div class="poke-id-container">
      <div class="poke-id">${pokeData.id}</div>
    </div>
  <img
    src="https://pokeres.bastionbot.org/images/pokemon/${pokeData.id}.png"
    alt="Bulbasaur"
  />
  <div class="name">${pokeData.name}</div>
  <div class="type">
    <span>${pokeData.types[0].type.name.toUpperCase()}</span>
    <span>POISON</span>
  </div>`;
  main.appendChild(entry);
  console.log(getTypeColor('fire'));
}

function fetchPokeData(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then((res) => res.json())
    .then((res) => {
      makeEntry(res);
      return res;
    })
    .catch((err) => console.log(err));
}

function loadPokedex(start, end) {
  for (let i = start; i <= end; i++) {
    fetchPokeData(i);
  }
}
