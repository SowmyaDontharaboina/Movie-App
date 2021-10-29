const API_KEY = '4253d69fd347b3df54a7a628ab64e1c7';
const PAGE_COUNT = 1;
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=${PAGE_COUNT}`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query="`;


const form = document.getElementById('form');
const search = document.getElementById('search');
const container = document.getElementById('main');
const filterDropdown = document.getElementById('filter');
let initialMovies = [];
let currentMovies = [];
const fetchMovies = async (url) => {
    const response = await fetch(url);
    const result = await response.json();
    console.log(result);
    if(initialMovies.length === 0) {
        initialMovies = result.results;
    }
    currentMovies = result.results;
   // renderOnView(result.results);
   showMovies(result.results)
};

fetchMovies(API_URL);


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    if(searchTerm && searchTerm !== '') {
        fetchMovies(SEARCH_URL+searchTerm)
    } else {
        window.location.reload();
        showMovies(initialMovies);
    }
})

const renderOnView = (data) => {
    let view = '';
    data.forEach((movie) => {
        view +=`<div class="movie">
            <img src="${IMG_PATH}${movie.poster_path}" alt="poster">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <span class="green">${movie.vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${movie.overview}
            </div>
        </div>`;
    })
    container.innerHTML = view;
}

const getClassByVote =  (vote) => {
    return vote >= 8 ? 'green' : vote >=5 ? 'orange' : 'red';
}
const genreContainer = (genres) => {
    let view = '';
    genres.forEach((genre) => {
        view +=`<span>${genre.name}</span>`
    })
   return view;
};

const showMoveDetailsScreen = (moviedetails) => {
    container.innerHTML = '';
    const {backdrop_path,poster_path,release_date,vote_average,title,status,overview,genres} = moviedetails;
    container.innerHTML = `<div class="movie-details-container">
        <div class="poster">
            <img src="${IMG_PATH}${backdrop_path}" alt="poster">
        </div>
        <div class="sub-poster">
            <div class="image">
                <img src="${IMG_PATH}${poster_path}" alt="${title}">
            </div>
            <div class="movie-details-info">
                <div class="movie-details-title">
                    <span class="title">${title}</span>
                    <span class="rating">${vote_average}<i class="fas fa-star"></i></span>
                </div>
                <div class="release">
                    <div>${release_date}</div>
                    <div>${status}</div>
                    <div><strong>Genres:</strong>${genreContainer(genres)}</div>
                </div>
                <p>${overview}</p>
            </div>
        </div>
    </div>`;
};

const getMovieDetails = async (id) => {
    const MOVIE_DETAILS_API = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`;
    const moviedetials = await fetch(MOVIE_DETAILS_API);
    const data = await moviedetials.json();
    console.log(data)
    showMoveDetailsScreen(data);
}
const showMovieDetails = (e) => {
    const movieId = e.currentTarget.id;
    getMovieDetails(movieId);
}
const showMovies = (data) => {
    container.innerHTML = '';
    data.forEach((movie) => {
        const { title,overview,poster_path,vote_average} = movie;
        const movieEle = document.createElement('div');
        movieEle.className = 'movie';
        movieEle.setAttribute('id', movie.id);
        movieEle.innerHTML = `<img src="${IMG_PATH}${poster_path}" alt="${title}">
        <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getClassByVote(vote_average)}">${vote_average}</span>
        </div>
        <div class="overview">
            <h3>Overview</h3>
            ${overview}
            <button class="select">Click to Select</button>
        </div>`;
        movieEle.addEventListener('click', showMovieDetails)
        container.appendChild(movieEle);
    })
};

const debounce = (callback, delay) => {
    let timerId;
    return function(...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            callback.apply(this,[...args])
        }, delay);
    }
};
const dBounce = debounce(fetchMovies, 300);

const searchMovies = (e) => {
    const searchTerm = e.target.value;
    if(searchTerm && searchTerm !== '') {
        dBounce(SEARCH_URL+searchTerm);
    } else {
        showMovies(initialMovies);
    }
}
const sortByValue = (value) => {
    const movies = currentMovies;
    return movies.sort((a,b) => {
        if(b[value] > a[value]) {
            return 1;
        } else if(b[value] < a[value]) {
            return -1
        } else {
            return 0;
        }
    })
}
const filterResults = (e) => {
    const value = e.target.value;
    console.log(value)
    let results = [];
    results = sortByValue(value);
    if(value === 'title') {
        results = results.reverse();
    }
    console.log(results)
    showMovies(results);
};

search.addEventListener('input', searchMovies);
filterDropdown.addEventListener('change', filterResults)