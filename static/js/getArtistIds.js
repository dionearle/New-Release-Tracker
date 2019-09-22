
import getAlbumReleases from './getAlbumReleases.js';

export default function getArtistIds(databaseArtists) {

    console.log('Got all artists from last.fm. Now getting musicbrainz id for each...');

    const databaseIDs = [];

    // TODO: third argument should be databaseArtists.length
    // (HOWEVER FOR TESTING LEAVING IT AS SMALLER NUMBER)
    recursiveGetReleases(databaseArtists, 0, 5, databaseIDs);

}

function recursiveGetReleases(databaseArtists, i, limit, databaseIDs) {

    let currentArtist = databaseArtists[i];

    // here we specify the url for the fetch request
    let url = new URL('https://musicbrainz.org/ws/2/artist/');

    // since the API requires url parameters, we set these here
    let params = {
        query: `artist\:\"${currentArtist}\"`,
        fmt: 'json'
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

    setTimeout(function () {

        // we now fetch the data
        fetch(url, options)
            .then(response => response.json())
            .then(response => {
                if (i < limit) {

                    // if there isn't an artist in the musicbrainz
                    // database with this name, we go to the next;
                    if (response.artists[0] === undefined) {

                        i++;

                        return recursiveGetReleases(databaseArtists, i, limit, databaseIDs);
                    }

                    // here we extract the artistID from the response
                    let artistID = response.artists[0].id;

                    databaseIDs.push(artistID);

                    i++;

                    return recursiveGetReleases(databaseArtists, i, limit, databaseIDs);

                } else {
                    return getAlbumReleases(databaseIDs, databaseArtists);
                }
            });
    }, 1000);
}