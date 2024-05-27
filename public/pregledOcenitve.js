document.addEventListener('DOMContentLoaded', function () {
  const closeBtn = document.querySelector('.close-btn');
  const confirmDeleteBtn = document.getElementById('confirmDelete');

  closeBtn.addEventListener('click', function () {
    $('#confirmationModal').modal('show');
  });

  confirmDeleteBtn.addEventListener('click', function () {
    fetch(`/samoocenitev/brisanje`, {
      method: 'GET',
    }).then(() => {
      window.location.href = `/`;
    }).catch((error) => {
      console.error('Error:', error);
    });
  });

  const infoContainer = document.querySelector('.info-container');
  let startY, startTop;

  infoContainer.addEventListener('mousedown', function (e) {
    startY = e.clientY;
    startTop = parseInt(window.getComputedStyle(this).top, 10);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  function onMouseMove(e) {
    const dy = e.clientY - startY;
    const newTop = Math.min(Math.max(150, startTop + dy), 300);
    infoContainer.style.top = `${newTop}px`;

    const percentRevealed = (newTop - 150) / 150;
    const filterValue = 100 - ((1 - percentRevealed) * 50); // Reversed the effect
    document.querySelector('.image-container img').style.filter = `brightness(${filterValue}%)`;
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
});