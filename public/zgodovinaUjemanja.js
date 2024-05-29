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