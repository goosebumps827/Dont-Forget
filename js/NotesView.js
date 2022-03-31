export default class NotesView {
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;
        this.root.innerHTML = `
            <div class="notesSidebar">
                <button class="notesAdd" type="button">Add Note</button>
                <div class="notesList"></div>
            </div>
            <div class="notesPreview">
                <input class="notesTitle" type="text" placeholder="New Note...">
                <textarea class="notesBody">Take Note...</textarea>
            </div>
        `;

        const btnAddNote = this.root.querySelector(".notesAdd");
        const inpTitle = this.root.querySelector(".notesTitle");
        const inpBody = this.root.querySelector(".notesBody");

        btnAddNote.addEventListener("click", () => {
            this.onNoteAdd();
        });

        [inpTitle, inpBody].forEach(inputField => {
            inputField.addEventListener("blur", () => {
                const updatedTitle = inpTitle.value.trim();
                const updatedBody = inpBody.value.trim();

                this.onNoteEdit(updatedTitle, updatedBody);
            });
        });

        this.updateNotePreviewVisibility(false);
    }

    _createListItemHTML(id, title, body, updated) {
        const MAX_BODY_LENGTH = 60;

        return `
            <div class="notesListItem" dataNoteId="${id}">
                <div class="notesSmallTitle">${title}</div>
                <div class="notesSmallBody">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>
                <div class="notesSmallUpdated">
                    ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>
            </div>
        `;
    }

    updateNoteList(notes) {
        const notesListContainer = this.root.querySelector(".notesList");

        // Empty list
        notesListContainer.innerHTML = "";

        for (const note of notes) {
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));

            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        // Add select/delete events for each list item
        notesListContainer.querySelectorAll(".notesListItem").forEach(noteListItem => {
            noteListItem.addEventListener("click", () => {
                this.onNoteSelect(noteListItem.dataset.noteId);
            });

            noteListItem.addEventListener("dblclick", () => {
                const doDelete = confirm("Are you sure you want to delete this note?");

                if (doDelete) {
                    this.onNoteDelete(noteListItem.dataset.noteId);
                }
            });
        });
    }

    updateActiveNote(note) {
        this.root.querySelector(".notesTitle").value = note.title;
        this.root.querySelector(".notesBody").value = note.body;

        this.root.querySelectorAll(".notesListItem").forEach(noteListItem => {
            noteListItem.classList.remove("notesListItemSelected");
        });

        this.root.querySelector(`.notesListItem[dataNoteId="${note.id}"]`).classList.add("notesListItemSelected");
    }

    updateNotePreviewVisibility(visible) {
        this.root.querySelector(".notesPreview").style.visibility = visible ? "visible" : "hidden";
    }
}