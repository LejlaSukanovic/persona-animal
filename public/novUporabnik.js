document.addEventListener("DOMContentLoaded", function () {
    var beeContainer = document.getElementById('bee_container');
    var beeAnimationContainer = document.getElementById('bee_animation_container');

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






});