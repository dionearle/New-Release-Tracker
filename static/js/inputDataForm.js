import getLibraryArtists from './library.js';

// here we grab the post form
const searchSettings = document.forms.searchSettings;

// here we setup an event listener for when the create 
// post form is complete
searchSettings.addEventListener('submit', (event) => {

    // we ensure the default action for a submit button is prevented
    event.preventDefault();

    // we call an imported function to handle the post request
    handleInputForm();
});

function handleInputForm() {

    // within this form, we extract the required information
    const username = searchSettings.elements.username.value;
    const numArtists = searchSettings.elements.numArtists.value;
    const timePeriod = searchSettings.elements.timePeriod.value;
    const searchType = searchSettings.elements.searchType.value;

    // TODO: allow users to specify type of releases to be shown (singles, EP's, albums etc.)

    // TODO: need to check if last fm username actually exists
    if (username === '') {
        alert('Please enter a last.fm username');
    } else {

        const searchSettingsHTML = document.getElementById('searchSettings');
        searchSettingsHTML.parentNode.removeChild(searchSettingsHTML);

        
        getLibraryArtists(username, numArtists, timePeriod, searchType);
    }    
}