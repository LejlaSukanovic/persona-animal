document.querySelector('.close-btn').addEventListener('click', function() {
    fetch(`/samoocenitev/brisanje`, {
                  method: 'GET',
              });
    window.location.href = `/`;
  });
  
document.addEventListener('DOMContentLoaded', function() {
    const infoContainer = document.querySelector('.info-container');
    

    let startY, startTop;
  
    infoContainer.addEventListener('mousedown', function(e) {
        startY = e.clientY;
        startTop = parseInt(window.getComputedStyle(this).top, 10);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
      
  
      function onMouseMove(e) {
        const dy = e.clientY - startY;
        const newTop = Math.min(Math.max(150, startTop + dy), 300);
        infoContainer.style.top = `${newTop}px`;
    
        // Calculate how much of the image is revealed, adjusting the brightness accordingly
        const percentRevealed = (newTop - 150) / 150;
        const filterValue = 100 - ((1 - percentRevealed) * 50); // Reversed the effect
        document.querySelector('.image-container img').style.filter = `brightness(${filterValue}%)`;
    }
    
    
      
  
      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
  });
  