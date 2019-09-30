
import getAlbumReleases from './getAlbumReleases.js';

export default function getMissingArtistIds(artistNames, artistIDs, timePeriod) {

    const status = document.getElementById('status');
    status.textContent = 'Got all artists from last.fm. Now getting any missing IDs from musicbrainz...';

    const progress = document.getElementById('outer-progress');
    progress.style.visibility = 'visible';

    recursiveGetReleases(artistIDs, artistNames, 0, artistIDs.length, timePeriod);
}

function recursiveGetReleases(artistIDs, artistNames, i, limit, timePeriod) {

    const progressBar = document.getElementById('progress');
    let progress = (i / limit) * 100;
    progressBar.style.width = progress + '%';
    progressBar.style.visibility = 'visible';

    if (i >= limit) {
        // once we have retrieved all IDs, we can now look for new releases
        // for these artists
        return getAlbumReleases(artistIDs, artistNames, timePeriod);
    }

    // if we already have the mbid for this artist, we skip it
    if (artistIDs[i] !== "") {
        i++;
        return recursiveGetReleases(artistIDs, artistNames, i, limit, timePeriod);
    }

    let currentArtistName = artistNames[i];

    // here we specify the url for the fetch request
    let url = new URL('https://musicbrainz.org/ws/2/artist/');

    // since the API requires url parameters, we set these here
    let params = {
        query: `artist\:\"${currentArtistName}\"`,
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
        fetch(url, options)
            .then(response => response.json())
            .then(response => {

                // if there is an artist in the musicbrainz
                // database with this name, we extract their mbid
                if (response.artists[0] !== undefined) {

                    let artistID = response.artists[0].id;

                    artistIDs[i] = artistID;
                }

                i++;
                return recursiveGetReleases(artistIDs, artistNames, i, limit, timePeriod);
            });
    }, 1000);
}