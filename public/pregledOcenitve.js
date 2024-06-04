function navigateTo(path) {
  window.location.href = path;
}

document.addEventListener('DOMContentLoaded', function() {
  const closeBtn = document.querySelector('.close-btn');
  const confirmDeleteBtn = document.getElementById('confirmDelete');
  const cancelDeleteBtn = document.querySelector('.btn-secondary'); // Select the "Ne" button
  const footerCols = document.querySelectorAll('footer .col');

  function showConfirmationModal(event) {
    event.preventDefault();
    $('#confirmationModal').modal('show');
  }

  function handleConfirmDelete(event) {
    const url = new URL(window.location.href);
    const kategorija = url.pathname.split('/').pop();

    try {
      fetch(`/samoocenitev/brisanje/:ocena/${kategorija}`, {
        method: 'GET',
      });
      window.location.href = `/samoocenitev`;
    } catch (error) {
      console.error('Error updating Firestore: ', error);
    }
  }

  function handleCancelDelete(event) {
    $('#confirmationModal').modal('hide');
  }

  function handleFooterClick(event) {
    const path = this.getAttribute('onclick').match(/'(.*)'/)[1];
    window.location.href = path;
  }

  closeBtn.addEventListener('click', showConfirmationModal);
  closeBtn.addEventListener('touchstart', showConfirmationModal);

  confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
  confirmDeleteBtn.addEventListener('touchstart', handleConfirmDelete);

  cancelDeleteBtn.addEventListener('click', handleCancelDelete);
  cancelDeleteBtn.addEventListener('touchstart', handleCancelDelete);

  footerCols.forEach(col => {
    col.addEventListener('click', handleFooterClick);
    col.addEventListener('touchstart', handleFooterClick);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const infoContainer = document.querySelector('.info-container');
  let startY, startTop;

  function startInteraction(event) {
    startY = event.type.includes('mouse') ? event.clientY : event.touches[0].clientY;
    startTop = parseInt(window.getComputedStyle(infoContainer).top, 10);
    document.addEventListener('mousemove', moveInteraction);
    document.addEventListener('touchmove', moveInteraction);
    document.addEventListener('mouseup', endInteraction);
    document.addEventListener('touchend', endInteraction);
  }

  function moveInteraction(event) {
    const clientY = event.type.includes('mouse') ? event.clientY : event.touches[0].clientY;
    const dy = clientY - startY;
    const newTop = Math.min(Math.max(150, startTop + dy), 300);
    infoContainer.style.top = `${newTop}px`;

    const percentRevealed = (newTop - 150) / 150;
    const filterValue = 100 - ((1 - percentRevealed) * 50);
    document.querySelector('.image-container img').style.filter = `brightness(${filterValue}%)`;
  }

  function endInteraction() {
    document.removeEventListener('mousemove', moveInteraction);
    document.removeEventListener('touchmove', moveInteraction);
    document.removeEventListener('mouseup', endInteraction);
    document.removeEventListener('touchend', endInteraction);
  }

  infoContainer.addEventListener('mousedown', startInteraction);
  infoContainer.addEventListener('touchstart', startInteraction);
});

document.addEventListener("DOMContentLoaded", function() {
  document.body.classList.add('body-slide-in');
});

document.addEventListener('DOMContentLoaded', function() {
  let startX;
  const threshold = 100;

  document.body.addEventListener('touchstart', function(e) {
    const touchobj = e.changedTouches[0];
    startX = touchobj.pageX;
  });

  document.body.addEventListener('touchend', function(e) {
    const touchobj = e.changedTouches[0];
    const dist = touchobj.pageX - startX;
    if (dist >= threshold) {
      window.location.href = '/samoocenitev';
    }
  });
});
