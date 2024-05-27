document.querySelector('.close-btn').addEventListener('click', function() {
    this.closest('.card').style.display = 'none';
    fetch(`/samoocenitev/brisanje`, {
                  method: 'GET',
              });
    window.location.href = `/`;
  });