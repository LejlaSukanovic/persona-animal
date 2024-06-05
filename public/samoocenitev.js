document.addEventListener("DOMContentLoaded", function () {
    var successPopup = document.getElementById('success_popup');
    var successAnimationContainer = document.getElementById('success_animation_container');
    var successMessage = document.getElementById('success_message');
    var beeContainer = document.getElementById('bee_container');
    var beeAnimationContainer = document.getElementById('bee_animation_container');


    var successAnimation = lottie.loadAnimation({
        container: successAnimationContainer,
        renderer: 'svg',
        loop: false, 
        autoplay: false,
        path: '/Animation/UspjesnoCheck.json'  
    });

    var beeAnimation = lottie.loadAnimation({
        container: beeAnimationContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/Animation/PcelicaMaja.json'
    });


    function moveBee() {
        beeContainer.style.transition = 'transform 10s linear';
        beeContainer.style.transform = 'translateX(110vw)';

        setTimeout(() => {
            beeContainer.style.transition = 'none';
            beeContainer.style.transform = 'translateX(-10vw)';
            setTimeout(moveBee, 2000); 
        }, 10000); 
    }

    moveBee();
    
    function showSuccessPopup(message) {
        successMessage.innerText = message;
        successPopup.style.display = 'flex';
        successAnimation.goToAndPlay(0, true); 
    }

   
    function hideSuccessPopup() {
        successPopup.style.display = 'none';
    }

    async function Logout(){
        try {
            const response = await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.ok) {
                sessionStorage.removeItem('idUporabnik');
                showSuccessPopup('Uspešno ste se odjavili!');
                await new Promise(resolve => setTimeout(resolve, 2000)); 
                window.location.href = '/';
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error logging out user:', error);
            alert(error.message);
        }
    }
    
    window.navigateToCategory = function(category) {
        window.location.href = '/samoocenitev/izvedbaSamoocenitve/' + category;
    }

    window.navigateTo = function(path) {
        window.location.href = path;
    }

    window.clearStorageAndNavigate = function(category) {
        const keysToRemove = ['seenEntities', 'currentEntities', 'lastChosenEntity', 'currentChoice'];
        keysToRemove.forEach(key => sessionStorage.removeItem(key));
        navigateToCategory(category);
    }

    window.Logout = Logout;
});


function openOverlay() {
    var overlay = document.getElementById('overlay');
    var overlayContent = document.querySelector('.overlay-content');
    overlay.style.display = 'flex'; // Set display to flex to make it visible and to take layout space
    overlay.style.opacity = '1'; // Ensure it's visible
    overlay.style.visibility = 'visible'; // Make sure it's not hidden

    // Use setTimeout to ensure the display change has taken effect before sliding in
    setTimeout(() => {
        overlayContent.style.transform = 'translateY(0)'; // Slide content into view
    }, 10);
}

function closeOverlay() {
    var overlay = document.getElementById('overlay');
    var overlayContent = document.querySelector('.overlay-content');
    overlayContent.style.transform = 'translateY(100%)'; // Slide content out of view

    setTimeout(() => {
        overlay.style.opacity = '0'; // Start fading out
        overlay.style.visibility = 'hidden'; // Fully hide overlay after transition
        overlay.style.display = 'none'; // Finally set display to none
    }, 500); // Ensure timeout matches transition duration
}

