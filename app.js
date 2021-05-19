// ----------------------------------- Utilities --------------------------------
// returns a string corresponding to the color of the type
// Str -> Str
function getTypeColor(type) {
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
  const key = type.toLowerCase();
  return typeColorPairs[key];
}

// returns a string that represents the pokemon ID, with leading zeroes as required.
// Num -> Str
function getPokeID(id) {
  const strID = id.toString();
  if (id < 10) {
    return `00${strID}`;
  } else if (id < 100) {
    return `0${strID}`;
  }
  return strID;
}

// capitalizes first character of the string
function capitalizeFirst(str) {
  const [first, ...rest] = str;
  return first.toUpperCase() + rest.join('');
}

// ----------------------------------- Add entries --------------------------------
// Appends a span with inner text = "type" to parent (normally div of class "type")
// HTMLElement Str -> VOID
function addType(parent, type) {
  const typeEntry = document.createElement('span');
  typeEntry.textContent = type.toUpperCase();
  typeEntry.style.backgroundColor = getTypeColor(type);
  parent.appendChild(typeEntry);
}
const main = document.querySelector('main');
// Makes a new entry for corresponding Pokemon and appends it to main.
// PokeObject -> Void
function makeEntry(pokeData) {
  const entry = document.createElement('div');
  entry.classList.add('entry');
  entry.id = pokeData.id;
  entry.innerHTML = `
    <div class="poke-id-container">
      <div class="poke-id">${getPokeID(pokeData.id)}</div>
    </div>
  <img
    src="https://pokeres.bastionbot.org/images/pokemon/${pokeData.id}.png"
    alt="Bulbasaur"
  />
  <div class="name">${capitalizeFirst(pokeData.name)}</div>`;
  main.appendChild(entry);

  const typeContainer = document.createElement('div');
  typeContainer.classList.add('type');
  for (let i = 0; i < pokeData.types.length; i += 1) {
    addType(typeContainer, pokeData.types[i].type.name);
  }
  entry.appendChild(typeContainer);
}
// connects to pokeapi and makes a new entry for the Pokemon with the corresponding ID.
// Num -> Void
function fetchPokeData(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then((res) => res.json())
    .then((res) => {
      makeEntry(res);
    })
    .catch((err) => console.log(err));
}
// Displays pokemon with ID of start (inclusive) to end (not inclusive).
// Num Num -> Void
async function loadPokedex(start, end) {
  // Resets main
  main.innerHTML = '';
  const pokemonNo = 898;
  if (start <= 0 || end > pokemonNo) {
    alert(`Please input a valid range (from 1 to ${898})`);
  }
  for (let i = start; i <= end; i += 1) {
    fetchPokeData(i);
  }
}

// ----------------------------------- Navigation --------------------------------
function loadRegionPokemon() {
  const regionOrder = [
    'Kanto',
    'Johto',
    'Hoenn',
    'Sinnoh',
    'Unova',
    'Kalos',
    'Alola',
  ];
  const regionLimits = [1, 152, 258, 393, 501, 656, 722];
  for (let i = 0; i < regionOrder.length; i += 1) {
    if (this.innerText === regionOrder[i]) {
      loadPokedex(regionLimits[i], regionLimits[i + 1]);
    }
  }
}

const regions = document.querySelectorAll('nav button');
for (let i = 0; i < regions.length; i += 1) {
  regions[i].addEventListener('click', loadRegionPokemon);
}
