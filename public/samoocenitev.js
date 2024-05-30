

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

async function Logout(){
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (response.ok) {
            sessionStorage.removeItem('idUporabnik');
            alert('User logged out successfully!');
            window.location.href = '/';
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error logging out user:', error);
        alert(error.message);
    }
}





