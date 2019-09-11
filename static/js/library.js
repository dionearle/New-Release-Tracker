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

        const totalPages = response.artists['@attr'].totalPages;

        for (let i = 1; i < totalPages; i++) {

            // here we specify the url for the fetch request
            let url2 = new URL('http://ws.audioscrobbler.com/2.0/');

            // since the API requires url parameters, we set these here
            let query2 = {
                method: 'library.getartists',
                api_key: '3e0c61f86ab0621665f8bb0bccd2eaf9',
                user: 'dionearle',
                page: i,
                format: 'json'
            };

            // we then add this search query to the url
            url2.search = new URLSearchParams(query2);

            // here we simply setup the options for the fetch request
            const options2 = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            promisesList.push(fetch(url2, options2)
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

                        display_artist(artist);

                        databaseArtists.push(artist.name);
                    }
                }

                recursiveGetReleases(databaseArtists, 0, databaseArtists.length);
            });
    });

function display_artist(artist) {

    const html = document.getElementById('artists');

    const thisArtist = document.createElement('li');
    thisArtist.classList.add('artist');
    thisArtist.textContent = artist.name + ' has been played ' + artist.playcount + ' times.';

    html.appendChild(thisArtist);
}

function recursiveGetReleases(databaseArtists, i, limit) {

    // here we specify the url for the fetch request
    let url = new URL('https://musicbrainz.org/ws/2/artist/');

    // since the API requires url parameters, we set these here
    let params = {
        query: `artist\:\"${databaseArtists[i]}\"`,
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

                    // TODO: Travi$ Scott (index 15)
                    // gives the following error at line 133:
                    // TypeError: response.artists[0] is undefined

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

                    setTimeout(function () {
                        // we now fetch the data
                        fetch(url2, options)
                            .then(response => response.json())
                            .then(response => {

                                let releases = response.releases;

                                for (let i = 0; i < releases.length; i++) {

                                    let release = releases[i];

                                    let date = release.date;
                                    let title = release.title;

                                    if (date !== undefined) {
                                        let isRecentRelease = checkIsRecentRelease(date);

                                        if (isRecentRelease) {
                                            display_release(title, date);
                                        }  
                                    }
                                }
                            });
                    }, 5000);

                    i++;

                    return recursiveGetReleases(databaseArtists, i, limit);
               
                } else {
                    return;
                }
            });
    }, 5000);
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
    let currentYear = currentDate.getFullYear(); screen

    // placeholder test to see if release is in current year
    if (currentYear == year) {
        return true;
    } else {
        return false;
    }
}