let deleteUserId = null;
let deleteKategorija = null;

function confirmDelete(idUporabnik, kategorija) {
    deleteUserId = idUporabnik;
    deleteKategorija = kategorija;
    $('#confirmationModal').modal('show');
}

document.getElementById('confirmDelete').addEventListener('click', function() {
    if (deleteUserId && deleteKategorija) {
        fetch(`ujemanje/deleteUser/${deleteUserId}/${deleteKategorija}`, {
            method: 'GET'
        })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                alert('Failed to delete user.');
            }
        })
        .catch(error => console.error('Error:', error));
    }
});

function navigateTo(path) {
    window.location.href = path;
}

function navigateToCategory(category) {
    window.location.href = '/ujemanje/novUporabnik/' + category;
}

function clearStorageAndNavigate(category) {
    sessionStorage.clear();
    navigateToCategory(category);
}

$(document).ready(function() {
    $('.content').addClass('visible');
});

function saveToSessionStorage(entiteta1, entiteta2, ujemanje) {
    sessionStorage.setItem('entiteta1', entiteta1);
    sessionStorage.setItem('entiteta2', entiteta2);
    sessionStorage.setItem('ujemanje', ujemanje);
}

function saveAndSendData(entiteta1, entiteta2, ujemanje) {
    saveToSessionStorage(entiteta1, entiteta2, ujemanje);

    // Send data to the server
    $.post('ujemanje/setSessionData', {
        entiteta1: entiteta1,
        entiteta2: entiteta2,
        ujemanje: ujemanje
    }).done(function() {
        window.location.href = 'ujemanje/pregledUjemanja';
    }).fail(function() {
        console.error('Error saving session data');
    });
}
