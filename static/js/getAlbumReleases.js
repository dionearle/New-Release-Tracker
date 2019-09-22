export default function getAlbumReleases(databaseIDs, databaseArtists) {

    console.log('Got all artist ID\'s. Now we would schedule to check for new releases on a Friday...');

    // TODO: third argument should be databaseIDs.length
    // (HOWEVER FOR TESTING LEAVING IT AS SMALLER NUMBER)
    recursiveGetReleases(databaseIDs, 0, 5, databaseArtists);

}

function recursiveGetReleases(databaseIDs, i, limit, databaseArtists) {

    // here we extract the artistID from the response
    let artistID = databaseIDs[i];

    let artistName = databaseArtists[i];

    // here we specify the url for the fetch request
    let url = new URL('https://musicbrainz.org/ws/2/release/');

    // since the API requires url parameters, we set these here
    // TODO: should work out how many pages and go through all releases
    // rather than top 100 releases
    let params = {
        artist: `${artistID}`,
        inc: 'release-groups',
        limit: '100',
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

                    let listTitles = [];

                    let releases = response.releases;

                    for (let i = 0; i < releases.length; i++) {

                        let release = releases[i];

                        let date = release.date;
                        let title = release.title;

                        if (!listTitles.includes(title)) {

                            listTitles.push(title);

                            if (date !== undefined) {

                                let isRecentRelease = checkIsRecentRelease(date);

                                if (isRecentRelease) {
                                    display_release(artistName, title, date);
                                }
                            }
                        }
                    }

                    i++;
                    return recursiveGetReleases(databaseIDs, i, limit, databaseArtists);
                
                } else {
                    return doneFunction();
                }
            });
    }, 1000);
}

function display_release(artist, title, date) {

    const html = document.getElementById('artists');

    const thisRelease = document.createElement('li');
    thisRelease.classList.add('release');
    thisRelease.textContent = date + ': ' + title + ' by ' + artist + '.';

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

//TODO: Use the coverart API to get the covers for these releases
// and display alongside the title, artist and date (links to buy?)
// https://musicbrainz.org/doc/Cover_Art_Archive/API

// TODO: here we would setup an email to user if necessary, or anything else
// to do once all new releases have been found
function doneFunction() {
    console.log('Done!');
}