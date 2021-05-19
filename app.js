function fetchPokeData(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.log(err));
}
