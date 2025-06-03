// const API_KEY = 'e4af19b0';
// const BASE_URL = 'https://www.omdbapi.com/';

// async function fetchMovie(title) {
//   const response = await fetch(`${BASE_URL}?t=${title}&apikey=${API_KEY}`);
//   const data = await response.json();
//   return data;
// }
function openMenu() {
    document.body.classList += " menu--open"
}
function closeMenu() {
    document.body.classList.remove('menu--open')
}