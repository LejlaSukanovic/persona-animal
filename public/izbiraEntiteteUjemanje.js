document.addEventListener('DOMContentLoaded', function() {
    let currentChoice = parseInt(sessionStorage.getItem('currentChoice')) || 0;
    const totalChoices = entities.length;
    let seenEntities = new Set(JSON.parse(sessionStorage.getItem('seenEntities')) || []);
    let currentEntities = JSON.parse(sessionStorage.getItem('currentEntities')) || [];
    const loadingElement = document.getElementById('loading');
    const mainContent = document.querySelector('.main-content');

    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const arrowLeft = document.getElementById('arrow-left');
    const arrowRight = document.getElementById('arrow-right');

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
                arrowLeft.style.width = '50px';
                arrowLeft.style.height = '50px';
                arrowRight.style.width = '38px';
                arrowRight.style.height = '38px';
            } else {
                currentEntities = [nextEntityIndex, currentEntities[1]];
                arrowRight.style.width = '50px';
                arrowRight.style.height = '50px';
                arrowLeft.style.width = '38px';
                arrowLeft.style.height = '38px';
            }

            sessionStorage.setItem('currentEntities', JSON.stringify(currentEntities));
            await animateEntities(index);
            updateEntitiesDisplay(index);
            await updateProgress(chosenEntity);
            saveChosenEntity(chosenEntity);
        } catch (error) {
            console.error('Error handling choice:', error);
        }
    }

    function animateEntities(selectedIndex) {
        return new Promise(resolve => {
            const entity1 = document.getElementById('entity1');
            const entity2 = document.getElementById('entity2');

            if (selectedIndex === 0) {
                entity2.classList.add('fade-out');
            } else {
                entity1.classList.add('fade-out');
            }

            setTimeout(() => {
                if (selectedIndex === 0) {
                    entity2.classList.remove('fade-out');
                    entity2.classList.add('fade-in');
                } else {
                    entity1.classList.remove('fade-out');
                    entity1.classList.add('fade-in');
                }
                resolve();
            }, 500);
        });
    }

    function updateEntitiesDisplay(selectedIndex) {
        const entity1 = document.getElementById('entity1');
        const entity2 = document.getElementById('entity2');
        const entityName1 = document.querySelector('.entity-wrapper[data-index="0"] .entity-name');
        const entityName2 = document.querySelector('.entity-wrapper[data-index="1"] .entity-name');

        if (selectedIndex === 0) {
            entity2.querySelector('img').src = entities[currentEntities[1]].slika;
            entityName2.innerText = entities[currentEntities[1]].naziv;
            entity2.setAttribute('data-index', currentEntities[1]);
        } else {
            entity1.querySelector('img').src = entities[currentEntities[0]].slika;
            entityName1.innerText = entities[currentEntities[0]].naziv;
            entity1.setAttribute('data-index', currentEntities[0]);
        }

        setTimeout(() => {
            entity1.classList.remove('fade-in');
            entity2.classList.remove('fade-in');
        }, 500);
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
            if (mainContent) mainContent.style.display = 'none';
            if (loadingElement) loadingElement.style.display = 'block';

            try {
                const entityId = chosenEntity.idEntiteta;
                await fetch(`/ujemanje/rezultat/${entityId}/${userId}/${kategorija}`, {
                    method: 'GET',
                });
                window.location.href = `/ujemanje/rezultat/${entityId}/${userId}/${kategorija}?ime=${encodeURIComponent(imeUporabnika)}`;
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
            const index = parseInt(this.parentElement.getAttribute('data-index'), 10);
            handleChoice(index);
        });
    });

    updateEntitiesDisplay(0);
    updateProgressBar();
});
