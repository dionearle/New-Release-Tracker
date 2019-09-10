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

        //PLACEHOLDER! TESTING WITH ONLY FIRST FEW ARTISTS!
        // (NOTE ISSUE WHEN TRYING TO FETCH FOR MULTIPLE ARTISTS AT ONCE)
        get_releases(artists.artist[1].name);
        /*get_releases(artists.artist[1].name);
        get_releases(artists.artist[2].name);
        get_releases(artists.artist[3].name);
        get_releases(artists.artist[4].name);
        get_releases(artists.artist[5].name);
        get_releases(artists.artist[6].name);
        get_releases(artists.artist[7].name); */

    });

function display_artist(artist) {

    const html = document.getElementById('artists');

    const thisArtist = document.createElement('li');
    thisArtist.classList.add('artist');
    thisArtist.textContent = artist.name + ' has been played ' + artist.playcount + ' times.';

    html.appendChild(thisArtist);
}

// USING MUSICBRAINZ!!!
function get_releases(artist) {

    // here we specify the url for the fetch request
    let url = new URL('https://musicbrainz.org/ws/2/artist/');

    // since the API requires url parameters, we set these here
    let params = {
        query: `artist\:\"${artist}\"`,
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

    // we now fetch the data
    fetch(url, options)
        .then(response => response.json())
        .then(response => {

            // here we extract the artistID from the response
            let artistID = response.artists[0].id;

            // here we specify the url for the fetch request
            let url2 = new URL('https://musicbrainz.org/ws/2/release/');

            // since the API requires url parameters, we set these here
            let params2 = {
                artist: `${artistID}`,
                inc: 'release-groups',
                limit: '100',
                fmt: 'json'
            };

            // we then add this search query to the url
            url2.search = new URLSearchParams(params2);

            // here we simply setup the options for the fetch request
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            // we now fetch the data
            fetch(url2, options)
                .then(response => response.json())
                .then(response => {

                    let releases = response.releases;

                    for (let i = 0; i < releases.length; i++) {

                        let release = releases[i];

                        let date = release.date;
                        let title = release.title;

                        let isRecentRelease = checkIsRecentRelease(date);

                        if (isRecentRelease) {
                            display_release(title, date);
                        }
                    }
                });
        });
}

function display_release(title, date) {

    const html = document.getElementById('artists');

    const thisRelease = document.createElement('li');
    thisRelease.classList.add('release');
    thisRelease.textContent = title + ' released on ' + date;

    html.appendChild(thisRelease);
}

// TODO: return true if date is within last month OR week
// otherwise return false
function checkIsRecentRelease(date) {

    let dateString = date.split('-');

    let year = dateString[0];
    let month = dateString[1];
    let day = dateString[2];

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1;
    let currentDay = currentDate.getDate();
    let currentYear = currentDate.getFullYear();screen

    // placeholder test to see if release is in current year
    if (currentYear == year) {
        return true;
    } else {
        return false;
    }
}

// USING DISCOGS!!! (CAN PROBABLY DELETE SINCE WORKS IN SIMILAR WAY TO
// MUSICBRAINZ IN THAT IT DOESN'T STORE EXACT DATES FOR ALL RELEASES)
/*function get_releases(artist) {

    // here we specify the url for the fetch request
    let url = new URL('https://api.discogs.com/database/search');

    // since the API requires url parameters, we set these here
    let params = {
        artist: artist,
        year: new Date().getFullYear()
    };

    // we then add this search query to the url
    url.search = new URLSearchParams(params);

    const options = {
        method: 'GET',
        headers: {
            'Authorization': 'Discogs token=ssgaMRuuruKbkzUQhdsgLDcaJKQaRvDzSeXxqnhi',
            'Content-Type': 'application/json'
        }
    }

    // we now fetch the data
    fetch(url, options)
        .then(response => response.json())
        .then(response => {

            let results = response.results;

            for (let i = 0; i < results.length; i++) {

                display_release(results[i].title);
            } 
        });
}*/