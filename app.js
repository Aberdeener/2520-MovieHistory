// Define constants.
const NEW_MOVIE_NAME_INPUT = document.querySelector("input");

const MOVIE_LIST = document.getElementById('movie-list');
let MOVIE_LIST_ITEMS = JSON.parse(window.localStorage.getItem('movie_list_items')) ?? [];

const MOVIE_FILTER = document.getElementById('filter');

const MOVIE_HISTORY_TABLE = document.querySelectorAll('h5')[2];
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
const clearMovies = (resetList = false) => {
    MOVIE_LIST.innerHTML = '';

    if (resetList) {
        MOVIE_LIST_ITEMS = [];
        window.localStorage.setItem('movie_list_items', JSON.stringify(MOVIE_LIST_ITEMS));
    }
}

/**
 * Add a movie name to the "Movies" list.
 */
const addMovie = () => {

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
const updateMovieWatches = (name) => {

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
const refreshMovieHistoryTable = () => {

    if (document.querySelector('table')) {
        document.querySelector('table').remove();
    }

    const table = document.createElement('table');
    table.classList.add('table', 'table-borderless');

    const tr = document.createElement('tr');

    const nameCol = document.createElement('th');
    nameCol.innerHTML = 'Name';
    tr.appendChild(nameCol);

    const watchesCol = document.createElement('th');
    watchesCol.innerHTML = 'Watches';
    tr.appendChild(watchesCol);

    table.appendChild(tr)

    const tbody = document.createElement('tbody');

    for (const movieHistory of MOVIE_HISTORY_ITEMS) {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.appendChild(document.createTextNode(movieHistory.name));
        row.appendChild(nameCell);

        const watchesCell = document.createElement('td');
        watchesCell.appendChild(document.createTextNode(movieHistory.watches));
        row.appendChild(watchesCell)

        tbody.appendChild(row);
    }

    table.appendChild(tbody);

    MOVIE_HISTORY_TABLE.insertAdjacentElement('afterend', table);
}

/**
 * Clear and recreate the movie list with a new list of movie names.
 * 
 * @param {Array} moviesToAdd Array of movie names to reload the list with.
 */
const refreshMovieList = (moviesToAdd) => {

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
const validateMovieName = (name) => {

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
const clearInput = () => {
    NEW_MOVIE_NAME_INPUT.value = '';
}

/**
 *  Refresh the movie list with only movies that contain the filtered string.
 */
const filterMovies = () => {

    const movieFilterText = MOVIE_FILTER.value;

    if (movieFilterText === undefined || movieFilterText == '') {
        refreshMovieList(MOVIE_LIST_ITEMS);
        return;
    }

    refreshMovieList(MOVIE_LIST_ITEMS.filter((movieName) => movieName.includes(movieFilterText)));
}
