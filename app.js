// ----------------------------------- Utilities --------------------------------
// returns type of Pokemon
// PokeObject Num -> Str
function getPokeType(pokeData, slot) {
  return pokeData.types[slot - 1].type.name;
}

// returns a string corresponding to the color of the type
// Str -> Str
function getTypeColor(type) {
  const typeColorPairs = {
    bug: 'rgb(176, 191, 48)',
    dark: 'rgb(54, 42, 30)',
    dragon: 'rgb(104, 87, 191)',
    fairy: 'rgb(245, 196, 245)',
    electric: 'rgb(253, 182, 21)',
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

// returns region corresponding to the pokemon ID (where it first appeared in)
// Num -> Str
function getRegionbyID(id) {
  const regionOrder = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola'];
  cconst regionLimits = [1, 152, 252, 387, 495, 650, 722, 810];
  for (let i = 0; i < regionOrder.length; i += 1) {
    if (id < regionLimits[i + 1]) {
      return regionOrder[i];
    }
  }
}

// returns a string that represents the pokemon ID, with leading zeroes as required.
// Num -> Str
function getPokeID(id) {
  const strID = id.toString();
  if (id < 10) {
    return `00${strID}`;
  }
  if (id < 100) {
    return `0${strID}`;
  }
  return strID;
}

// capitalizes first character of the string
function capitalizeFirst(str) {
  const [first, ...rest] = str;
  return first.toUpperCase() + rest.join('');
}

// --------------------------------- Add entry utilities --------------------------------
// Appends a span with inner text = "type" to parent (normally div of class "type")
// HTMLElement Str -> VOID
function addType(parent, type) {
  const typeEntry = document.createElement('span');
  typeEntry.textContent = type.toUpperCase();
  typeEntry.style.backgroundColor = getTypeColor(type);
  parent.appendChild(typeEntry);
}

// Returns requested status from pokeData.
// Str PokeObject -> Str
// requires: pokeData is one of: region, ability, type, exp, height, weight
function getPokeStats(req, pokeData) {
  if (req === 'region') {
    return getRegionbyID(pokeData.id).toLowerCase();
  }
  if (req === 'ability') {
    return pokeData.abilities[0].ability.name;
  }
  if (req === 'type' && pokeData.types.length === 1) {
    return pokeData.types[0].type.name;
  }
  if (req === 'type' && pokeData.types.length === 2) {
    return `${getPokeType(pokeData, 1)}, ${getPokeType(pokeData, 2)}`;
  }
  if (req === 'exp') {
    return pokeData.base_experience;
  }
  if (req === 'height') {
    return pokeData.height;
  }
  if (req === 'weight') {
    return pokeData.weight;
  }
}

// Appends a status into stats class in back of card.
// HTMLElement Str anyof(Str, Num) -> Void
function addStat(parent, title, value) {
  const statEntry = document.createElement('div');
  const statTitle = document.createElement('span');
  statTitle.textContent = title;
  statTitle.classList.add('stats-title');
  statEntry.appendChild(statTitle);
  const statValue = document.createElement('span');
  statValue.textContent = value;
  statValue.classList.add('stats-value');
  statEntry.appendChild(statValue);
  parent.appendChild(statEntry);
}

// Appends all six status (region, ability, type, exp, height, weight) into stats class
//  in back of card.
// HTMLElement PokeObject -> Void
function addAllStats(parent, pokeData) {
  const statsContainer = document.createElement('div');
  statsContainer.classList.add('stats');
  const addedStats = ['region', 'ability', 'type', 'exp', 'height', 'weight'];
  for (let i = 0; i < addedStats.length; i += 1) {
    const curStats = addedStats[i];
    addStat(statsContainer, curStats, getPokeStats(curStats, pokeData));
  }
  parent.appendChild(statsContainer);
}

// ----------------------------------- Add entries --------------------------------
const main = document.querySelector('main');

// add front part of entry
// HTMLElement PokeObject -> Void
function addFrontEntry(entry, pokeData) {
  const front = document.createElement('div');
  front.classList.add('front');
  front.innerHTML = `
    <div class="poke-id-container">
      <div class="poke-id">${getPokeID(pokeData.id)}</div>
    </div>
  <img
    src="https://pokeres.bastionbot.org/images/pokemon/${pokeData.id}.png"
    alt=${capitalizeFirst(pokeData.name)}
  />
  <div class="name">${capitalizeFirst(pokeData.name)}</div>`;
  entry.appendChild(front);

  const typeContainer = document.createElement('div');
  typeContainer.classList.add('type');
  for (let i = 0; i < pokeData.types.length; i += 1) {
    addType(typeContainer, getPokeType(pokeData, i + 1));
  }
  front.appendChild(typeContainer);
}

// add back part of entry
// HTMLElement PokeObject -> Void
function addBackEntry(entry, pokeData) {
  const back = document.createElement('div');
  back.classList.add('back');
  back.style.background = `radial-gradient(white, ${getTypeColor(getPokeType(pokeData, 1))})`;
  back.innerHTML = `
  <div class="back-id">${getPokeID(pokeData.id)}</div>
  <div class="back-pokemon">
    <span class="back-name">${capitalizeFirst(pokeData.name)}</span>
    <span class="back-sprite"
      ><img
        src=${pokeData.sprites.front_default}
        alt=${capitalizeFirst(pokeData.name)}
    /></span>
  </div>
  `;
  entry.appendChild(back);
  addAllStats(back, pokeData);
}

// Make a new entry for corresponding Pokemon and appends it to main.
// PokeObject -> Void
function makeEntry(pokeData) {
  const entry = document.createElement('div');
  entry.classList.add('entry');
  entry.id = pokeData.id;
  addFrontEntry(entry, pokeData);
  addBackEntry(entry, pokeData);
  main.appendChild(entry);
}
// connects to pokeapi and makes a new entry for the Pokemon with the corresponding ID.
// Num -> Void
async function fetchPokeData(id) {
  await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
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
    await fetchPokeData(i);
  }
}

// ----------------------------------- Navigation --------------------------------
function loadRegionPokemon() {
  const regionOrder = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola'];
  const regionLimits = [1, 152, 252, 387, 495, 650, 722, 810];
  for (let i = 0; i < regionOrder.length; i += 1) {
    if (this.innerText === regionOrder[i]) {
      loadPokedex(regionLimits[i], regionLimits[i + 1] - 1);
    }
  }
}

const regions = document.querySelectorAll('nav button');
for (let i = 0; i < regions.length; i += 1) {
  regions[i].addEventListener('click', loadRegionPokemon);
}

loadPokedex(1, 5);
