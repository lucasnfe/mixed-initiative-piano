class Roll {
    constructor(x, y, nRows, nColumns, beatWidth, beatHeight) {
        this.x = x;
        this.y = y;
        this.nRows = nRows;
        this.nColumns = nColumns;
        this.beatWidth = beatWidth;
        this.beatHeight = beatHeight;

        this.isInserting = false;

        this.insertStartPosition = createVector();
        this.insertEndPosition = createVector();

        this.notes = [];
    }

    update() {
        for (let note of this.notes) {
            if (this.isInserting || ruler.head.isDragging) {
                note.setState(RectState.RELEASED);
            }
            else {
                note.update();
            }
        }

        if(this.isInserting) {
            let x = Math.floor((mouseY - this.y)/this.beatHeight);
            let y = Math.floor((mouseX - this.x)/this.beatWidth);

            x = constrain(x, 0, this.nRows - 1);
            y = constrain(y, 0, this.nColumns - 1);

            if (!mouseIsPressed) {
                this.insertStartPosition.x = x;
                this.insertStartPosition.y = y;
            }

            this.insertEndPosition.x = x;
            this.insertEndPosition.y = y;
        }
    }

    draw() {
        if (this.isInserting) {
            let min_y = min(this.insertStartPosition.y, this.insertEndPosition.y);
            let max_y = max(this.insertStartPosition.y, this.insertEndPosition.y);
            this.drawNote(this.insertStartPosition.x, min_y, max_y - min_y + 1);
        }

        for (let note of this.notes) {
            note.draw();
        }
    }

    drawStatic() {
        staticItems.stroke(255);

        for(let i = 0; i < PIANO_NUM_OCTAVES; i++) {
            for (let j = 0; j < N_KEYS_PER_OCTAVE; j++) {
                // White keys
                if (WHITE_KEY_INDEX.has(j)) {
                    staticItems.fill(240);
                }
                else {
                    staticItems.fill(230);
                }

                for (let k = 0; k < this.nColumns; k++) {
                    let note_x = this.x + k * this.beatWidth;
                    let note_y = this.y + (i * N_KEYS_PER_OCTAVE + j) * this.beatHeight;

                    staticItems.rect(note_x, note_y, this.beatWidth, this.beatHeight);
                }
            }

        }
    }

    drawNote(i, j, width = 1, height = 1, strokeColor=255, fillColor=220, weight=1) {
        strokeWeight(weight);
        stroke(strokeColor);
        fill(fillColor);

        let note_x = this.x + j * this.beatWidth;
        let note_y = this.y + i * this.beatHeight;

        rect(note_x, note_y, this.beatWidth * width, this.beatHeight * height);
    }

    deleteNote() {
        let notesToDelete = [];

        for (let note of this.notes) {
            if (note.isPressed()) {
                let indexOfNote = this.notes.indexOf(note);
                notesToDelete.push(indexOfNote);
            }
        }

        for (let indexOfNote of notesToDelete) {
            this.notes[indexOfNote].key.release();
            this.notes.splice(indexOfNote, 1);
        }
    }

    createNote() {
        let i0 = this.insertStartPosition.x;
        let j0 = this.insertStartPosition.y;

        let i1 = this.insertEndPosition.x;
        let j1 = this.insertEndPosition.y;

        let note = null;
        let velocity = 0.5;

        if (j0 <= j1) {
            let duration = j1 - j0 + 1;
            note = new Note(i0, j0, duration, velocity);
        }
        else {
            let duration = j0 - j1 + 1;
            note = new Note(i0, j1, duration, velocity);
        }

        this.notes.push(note);
    }

    mousePressed() {
        for (let note of this.notes) {
            note.mousePressed();
        }
    }

    mouseDragged() {
        for (let note of this.notes) {
            note.mouseDragged();
        }
    }

    mouseReleased() {
        for (let note of this.notes) {
            note.mouseReleased();
        }

        if (this.isInserting) {
            this.createNote();
        }
    }

    getLength() {
        return this.nColumns * this.beatWidth;
    }
}
