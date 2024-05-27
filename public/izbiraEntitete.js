document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('container-semi-circle');

    // Initialize the semi-circle progress bar
    var progressBar = new ProgressBar.SemiCircle(container, {
        strokeWidth: 6,
        color: '#FFEA82',
        trailColor: '#eee',
        trailWidth: 1,
        easing: 'easeInOut',
        duration: 1400,
        svgStyle: null,
        text: {
            value: '',
            alignToBottom: false
        },
        from: { color: '#FFEA82' },
        to: { color: '#ED6A5A' },
        step: (state, bar) => {
            bar.path.setAttribute('stroke', state.color);
            var value = Math.round(bar.value() * 100);
            if (value === 0) {
                bar.setText('');
            } else {
                bar.setText(value + '%'); // Added '%' for better visualization
            }

            bar.text.style.color = state.color;
        }
    });

    progressBar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    progressBar.text.style.fontSize = '2rem';

    let currentChoice = parseInt(sessionStorage.getItem('currentChoice')) || 0;
    const totalChoices = entities.length;
    let seenEntities = new Set(JSON.parse(sessionStorage.getItem('seenEntities')) || []);
    let currentEntities = JSON.parse(sessionStorage.getItem('currentEntities')) || [];

    progressBar.set(currentChoice / totalChoices);

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
        const progressPercentage = currentChoice / totalChoices;
        progressBar.animate(progressPercentage);
    
        // Parse the current URL to get the `kategorija` parameter
        const url = new URL(window.location.href);
        const kategorija = url.pathname.split('/').pop(); // Assuming kategorija is the last segment in the URL
    
        console.log(kategorija);
        if (currentChoice >= totalChoices) {
            try {
                const entityId = chosenEntity.idEntiteta;
                await fetch(`/samoocenitev/rezultat/${entityId}/${kategorija}`, {
                    method: 'GET',
                });
                window.location.href = `/samoocenitev/rezultat/${entityId}/${kategorija}`;
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

    document.addEventListener('DOMContentLoaded', () => {
        updateEntitiesDisplay();
    });
});
