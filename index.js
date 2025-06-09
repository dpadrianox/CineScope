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
    renderFavorites();
    displayMovies();
  }

async function fetchMovie(title) {
  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}`);
  return res.json();
}

async function displayMovies() {
    const container = document.getElementById("top__movies");
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
    displayMovies();
  } else {
    alert(`"${movie.Title}" is already in favorites.`);
  }
}

function renderSearchResults(movies) {
  const resultsContainer = document.getElementById("search__results");

  // Clear previous results
  resultsContainer.innerHTML = "";

  // Hide by default
  resultsContainer.style.display = "none";

  // If no movies, exit early
  if (!movies || movies.length === 0) return;

  // Render each movie card
  movies.forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "assets/no-image.png"}" alt="${movie.Title}">
      <div class="card__body">
        <h3 class="card__title">${movie.Title}</h3>
        <p class="card__genre">${movie.Genre || "N/A"}</p>
        <p class="card__rating">${movie.imdbRating ? `⭐ ${movie.imdbRating}` : "Not Rated"}</p>
        <button onclick='addToFavorites(${JSON.stringify(movie)})'>Add to Favorites</button>
      </div>
    `;
    resultsContainer.appendChild(card);
  });

  // Show only after content is added
  resultsContainer.style.display = "grid"; // or "block" if preferred
}


function openMenu() {
  console.log("menu opened");
    document.body.classList.add("menu--open")
}
function closeMenu() {
    document.body.classList.remove("menu--open")
}
window.openMenu = openMenu;
window.closeMenu = closeMenu;

function createFlash(x, y) {
  const flash = document.createElement("div");
  flash.classList.add("flash");
  flash.style.top = `${y}px`;
  flash.style.left = `${x}px`;
  document.body.appendChild(flash);

  setTimeout(() => {
    flash.remove();
  }, 300);
}

function triggerCameraFlashes(count = 10, duration = 2000) {
  const interval = duration / count;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      createFlash(x, y);
    }, i * interval);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  displayMovies();
  renderFavorites();
  triggerCameraFlashes(20, 3000);
});



