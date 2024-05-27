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

});
  document.addEventListener('DOMContentLoaded', function() {

  
    const infoContainer = document.querySelector('.info-container');
    let startY, startTop;
    console.log('ggggggggg')

    // Function to start interaction
    function startInteraction(event) {
        event.preventDefault();  // Prevent default behavior like scrolling
        startY = event.type.includes('mouse') ? event.clientY : event.touches[0].clientY;
        startTop = parseInt(window.getComputedStyle(infoContainer).top, 10);
        document.addEventListener('mousemove', moveInteraction);
        document.addEventListener('touchmove', moveInteraction, {passive: false});
        document.addEventListener('mouseup', endInteraction);
        document.addEventListener('touchend', endInteraction);
    }

    // Function to handle moving
    function moveInteraction(event) {
        event.preventDefault(); // Prevent default behavior like scrolling
        const clientY = event.type.includes('mouse') ? event.clientY : event.touches[0].clientY;
        const dy = clientY - startY;
        const newTop = Math.min(Math.max(150, startTop + dy), 300);
        infoContainer.style.top = `${newTop}px`;
        
        // Adjust the brightness based on how much of the image is revealed
        const percentRevealed = (newTop - 150) / 150;
        const filterValue = 100 - ((1 - percentRevealed) * 50); // Reversed the effect
        document.querySelector('.image-container img').style.filter = `brightness(${filterValue}%)`;
    }

    // Function to end interaction
    function endInteraction() {
        document.removeEventListener('mousemove', moveInteraction);
        document.removeEventListener('touchmove', moveInteraction);
        document.removeEventListener('mouseup', endInteraction);
        document.removeEventListener('touchend', endInteraction);
    }

    // Attach event listeners for both mouse and touch events
    infoContainer.addEventListener('mousedown', startInteraction);
    infoContainer.addEventListener('touchstart', startInteraction, {passive: false});
});

//sliding from the left animation
document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.add('body-slide-in');
  });
