export default function getAlbumReleases(artistIDs, artistNames, timePeriod) {

    const status = document.getElementById('status');
    status.textContent = 'Got all artist ID\'s. Now we retrieve all new releases using musicbrainz...';

    recursiveGetReleases(artistIDs, artistNames, 0, artistIDs.length, 0, timePeriod);

}

function recursiveGetReleases(artistIDs, artistNames, i, limit, done, timePeriod) {

    const progressBar = document.getElementById('progress');
    let progress = (i / limit) * 100;
    progressBar.style.width = progress + '%';

    if (i >= limit) {
        // once we have displayed all new releases for all artists, we can carry out
        // any extra functionality in a helper function
        return doneFunction();
    }

    // here we extract the name and ID for the current artist
    let artistID = artistIDs[i];
    let artistName = artistNames[i];

    // here we specify the url for the fetch request
    let url = new URL('https://musicbrainz.org/ws/2/release-group/');

    // since the API requires url parameters, we set these here
    let params = {
        artist: `${artistID}`,
        limit: '100',
        offset: done,
        fmt: 'json',
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

                let artistReleases = [];

                let releases = response["release-groups"];

                if (releases === undefined) {
                    i++;
                    return recursiveGetReleases(artistIDs, artistNames, i, limit, 0, timePeriod);
                }

                for (let i = 0; i < releases.length; i++) {

                    let release = releases[i];

                    let title = release.title;

                    let date = release["first-release-date"];

                    let mbid = release.id;

                    let type = release["primary-type"];

                    // if we have already looked at a variant of this
                    // release, then we can simply skip it
                    if (!artistReleases.includes(title)) {

                        artistReleases.push(title);

                        if (date !== undefined) {

                            if (checkIsRecentRelease(date, timePeriod)) {
                                getAlbumCover(artistName, title, date, type, mbid);
                            }
                        }
                    }
                }

                // if there are still more pages of releases, then we want to keep searching for
                // this artist
                let totalReleases = response["release-group-count"];
                if (done < totalReleases) {
                    done += 100;
                    return recursiveGetReleases(artistIDs, artistNames, i, limit, done, timePeriod);
                    // otherwise, we can move to the next artist
                } else {
                    i++;
                    return recursiveGetReleases(artistIDs, artistNames, i, limit, 0, timePeriod);
                }
            });
    }, 1000);
}

function getAlbumCover(artist, title, date, type, mbid) {

    // here we specify the url for the fetch request
    let url = new URL(`https://coverartarchive.org/release-group/${mbid}`);

    // here we simply setup the options for the fetch request
    const options = {
        method: 'GET',
        headers: {
            'accept': 'application/json'
        }
    }

    fetch(url, options)
        .then(response => {

            // if a cover art isn't found, an error is thrown
            if (response.status !== 200) {
                throw new Error(response.statusText);
            }
            return response.json();

        })
        .then(response => {
            // TODO: Could use thumbnails to speed up displaying the pictures in browser
            displayRelease(artist, title, date, type, response.images[0].image);
        })
        .catch(function (error) {
            displayRelease(artist, title, date, type, 'https://orig14.deviantart.net/5162/f/2014/153/9/e/no_album_art__no_cover___placeholder_picture_by_cmdrobot-d7kpm65.jpg');
        });
}

function displayRelease(artist, title, date, type, image) {

    const html = document.getElementById('display-releases');

    const release = document.createElement('div');
    release.classList.add('col-3');
    release.style.align = 'center';

    const releaseText = document.createElement('p');
    releaseText.textContent = date + ': ' + title + ' (' + type + ') by ' + artist;
    release.appendChild(releaseText);

    const coverArt = document.createElement('img');
    coverArt.src = image;
    coverArt.style.height = '100px';
    coverArt.style.width = '100px';
    release.insertBefore(coverArt, releaseText);

    html.appendChild(release);
}

function checkIsRecentRelease(date, timePeriod) {

    let dateString = date.split('-');

    let year = dateString[0];
    let month = dateString[1];
    let day = dateString[2];

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1;
    let currentDay = currentDate.getDate();
    let currentYear = currentDate.getFullYear(); screen

    // TODO: Should check if release is within past week, month or year
    // of current date
    if (timePeriod === 'week') {

    } else if (timePeriod === 'month') {
        if (currentYear == year && currentMonth == month) {
            return true;
        } else {
            return false;
        }
    } else {
        if (currentYear == year) {
            return true;
        } else {
            return false;
        }
    }
}

// helper function to do any tasks once displayed all new
// releases
function doneFunction() {
    const progressBar = document.getElementById('progress');
    progressBar.textContent = 'Finished!';
}