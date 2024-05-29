

function navigateToCategory(category) {
    window.location.href = '/samoocenitev/izvedbaSamoocenitve/' + category;
}

function navigateTo(path) {
    window.location.href = path;
}

function clearStorageAndNavigate(category) {
    const keysToRemove = ['seenEntities', 'currentEntities', 'lastChosenEntity', 'currentChoice'];
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
    navigateToCategory(category);
}





