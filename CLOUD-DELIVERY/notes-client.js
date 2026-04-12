async function fetchNotesFromServer() {
    try {
        const res = await fetch('/notes');
        if (!res.ok) throw new Error('Failed to fetch notes');
        return await res.json();
    } catch (err) {
        return null;
    }
}

function getLocalNotes() {
    return JSON.parse(localStorage.getItem('incloud_notes') || '[]');
}

function renderSubjectNotes(notes, subject) {
    const filtered = notes.filter(n => n.subject === subject);
    if (filtered.length === 0) return;
    const ul = document.querySelector('ul');
    filtered.forEach(n => {
        const li = document.createElement('li');
        li.innerHTML = `<a class="note-link" href="${n.link}" target="_blank">${n.icon || '📄'} ${n.title}${n.unit ? ' – ' + n.unit : ''}</a>`;
        ul.appendChild(li);
    });
}

async function loadDynamicNotes(subject) {
    let notes = await fetchNotesFromServer();
    if (!notes) notes = getLocalNotes();
    renderSubjectNotes(notes, subject);
}
