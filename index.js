const API_KEY = "e4af19b0";
const movieTitles = ["Inception", "The Dark Knight", "Interstellar"];

function renderFavorites() {
    const container = document.getElementById("favorites__container");
    const favorites = getFavorites();
    container.innerHTML = "";
  
    if (!favorites.length) {
      container.innerHTML = "<p style='color: #ccc;'>No favorites yet. Start adding!</p>";
      return;
    }
  
    favorites.forEach((movie) => {
      container.innerHTML += `
        <div class="card">
          <img src="${movie.Poster}" alt="${movie.Title}" class="card__img" />
          <div class="card__body">
            <h3 class="card__title">${movie.Title}</h3>
            <p class="card__genre">Genre: ${movie.Genre}</p>
            <div class="card__rating">⭐ ${movie.imdbRating}</div>
            <button class="btn card__btn" onclick='removeFromFavorites("${movie.imdbID}")'>Remove</button>
          </div>
        </div>
      `;
    });
  }
  
  
  function removeFromFavorites(imdbID) {
    const updatedFavorites = getFavorites().filter(movie => movie.imdbID !== imdbID);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    loadFavorites();
    displayMovies();
  }

async function fetchMovie(title) {
  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}`);
  return res.json();
}

async function displayMovies() {
    const container = document.getElementById("top-movies");
    container.innerHTML = "";
  
    for (const title of movieTitles) {
      const movie = await fetchMovie(title);
  
      if (movie.Response === "True") {
        const isFavorite = getFavorites().some(fav => fav.imdbID === movie.imdbID);
  
        container.innerHTML += `
          <div class="card">
            <img src="${movie.Poster}" alt="${movie.Title}" class="card__img" />
            <div class="card__body">
              <h3 class="card__title">${movie.Title}</h3>
              <p class="card__genre">Genre: ${movie.Genre}</p>
              <div class="card__rating">⭐ ${movie.imdbRating}</div>
              <button class="btn card__btn" onclick='addToFavorites(${JSON.stringify(movie)})'>
                ${isFavorite ? "In Favorites" : "Add to Favorites"}
              </button>
            </div>
          </div>
        `;
      }
    }
  }

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function addToFavorites(movie) {
  const favorites = getFavorites();
  const exists = favorites.some(fav => fav.imdbID === movie.imdbID);
  if (!exists) {
    favorites.push(movie);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`Added "${movie.Title}" to favorites!`);
    displayMovies(); // Refresh buttons
  } else {
    alert(`"${movie.Title}" is already in favorites.`);
  }
}

document.addEventListener("DOMContentLoaded", displayMovies);


function openMenu() {
    document.body.classList += " menu--open"
}
function closeMenu() {
    document.body.classList.remove('menu--open')
}
