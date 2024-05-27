function navigateTo(path) {
  window.location.href = path;
}

document.addEventListener('DOMContentLoaded', function () {
  const closeBtn = document.querySelector('.close-btn');
  const confirmDeleteBtn = document.getElementById('confirmDelete');

  closeBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default behavior
    $('#confirmationModal').modal('show');
  });

  const url = new URL(window.location.href);
  const kategorija = url.pathname.split('/').pop();

  confirmDeleteBtn.addEventListener('click', function () {
    try {
      
      fetch(`/samoocenitev/brisanje/:ocena/${kategorija}`, {
          method: 'GET',
      });
      window.location.href = `/`;
  } catch (error) {
      console.error('Error updating Firestore: ', error);
  }
  });
});

// Ensure correct event handling for draggable interaction
document.addEventListener('DOMContentLoaded', function() {
  const infoContainer = document.querySelector('.info-container');
  let startY, startTop;

  function startInteraction(event) {
    event.preventDefault();  // Prevent default behavior like scrolling
    startY = event.type.includes('mouse') ? event.clientY : event.touches[0].clientY;
    startTop = parseInt(window.getComputedStyle(infoContainer).top, 10);
    document.addEventListener('mousemove', moveInteraction, { passive: false });
    document.addEventListener('touchmove', moveInteraction, { passive: false });
    document.addEventListener('mouseup', endInteraction);
    document.addEventListener('touchend', endInteraction);
  }

  function moveInteraction(event) {
    event.preventDefault(); // Prevent default behavior like scrolling
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
  infoContainer.addEventListener('touchstart', startInteraction, { passive: false });
});

// Add sliding from the left animation
document.addEventListener("DOMContentLoaded", function() {
  document.body.classList.add('body-slide-in');
});

// Ensure swipe navigation to samoocenitev page
document.addEventListener('DOMContentLoaded', function() {
  let startX;
  const threshold = 100;

  document.body.addEventListener('touchstart', function(e) {
    const touchobj = e.changedTouches[0];
    startX = touchobj.pageX;
    e.preventDefault();
  }, { passive: false });

  document.body.addEventListener('touchend', function(e) {
    const touchobj = e.changedTouches[0];
    const dist = touchobj.pageX - startX;
    if (dist >= threshold) {
      window.location.href = '/samoocenitev';
    }
    e.preventDefault();
  }, { passive: false });
});
