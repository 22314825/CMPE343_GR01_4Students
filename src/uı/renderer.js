const tableBody = document.getElementById('dataTableBody');
const oldTableBody = document.getElementById('oldValuesTableBody');
const indexInput = document.getElementById('indexInput');
const valueInput = document.getElementById('valueInput');

// Hold old values (index → oldValue)
let oldValues = {};

// Clear inputs
function clearInputs() {
    indexInput.value = '';
    valueInput.value = '';
}

// Refresh OLD VALUES TABLE
function refreshOldValuesTable() {
    oldTableBody.innerHTML = "";

    for (const idx in oldValues) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${idx}</td>
            <td>${oldValues[idx]}</td>
        `;
        oldTableBody.appendChild(row);
    }
}

// Update main table
function updateTable(data) {
    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = item.index;
        row.insertCell(1).textContent = item.value;
    });
}

// Request initial data
window.electronAPI.getData();

// IPC responses
window.electronAPI.handleDataLoaded((data) => updateTable(data));
window.electronAPI.handleDataUpdated((data) => updateTable(data));
window.electronAPI.handleError((msg) => alert(msg));


// -------- INSERT --------
document.getElementById('insertBtn').addEventListener('click', () => {
    const index = indexInput.value.trim();
    const value = valueInput.value.trim();

    if (!index || !value) {
        alert("Index and Value are required!");
        return;
    }

    window.electronAPI.insertData({ index, value });

    // INSERT → old value eklenmez (çünkü eski değer yok)
    clearInputs();
});


// -------- UPDATE --------
document.getElementById('updateBtn').addEventListener('click', () => {
    const index = indexInput.value.trim();
    const value = valueInput.value.trim();

    if (!index || !value) {
        alert("Index and Value required.");
        return;
    }

    // Upper tabledaki mevcut değerleri almak için DOM'dan okuyoruz:
    let oldValue = null;
    let rows = tableBody.getElementsByTagName("tr");

    for (let row of rows) {
        if (row.cells[0].textContent === index) {
            oldValue = row.cells[1].textContent;
            break;
        }
    }

    // Eğer bu index daha önce update edilmedi ise eski değer kaydedilir
    if (oldValue !== null && !(index in oldValues)) {
        oldValues[index] = oldValue;
        refreshOldValuesTable();
    }

    window.electronAPI.updateData({ index, value });

    clearInputs();
});


// -------- DELETE --------
document.getElementById('deleteBtn').addEventListener('click', () => {
    const index = indexInput.value.trim();

    if (!index) {
        alert("Enter an index to delete.");
        return;
    }

    // OldValues tablosundan da sil
    if (oldValues[index]) {
        delete oldValues[index];
        refreshOldValuesTable();
    }

    window.electronAPI.deleteData(index);
    clearInputs();
});
