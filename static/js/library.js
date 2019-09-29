import getMissingArtistIds from './getArtistIds.js';

export default function getLibraryArtists(username, numArtists, timePeriod) {

    // here we specify the url for the fetch request
    let url = new URL('http://ws.audioscrobbler.com/2.0/');

    // since the API requires url parameters, we set these here
    let query = {
        method: 'library.getartists',
        api_key: '3e0c61f86ab0621665f8bb0bccd2eaf9',
        user: username,
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
            let totalPages;
            if (numArtists === '50') {
                totalPages = 1;
            } else if (numArtists === '100' && response.artists['@attr'].totalPages > 1) {
                totalPages = 2;
            } else {
                totalPages = response.artists['@attr'].totalPages;
            }

            // TODO: Rather than making another fetch request after getting the total
            // pages, should probably get artist names and ID for the first page and then
            // if necessary loop through all remaining pages (e.g. starting from i = 2)
            for (let i = 1; i <= totalPages; i++) {

                // since the API requires url parameters, we set these here
                let query = {
                    method: 'library.getartists',
                    api_key: '3e0c61f86ab0621665f8bb0bccd2eaf9',
                    user: username,
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

                    // TODO: Use a data structure that allows name/ID pairs
                    // rather than using two seperate arrays
                    let artistNames = [];
                    let artistIDs = [];

                    for (let i = 0; i < responses.length; i++) {

                        const response = responses[i];

                        const artists = response.artists.artist;

                        for (let i = 0; i < artists.length; i++) {

                            const artist = artists[i];

                            artistNames.push(artist.name);
                            artistIDs.push(artist.mbid);
                        }
                    }

                    // with this list of artist names and IDs, we now want
                    // to get any missing IDs using musicbrainz API
                    getMissingArtistIds(artistNames, artistIDs, timePeriod);
                });
        });
}