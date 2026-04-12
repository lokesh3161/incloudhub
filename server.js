const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'notes.json');
const STATIC_DIR = path.join(__dirname, 'CLOUD-DELIVERY');

app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(express.static(STATIC_DIR));

function readNotes() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

function saveNotes(notes) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2), 'utf8');
}

app.get('/notes', (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

app.post('/notes', (req, res) => {
  const note = req.body;
  if (!note || !note.subject || !note.link || !note.title) {
    return res.status(400).json({ error: 'Invalid note payload' });
  }

  const notes = readNotes();
  const exists = notes.some(n => n.id === note.id);
  if (exists) {
    return res.status(409).json({ error: 'Note already exists' });
  }

  notes.push(note);
  saveNotes(notes);
  res.status(201).json(note);
});

app.delete('/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const notes = readNotes();
  const filtered = notes.filter(n => n.id !== id);
  if (filtered.length === notes.length) {
    return res.status(404).json({ error: 'Note not found' });
  }
  saveNotes(filtered);
  res.json({ success: true });
});

app.delete('/notes', (req, res) => {
  const subject = req.query.subject;
  let notes = readNotes();
  if (subject) {
    notes = notes.filter(n => n.subject !== subject);
  } else {
    notes = [];
  }
  saveNotes(notes);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
