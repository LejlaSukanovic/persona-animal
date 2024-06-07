document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
});

function showModal(idEntiteta) {
    const modal = document.getElementById('deleteModal');
    const deleteForm = document.getElementById('deleteForm');
    deleteForm.action = `/admin/delete/${idEntiteta}`;
    modal.style.display = 'block';
}

document.getElementById('cancelButton').addEventListener('click', function() {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'none';
});

window.onclick = function(event) {
    const modal = document.getElementById('deleteModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

function addUjemanje() {
    const container = document.getElementById('ujemanjeContainer');
    const newGroup = document.createElement('div');
    newGroup.className = 'ujemanje-group';
    newGroup.innerHTML = `
        <input type="text" name="ujemanjeEntity[]" placeholder="Ime Entitete" class="ujemanje-input" required>
        <input type="number" name="ocenaUjemanja[]" placeholder="Ocena Ujemanja" class="ujemanje-input" min="0" max="10" required>
    `;
    container.appendChild(newGroup);
}
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
});
