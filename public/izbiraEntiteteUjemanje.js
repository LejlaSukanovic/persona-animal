document.addEventListener('DOMContentLoaded', function() {
    let currentChoice = parseInt(sessionStorage.getItem('currentChoice')) || 0;
    const totalChoices = entities.length;
    let seenEntities = new Set(JSON.parse(sessionStorage.getItem('seenEntities')) || []);
    let currentEntities = JSON.parse(sessionStorage.getItem('currentEntities')) || [];
    const loadingElement = document.getElementById('loading');
    const mainContent = document.getElementById('main-content');


    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    function updateProgressBar() {
        const progressPercentage = (currentChoice / totalChoices) * 100;
        progressBar.style.width = progressPercentage + '%';
        progressBar.setAttribute('aria-valuenow', progressPercentage);
        progressText.innerText = `${currentChoice}/${totalChoices}`;
    }

    if (seenEntities.size === 0) {
        // Initialize with the first two entities
        currentEntities = [0, 1];
        seenEntities.add(0);
        seenEntities.add(1);
        sessionStorage.setItem('currentEntities', JSON.stringify(currentEntities));
        sessionStorage.setItem('seenEntities', JSON.stringify(Array.from(seenEntities)));
    }

    function getNextEntityIndex(excludeIndex) {
        const remainingEntities = entities.map((_, index) => index).filter(index => !seenEntities.has(index) && index !== excludeIndex);

        if (remainingEntities.length === 0) {
            // If all entities have been seen, clear the set and restart
            seenEntities.clear();
            sessionStorage.setItem('seenEntities', JSON.stringify(Array.from(seenEntities)));
            return getNextEntityIndex(excludeIndex);
        }

        const nextIndex = remainingEntities[Math.floor(Math.random() * remainingEntities.length)];
        seenEntities.add(nextIndex);
        sessionStorage.setItem('seenEntities', JSON.stringify(Array.from(seenEntities)));
        return nextIndex;
    }

    async function handleChoice(index) {
        try {
            const chosenEntity = entities[currentEntities[index]];
            const nextEntityIndex = getNextEntityIndex(currentEntities[index]);

            if (index === 0) {
                currentEntities = [currentEntities[0], nextEntityIndex];
            } else {
                currentEntities = [currentEntities[1], nextEntityIndex];
            }

            sessionStorage.setItem('currentEntities', JSON.stringify(currentEntities));
            animateEntities();
            setTimeout(async () => {
                updateEntitiesDisplay();
                await updateProgress(chosenEntity);
                saveChosenEntity(chosenEntity);
            }, 500); // Delay to match the animation duration
        } catch (error) {
            console.error('Error handling choice:', error);
        }
    }

    function animateEntities() {
        const entity1 = document.getElementById('entity1');
        const entity2 = document.getElementById('entity2');

        entity1.classList.add('fade-out');
        entity2.classList.add('fade-out');

        setTimeout(() => {
            entity1.classList.remove('fade-out');
            entity2.classList.remove('fade-out');
            entity1.classList.add('fade-in');
            entity2.classList.add('fade-in');

            setTimeout(() => {
                entity1.classList.remove('fade-in');
                entity2.classList.remove('fade-in');
            }, 500);
        }, 500);
    }

    function updateEntitiesDisplay() {
        const entity1 = document.getElementById('entity1');
        const entity2 = document.getElementById('entity2');

        entity1.querySelector('img').src = entities[currentEntities[0]].slika;
        entity1.querySelector('p').innerText = entities[currentEntities[0]].naziv;
        entity1.setAttribute('data-index', currentEntities[0]);

        entity2.querySelector('img').src = entities[currentEntities[1]].slika;
        entity2.querySelector('p').innerText = entities[currentEntities[1]].naziv;
        entity2.setAttribute('data-index', currentEntities[1]);
    }

    async function updateProgress(chosenEntity) {
        currentChoice++;
        sessionStorage.setItem('currentChoice', currentChoice);
        updateProgressBar();
    
        // Function to extract the user ID from the URL
        function extractUserId(url) {
            const segments = url.split('/');
            const index = segments.indexOf('izbiraEntitete');
            if (index !== -1 && index + 1 < segments.length) {
                return segments[index + 1];
            } else {
                throw new Error("User ID not found in the URL");
            }
        }
    
        // Parse the current URL to get the `kategorija` parameter
        const url = new URL(window.location.href);
        const kategorija = url.pathname.split('/').pop(); // Assuming kategorija is the last segment in the URL
        console.log(kategorija);
    
        // Extract the user ID from the current URL
        let userId;
        try {
            userId = extractUserId(url.pathname);
        } catch (error) {
            console.error('Error extracting user ID: ', error);
            return; // Exit the function if the user ID is not found
        }
    
        if (currentChoice >= totalChoices) {
            // Show loading component and hide main content
            mainContent.style.display = 'none';
            loadingElement.style.display = 'block';
    
            try {
                const entityId = chosenEntity.idEntiteta;
                await fetch(`/ujemanje/rezultat/${entityId}/${userId}/${kategorija}`, {
                    method: 'GET',
                });
                window.location.href = `/ujemanje/rezultat/${entityId}/${userId}/${kategorija}`;
            } catch (error) {
                console.error('Error updating Firestore: ', error);
            }
        }
    }
    
    

    function saveChosenEntity(entity) {
        sessionStorage.setItem('lastChosenEntity', JSON.stringify(entity));
    }

    document.querySelectorAll('.entity').forEach(entity => {
        entity.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'), 10) === currentEntities[0] ? 0 : 1;
            handleChoice(index);
        });
    });

    updateEntitiesDisplay();
    updateProgressBar();
});
