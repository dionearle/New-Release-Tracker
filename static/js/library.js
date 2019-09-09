// here we specify the url for the fetch request
let url = new URL('http://ws.audioscrobbler.com/2.0/');

// since the API requires url parameters, we set these here
let query = {method: 'library.getartists',
    api_key: '3e0c61f86ab0621665f8bb0bccd2eaf9',
    user: 'dionearle',
    format: 'json'};

// we then add this search query to the url
url.search = new URLSearchParams(query);

// here we simply setup the options for the fetch request
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}

// we now fetch the data
fetch(url, options)
    .then(response => response.json())
    .then(response => {

        const artists = response.artists;

        for (let i = 0; i < artists.artist.length; i++) {
            
            display_artist(artists.artist[i])
        }
    });

function display_artist(artist) {

    const html = document.getElementById('artists');

    // here we create the post element
    const thisArtist = document.createElement('li');
    thisArtist.classList.add('artist');  
    thisArtist.textContent = artist.name + ' has been played ' + artist.playcount + ' times.';

    html.appendChild(thisArtist);
}