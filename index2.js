const movieTitles = ["Inception", "The Dark Knight", "Interstellar"];
const API_KEY = "e4af19b0";
const curatedLists = {
    "Action Blockbusters": ["Mad Max: Fury Road", "Gladiator", "John Wick"],
    "Romantic Favorites": ["Pride & Prejudice", "The Notebook", "La La Land"],
    "Mind-Bending Sci-Fi": ["Inception", "The Matrix", "Tenet"],
    "Comedy Classics": ["Superbad", "Step Brothers", "The Hangover"]
  };
  
  function renderCuratedLists() {
    const container = document.getElementById("curated__lists");
    container.innerHTML = "";
  
    for (const category in curatedLists) {
      const section = document.createElement("section");
      const categoryId = category.replace(/\s+/g, "_").toLowerCase();
  
      section.innerHTML = `
        <h2 class="curated__title">${category}</h2>
        <div class="curated__row" id="${categoryId}"></div>
      `;
  
      container.appendChild(section);
  
      curatedLists[category].forEach(async title => {
        const movie = await fetchMovie(title);
        if (movie.Response === "True") {
          const isFavorite = getFavorites().some(fav => fav.imdbID === movie.imdbID);
          const row = document.getElementById(categoryId);
          row.innerHTML += generateMovieCard(movie, isFavorite);
        }
      });
    }
  }
  
function generateMovieCard(movie, isFavorite = false, showRemoveButton = false) {
  return `
    <div class="card">
      <img src="${
        movie.Poster !== "N/A" ? movie.Poster : "assets/no-image.png"
      }" alt="${movie.Title}" />
      <div class="card__body">
        <h3 class="card__title">${movie.Title}</h3>
        <p class="card__genre">Genre: ${movie.Genre || "N/A"}</p>
        <p class="card__rating">${
          movie.imdbRating ? `⭐ ${movie.imdbRating}` : "Not Rated"
        }</p>
        ${
          showRemoveButton
            ? `<button class="btn card__btn" onclick='removeFromFavorites("${movie.imdbID}")'>Remove</button>`
            : `<button class="btn card__btn" onclick='addToFavorites(${JSON.stringify(
                movie
              )})' ${isFavorite ? "disabled" : ""}>
                ${isFavorite ? "In Favorites" : "Add to Favorites"}
              </button>`
        }
      </div>
    </div>
  `;
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
      container.innerHTML += generateMovieCard(movie, isFavorite);
    }
  }
}

function renderFavorites() {
  const container = document.getElementById("favorites__container");
  const favorites = getFavorites();
  container.innerHTML = "";

  if (!favorites.length) {
    container.innerHTML = "<p style='color: #ccc;'>No favorites yet. Start adding!</p>";
    return;
  }

  favorites.forEach(movie => {
    container.innerHTML += generateMovieCard(movie, true, true);
  });
}

function renderSearchResults(movies) {
  const resultsContainer = document.getElementById("search__results");
  resultsContainer.innerHTML = "";
  resultsContainer.style.display = "none";

  if (!movies || movies.length === 0) return;

  movies.forEach(movie => {
    const isFavorite = getFavorites().some(fav => fav.imdbID === movie.imdbID);
    resultsContainer.innerHTML += generateMovieCard(movie, isFavorite);
  });

  resultsContainer.style.display = "grid";
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
    renderFavorites();
    displayMovies();
  } else {
    alert(`"${movie.Title}" is already in favorites.`);
  }
}

function removeFromFavorites(imdbID) {
  const updatedFavorites = getFavorites().filter(movie => movie.imdbID !== imdbID);
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  renderFavorites();
  displayMovies();
}

  const searchBtn = document.getElementById("search__btn");
  const searchInput = document.getElementById("search__input");

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", async () => {
      const query = searchInput.value.trim();
      if (!query) return;

      const searchResponse = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`);
      const searchData = await searchResponse.json();

      if (searchData.Response === "True" && searchData.Search) {
        const detailedResults = await Promise.all(
          searchData.Search.map(movie => fetchMovie(movie.Title))
        );
        renderSearchResults(detailedResults);
      } else {
        const resultsContainer = document.getElementById("search__results");
        resultsContainer.innerHTML = `<p style="color: #ccc;">No results found for "${query}".</p>`;
        resultsContainer.style.display = "block";
      }
    });

    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        searchBtn.click();
      }
    });
  } else {
    console.error("Search input or button not found in the DOM.");
  }
  document.addEventListener("DOMContentLoaded", () => {
    displayMovies();
    renderFavorites();
    renderCuratedLists()
});

// Optional Menu Controls
function openMenu() {
  document.body.classList.add("menu--open");
}
function closeMenu() {
  document.body.classList.remove("menu--open");
}
window.openMenu = openMenu;
window.closeMenu = closeMenu;
