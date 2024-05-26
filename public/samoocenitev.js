

function navigateToCategory(category) {
    window.location.href = '/samoocenitev/izvedbaSamoocenitve/' + category;
}

function navigateTo(path) {
    window.location.href = path;
}

function clearStorageAndNavigate(category) {
    sessionStorage.clear();
    navigateToCategory(category);
}
