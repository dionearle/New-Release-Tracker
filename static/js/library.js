import getArtistIds from './getArtistIds.js';

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

        const promisesList = [];

        // this initial fetch request is used to determine how many
        // pages of artists are in the user's library.
        // now we have this, we can retrieve the artists page by page
        const totalPages = response.artists['@attr'].totalPages;

        for (let i = 1; i <= totalPages; i++) {

            // since the API requires url parameters, we set these here
            let query = {
                method: 'library.getartists',
                api_key: '3e0c61f86ab0621665f8bb0bccd2eaf9',
                user: 'dionearle',
                page: i,
                format: 'json'
            };

            // we then add this search query to the url
            url.search = new URLSearchParams(query);

            promisesList.push(fetch(url, options)
                .then(response => response.json())
            );
        }

        Promise.all(promisesList)
            .then(responses => {

                let databaseArtists = [];

                for (let i = 0; i < responses.length; i++) {

                    const response = responses[i];

                    const artists = response.artists.artist;

                    for (let i = 0; i < artists.length; i++) {

                        const artist = artists[i];

                        databaseArtists.push(artist.name);
                    }
                }

                // with this list of artists, we now want
                // to fetch their musicbrainz ID's
                getArtistIds(databaseArtists);
            });
    });