function deleteUser(idUporabnik) {
    if (confirm('Are you sure you want to delete this user?')) {
      fetch(`/deleteUser/${idUporabnik}`, {
        method: 'DELETE'
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
  }