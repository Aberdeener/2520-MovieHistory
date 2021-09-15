// Define constants.
const NEW_MOVIE_NAME_INPUT = document.querySelector("input");

const MOVIE_LIST = document.getElementById('movie-list');
let MOVIE_LIST_ITEMS = JSON.parse(window.localStorage.getItem('movie_list_items')) ?? [];

const MOVIE_FILTER = document.getElementById('filter');

const MOVIE_HISTORY_TABLE = document.getElementById('movie-history');
const MOVIE_HISTORY_ITEMS = JSON.parse(window.localStorage.getItem('movie_history_items')) ?? [];

// When the page loads, refresh the movie list and movie history table.
window.onload = () => {
    refreshMovieList(MOVIE_LIST_ITEMS);
    refreshMovieHistoryTable();
}

/**
 * Clear the "Movies" list HTML. If resetList is true, all movies will be wiped not just hidden.
 * 
 * @param {Boolean} resetList Whether to also clear the stored list of movie names
 */
function clearMovies(resetList = false) {
    MOVIE_LIST.innerHTML = '';

    if (resetList) {
        MOVIE_LIST_ITEMS = [];
        window.localStorage.setItem('movie_list_items', JSON.stringify(MOVIE_LIST_ITEMS));
    }
}

/**
 * Add a movie name to the "Movies" list.
 */
function addMovie() {

    let newMovieName = NEW_MOVIE_NAME_INPUT.value.toLowerCase();

    if (!validateMovieName(newMovieName)) {
        return;
    }

    MOVIE_LIST_ITEMS.push(newMovieName);
    window.localStorage.setItem('movie_list_items', JSON.stringify(MOVIE_LIST_ITEMS));

    refreshMovieList(MOVIE_LIST_ITEMS);

    updateMovieWatches(newMovieName);

    clearInput();
}

/**
 * Increment watches integer for a specific movie.
 * 
 * @param {String} name Name of movie to update watches for.
 */
function updateMovieWatches(name) {

    let found = false;

    for (const movieHistory of MOVIE_HISTORY_ITEMS) {
        if (movieHistory.name == name) {
            movieHistory.watches++;
            found = true;
        }
    }

    if (!found) {
        MOVIE_HISTORY_ITEMS.push({
            name: name,
            watches: 1
        });
    }

    window.localStorage.setItem('movie_history_items', JSON.stringify(MOVIE_HISTORY_ITEMS));

    refreshMovieHistoryTable();
}

/**
 * Refresh the table which displays the movies and how many times they have been watched.
 */
function refreshMovieHistoryTable() {

    MOVIE_HISTORY_TABLE.innerHTML = '';

    let rowNumber = 0;

    for (const movieHistory of MOVIE_HISTORY_ITEMS) {
        const row = MOVIE_HISTORY_TABLE.insertRow(rowNumber);
        const nameCell = row.insertCell(0);
        nameCell.innerHTML = movieHistory.name;

        const watchesCell = row.insertCell(1);
        watchesCell.innerHTML = movieHistory.watches;
    
        rowNumber++;
    }
}

/**
 * Clear and recreate the movie list with a new list of movie names.
 * 
 * @param {Array} moviesToAdd Array of movie names to reload the list with.
 */
function refreshMovieList(moviesToAdd) {

    clearMovies();

    for (const movieName of moviesToAdd) {

        const newMovieListEl = document.createElement("li");

        const newMovieNameTextNode = document.createTextNode(movieName);

        newMovieListEl.appendChild(newMovieNameTextNode);

        MOVIE_LIST.appendChild(newMovieListEl);
    }
}

/**
 * Validate text from movie name input field. Displays error if text is invalid.
 * 
 * @param {String} name Text to validate.
 * @return {Boolean} Whether the text is valid or not.
 */
function validateMovieName(name) {

    if (name === undefined || name == '') {
        alert('Please type in a movie name!');
        return false;
    }

    if (MOVIE_LIST_ITEMS.includes(name)) {
        alert('That movie name is already on your list!');
        // We still want to increment in the movie history section, though
        updateMovieWatches(name);
        return false;
    }

    return true;
}

/**
 * Clear "New Movie" text input form field.
 */
function clearInput() {
    NEW_MOVIE_NAME_INPUT.value = '';
}

/**
 *  Refresh the movie list with only movies that contain the filtered string.
 */
function filterMovies() {

    const movieFilterText = MOVIE_FILTER.value;

    if (movieFilterText === undefined || movieFilterText == '') {
        refreshMovieList(MOVIE_LIST_ITEMS);
        return;
    }

    refreshMovieList(MOVIE_LIST_ITEMS.filter((movieName) => movieName.includes(movieFilterText)));
}
