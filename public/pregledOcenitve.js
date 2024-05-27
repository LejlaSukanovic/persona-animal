document.querySelector('.close-btn').addEventListener('click', function() {
    fetch(`/samoocenitev/brisanje`, {
                  method: 'GET',
              });
    window.location.href = `/`;
  });