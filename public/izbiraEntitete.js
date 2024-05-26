let currentChoice = 0;
const totalChoices = 10;
let seenEntities = new Set();
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

progressBar.set(0);

let currentEntities = [0, 1];
seenEntities.add(0);
seenEntities.add(1);

function getNextEntityIndex(excludeIndex) {
    let nextIndex;
    do {
        nextIndex = Math.floor(Math.random() * entities.length);
    } while (seenEntities.has(nextIndex) || nextIndex === excludeIndex);
    seenEntities.add(nextIndex);
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

    updateEntitiesDisplay();
    updateProgress();
    saveChosenEntity(chosenEntity);
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
    const progressPercentage = currentChoice / totalChoices;
    progressBar.animate(progressPercentage);

    if (currentChoice >= totalChoices) {
        alert('Selection process completed!');
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
