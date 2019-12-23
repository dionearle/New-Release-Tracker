// using the list of artist names, we want to search the deezer API
// to get this artist's deezer ID
export default function searchDeezerArtists(artistNames, timePeriod) {

    const status = document.getElementById('status');
    status.textContent = 'Got all artists from last.fm. Now searching for their deezer ID\'s...';

    const progress = document.getElementById('outer-progress');
    progress.style.visibility = 'visible';

    const deezerIDs = [];
    const progressBar = document.getElementById('progress');

    for (let i = 0; i < artistNames.length; i++) {

        let progress = (i / artistNames.length) * 100;
        progressBar.style.width = progress + '%';
        progressBar.style.visibility = 'visible';

        // here we specify the url for the fetch request
        let url = new URL(`https://deezerdevs-deezer.p.rapidapi.com/search/artist?q=${artistNames[i]}`);

        const options = {
            method: "GET",
	        headers: {
		        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
		        "x-rapidapi-key": "956514241dmsh8371ef784ad3edcp1e8004jsn5cbc105d178a"
	        }
        }

        fetch(url, options)
            .then(response => response.json())
            .then(response => {

                if (response.data !== undefined
                && response.data[0] !== undefined) {

                    let artistID = response.data[0].id;
                
                    deezerIDs[i] = artistID;
                    
                    // given this deezer ID, we find all releases
                    // from this artist
                    getDeezerArtistReleases(deezerIDs[i], artistNames[i], timePeriod);

                } 
            });      
    }
}

function getDeezerArtistReleases(deezerID, artistName, timePeriod) {

    // here we specify the url for the fetch request
    let url = new URL(`https://deezerdevs-deezer.p.rapidapi.com/artist/${deezerID}/albums`);

    const options = {
        method: "GET",
	    headers: {
	        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
	        "x-rapidapi-key": "956514241dmsh8371ef784ad3edcp1e8004jsn5cbc105d178a"
	    }
    }

    fetch(url, options)
            .then(response => response.json())
            .then(response => {

                let artistReleases = [];

                if (response.data !== undefined) {

                    let releases = response.data;

                    for (let i = 0; i < releases.length; i++) {

                        let release = releases[i];
                        
                        let title = release.title
                        
                        let date = release.release_date;

                        let type = release.record_type;

                        let cover = release.cover_medium;

                        if (checkIsRecentRelease(date, timePeriod)) {
                            displayRelease(artistName, title, date, type, cover);
                        }
                    }
                }
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