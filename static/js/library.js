// here we specify the url for the fetch request
let url = new URL('http://ws.audioscrobbler.com/2.0/');

// since the API requires url parameters, we set these here
let query = {
    method: 'library.getartists',
    api_key: '3e0c61f86ab0621665f8bb0bccd2eaf9',
    user: 'dionearle',
    format: 'json'
};

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

            display_artist(artists.artist[i]);

        }

        // HERE WE DISPLAY THE ARTIST'S RELEASES!!!
        get_releases(artists.artist[0].name);

    });

function display_artist(artist) {

    const html = document.getElementById('artists');

    const thisArtist = document.createElement('li');
    thisArtist.classList.add('artist');
    thisArtist.textContent = artist.name + ' has been played ' + artist.playcount + ' times.';

    html.appendChild(thisArtist);
}

function get_releases(artist) {

    // here we specify the url for the fetch request
    let url = new URL('https://musicbrainz.org/ws/2/release-group/');

    // since the API requires url parameters, we set these here
    let params = {
        query: `artist\:\"${artist}\"`
    };

    // we then add this search query to the url
    url.search = new URLSearchParams(params);

    // here we simply setup the options for the fetch request
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // we now fetch the data
    fetch(url, options)
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(response => {

            let releases = response.getElementsByTagName('release-group');

            for(let i = 0; i < releases.length; i++) {

                let release = releases[i];
                let type = release.attributes.type.textContent;

                let titleObject = release.getElementsByTagName('title');
                let title = titleObject[0].textContent;

                display_release(title, type);
            }
        });
}

function display_release(title, type) {

    const html = document.getElementById('artists');

    const thisRelease = document.createElement('li');
    thisRelease.classList.add('release');
    thisRelease.textContent = title + ' - ' + type;

    html.appendChild(thisRelease);
}