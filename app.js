// ----------------------------------- Utilities --------------------------------
/**
 * Returns the type of the pokemon
 * @param  {Object} pokeData Object returned from fetchPokeData
 * @param  {Number} slot     Specifies which type: First or Second
 * @return {String}          The type of the Pokemon
 */
function getPokeType(pokeData, slot) {
  return pokeData.types[slot - 1].type.name;
}

/**
 * Returns a string corresponding to the color of the type (in RGB)
 * @param  {String} type     The type of the Pokemon
 * @return {String}          The color, in RGB notation.
 */
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

/**
 * Returns the region where the Pokemon first appeared in
 * @param  {Number} id   The ID of the Pokemon
 * @return {String}      The region where the Pokemon first appeared in
 */
function getRegionbyID(id) {
  const regionOrder = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola'];
  const regionLimits = [1, 152, 252, 387, 495, 650, 722, 810];
  for (let i = 0; i < regionOrder.length; i += 1) {
    if (id < regionLimits[i + 1]) {
      return regionOrder[i];
    }
  }
  return false;
}

/**
 * Parses the number to always contain three digits, by adding leading 0s as necessary.
 * @param  {Number} id   The ID of the Pokemon
 * @return {String}      The ID of the Pokemon, parsed as a three-digit string
 */
function formatThreeDigits(id) {
  const strID = id.toString();
  if (id < 10) {
    return `00${strID}`;
  }
  if (id < 100) {
    return `0${strID}`;
  }
  return strID;
}

/**
 * Capitalizes the first character of the string.
 * @param  {String} str  String to be capitalized
 * @return {String}      Capitalized string
 */
function capitalizeFirst(str) {
  const [first, ...rest] = str;
  return first.toUpperCase() + rest.join('');
}

// --------------------------------- Add entry utilities --------------------------------
/**
 * Appends a span with inner text = <type> to parent (normally div of class "type")
 * @param  {HTMLElement} parent  The parent where the span will be appended to
 * @param  {String}      type    The type of the pokemon.
 */
function addType(parent, type) {
  const typeEntry = document.createElement('span');
  typeEntry.textContent = type.toUpperCase();
  typeEntry.style.backgroundColor = getTypeColor(type);
  parent.appendChild(typeEntry);
}

/**
 * Returns requested status from PokeData
   (where status is one of region, ability, type, exp, height, weight)
 * @param  {String}         req         The requested status.
 * @param  {Object}         pokeData    Object returned from fetchPokeData
 * @return {String|Number}              The value of the status.
 */
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
  return false;
}

/**
 * Appends a status into stats class in back of card.
 * @param  {HTMLElement}    parent   Parent where status will be appended to
 * @param  {String}         title    Title of status.
 * @param {String|Number}   value    Value of status.
 */
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

/**
 * Appends all six status (region, ability, type, exp, height, weight) into stats class
 * @param  {HTMLElement} parent    Parent where status will be appended to
 * @param  {Object}      pokeData  Object returned from fetchPokeData
 */
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

/**
 * Adds front part of an entry.
 * @param  {HTMLElement}  parent    Parent where front will be appended to
 * @param  {Object}       pokeData  Object returned from fetchPokeData
 */
function addFrontEntry(entry, pokeData) {
  const front = document.createElement('div');
  front.classList.add('front');
  front.innerHTML = `
    <div class="poke-id-container">
      <div class="poke-id">${formatThreeDigits(pokeData.id)}</div>
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

/**
 * Adds back part of an entry.
 * @param  {HTMLElement}  parent    Parent where front will be appended to
 * @param  {Object}       pokeData  Object returned from fetchPokeData
 */
function addBackEntry(entry, pokeData) {
  const back = document.createElement('div');
  back.classList.add('back');
  back.style.background = `radial-gradient(white, ${getTypeColor(getPokeType(pokeData, 1))})`;
  back.innerHTML = `
  <div class="back-id">${formatThreeDigits(pokeData.id)}</div>
  <div class="back-pokemon">
    <span class="back-name">${capitalizeFirst(pokeData.name)}</span>
    <span class="back-sprite"
      ><img
        src=${pokeData.sprites.front_default}
        alt=${capitalizeFirst(pokeData.name)}
    /></span>
  </div>`;
  entry.appendChild(back);
  addAllStats(back, pokeData);
}

/**
 * Make a new entry for corresponding Pokemon and appends it to main.
 * @param  {HTMLElement}  parent    Parent where front will be appended to
 */
function makeEntry(pokeData) {
  const entry = document.createElement('div');
  entry.classList.add('entry');
  entry.id = pokeData.id;
  addFrontEntry(entry, pokeData);
  addBackEntry(entry, pokeData);
  main.appendChild(entry);
}

/**
 * Connects with PokeAPI to get data corresponding to the pokemon ID and displays it on DOM.
 * @param  {Number}  id    Pokemon ID
 * @return {Object}        Data corresponding to the Pokemon.
 */
async function fetchPokeData(id) {
  await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then((res) => res.json())
    .then((res) => {
      makeEntry(res);
    })
    .catch((err) => console.log(err));
}

/**
 * Connects with PokeAPI to get data corresponding to pokemons starting with ID
   start up to, not including ID end and displays it on DOM.
 * @param  {Number}  start  Lower bound Pokemon ID.
 * @param  {Number}  end  Upper bound for Pokemon ID (not inclusive)
 */
async function loadPokedex(start, end) {
  // Resets main
  main.innerHTML = '';
  for (let i = start; i <= end; i += 1) {
    await fetchPokeData(i);
  }
}

// ----------------------------------- Navigation --------------------------------
const regions = document.querySelectorAll('nav button');
/**
 * Removes styling of previous active region.
 */
function removeActiveRegion() {
  for (let i = 0; i < regions.length; i += 1) {
    regions[i].classList.remove('region-active');
  }
}

/**
 * Displays all Pokemon first appearing in that region.
 */
function loadRegionPokemon() {
  const regionOrder = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola'];
  const regionLimits = [1, 152, 252, 387, 495, 650, 722, 810];
  removeActiveRegion();
  // Loads entries and shows active regions.
  for (let i = 0; i < regionOrder.length; i += 1) {
    if (this.innerText === regionOrder[i]) {
      this.classList.add('region-active');
      loadPokedex(regionLimits[i], regionLimits[i + 1] - 1);
    }
  }
}

for (let i = 0; i < regions.length; i += 1) {
  regions[i].addEventListener('click', loadRegionPokemon);
}
loadPokedex(1, 5);
