let currentChoice = parseInt(sessionStorage.getItem('currentChoice')) || 0;
const totalChoices = 10;
let seenEntities = new Set(JSON.parse(sessionStorage.getItem('seenEntities')) || []);
const progressBar = new ProgressBar.Circle('#progress-bar', {
    strokeWidth: 6,
    easing: 'easeInOut',
    duration: 1400,
    color: '#76c7c0',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: null,
    text: {
        value: '0%',
        style: {
            color: '#999',
            position: 'absolute',
            left: '50%',
            top: '50%',
            padding: 0,
            margin: 0,
            transform: 'translate(-50%, -50%)',
            fontSize: '20px'
        }
    },
    from: { color: '#76c7c0' },
    to: { color: '#76c7c0' },
    step: (state, circle) => {
        const value = Math.round(circle.value() * 100);
        circle.setText(value === 0 ? '' : value + '%');
    }
});

progressBar.set(currentChoice / totalChoices);

let currentEntities = JSON.parse(sessionStorage.getItem('currentEntities')) || [0, 1];
if (seenEntities.size === 0) {
    seenEntities.add(0);
    seenEntities.add(1);
}

function getNextEntityIndex(excludeIndex) {
    let nextIndex;
    do {
        nextIndex = Math.floor(Math.random() * entities.length);
    } while (seenEntities.has(nextIndex) || nextIndex === excludeIndex);
    seenEntities.add(nextIndex);
    sessionStorage.setItem('seenEntities', JSON.stringify(Array.from(seenEntities)));
    return nextIndex;
}

function handleChoice(index) {
    const chosenEntity = entities[currentEntities[index]];
    const nextEntityIndex = getNextEntityIndex(currentEntities[index]);

    if (index === 0) {
        currentEntities = [currentEntities[0], nextEntityIndex];
    } else {
        currentEntities = [currentEntities[1], nextEntityIndex];
    }

    sessionStorage.setItem('currentEntities', JSON.stringify(currentEntities));
    animateEntities();
    setTimeout(() => {
        updateEntitiesDisplay();
        updateProgress();
        saveChosenEntity(chosenEntity);
    }, 500); // Delay to match the animation duration
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

function updateProgress() {
    currentChoice++;
    sessionStorage.setItem('currentChoice', currentChoice);
    const progressPercentage = currentChoice / totalChoices;
    progressBar.animate(progressPercentage);
    //const result = JSON.parse(sessionStorage.getItem('lastChosenEntity'));
    //let lastChosenEntityId = result.idEntiteta;
    if (currentChoice >= totalChoices || seenEntities.size >= entities.length) {
        alert('Selection process completed!');
        //window.location.href = '/samoocenitev/rezultat/' + lastChosenEntityId;
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
