const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 8888;

app.use(bodyParser.json());
app.use(cors());

app.get("/notes", (req, res) => {
  fs.readFile("./db.json", (err, data) => {
    try {
      const notes = JSON.parse(data).notes;
      res.status(200).json(notes);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: err });
    }
  });
});

app.post("/notes", (req, res) => {
  fs.readFile("./db.json", (err, data) => {
    try {
      const notes = JSON.parse(data).notes;
      const noteToCreate = { ...req.body, id: +new Date() };
      notes.push(noteToCreate);
      fs.writeFileSync("./db.json", JSON.stringify({ notes: notes }));
      res.status(200).json(noteToCreate);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: err });
    }
  });
});

app.put("/notes/:noteId", (req, res) => {
  const noteIdToUpdate = parseInt(req.params.noteId);
  fs.readFile("./db.json", (err, data) => {
    try {
      const notes = JSON.parse(data).notes;
      const updatedNoteIndex = notes.findIndex(
        (note) => note.id === noteIdToUpdate
      );
      if (updatedNoteIndex === -1) {
        res.status(404).json({ message: "Заметка не найдена." });
      } else {
        const notesCopy = [...notes];
        notesCopy.splice(updatedNoteIndex, 1, req.body);
        fs.writeFileSync("./db.json", JSON.stringify({ notes: notesCopy }));
        res.status(200).json(notesCopy);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: err });
    }
  });
});

app.delete("/notes/:noteId", (req, res) => {
  const noteIdToRemove = parseInt(req.params.noteId);
  fs.readFile("./db.json", (err, data) => {
    try {
      const notes = JSON.parse(data).notes;
      const noteToRemove = notes.find((note) => note.id === noteIdToRemove);
      const filteredNotes = notes.filter((note) => note.id !== noteIdToRemove);
      if (notes.length === filteredNotes.length) {
        res.status(404).json({ message: "Заметка не найдена." });
      } else {
        fs.writeFileSync("./db.json", JSON.stringify({ notes: filteredNotes }));
        res.status(200).json(noteToRemove);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: err });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
