const MAX_PITCH = 96;
const WHITE_KEY_INDEX = new Set([0, 2, 4, 6, 7, 9, 11]);
const BLACK_KEY_INDEX = new Set([1, 3, 5, 8, 10]);
const N_KEYS_PER_OCTAVE = WHITE_KEY_INDEX.size + BLACK_KEY_INDEX.size;

class PianoRoll {
    constructor(x, y, width, height, nOctaves) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.nOctaves = nOctaves;
        this.nKeys = nOctaves * N_KEYS_PER_OCTAVE;
        this.isPlaying = false;

        this.keyWidth = this.width;
        this.keyHeight = this.height/(this.nOctaves * WHITE_KEY_INDEX.size);

        this.createSampler();
        this.createKeys(nOctaves);
    }

    getKeyWithRow(i) {
        return this.keys[i];
    }

    createSampler() {
        // Create sampler with salamder samples
        this.sampler = new Tone.Sampler({
            "A0" : "A0.[mp3|ogg]",
            "C1" : "C1.[mp3|ogg]",
            "D#1" : "Ds1.[mp3|ogg]",
            "F#1" : "Fs1.[mp3|ogg]",
            "A1" : "A1.[mp3|ogg]",
            "C2" : "C2.[mp3|ogg]",
            "D#2" : "Ds2.[mp3|ogg]",
            "F#2" : "Fs2.[mp3|ogg]",
            "A2" : "A2.[mp3|ogg]",
            "C3" : "C3.[mp3|ogg]",
            "D#3" : "Ds3.[mp3|ogg]",
            "F#3" : "Fs3.[mp3|ogg]",
            "A3" : "A3.[mp3|ogg]",
            "C4" : "C4.[mp3|ogg]",
            "D#4" : "Ds4.[mp3|ogg]",
            "F#4" : "Fs4.[mp3|ogg]",
            "A4" : "A4.[mp3|ogg]",
            "C5" : "C5.[mp3|ogg]",
            "D#5" : "Ds5.[mp3|ogg]",
            "F#5" : "Fs5.[mp3|ogg]",
            "A5" : "A5.[mp3|ogg]",
            "C6" : "C6.[mp3|ogg]",
            "D#6" : "Ds6.[mp3|ogg]",
            "F#6" : "Fs6.[mp3|ogg]",
            "A6" : "A6.[mp3|ogg]",
            "C7" : "C7.[mp3|ogg]",
            "D#7" : "Ds7.[mp3|ogg]",
            "F#7" : "Fs7.[mp3|ogg]",
            "A7" : "A7.[mp3|ogg]",
            "C8" : "C8.[mp3|ogg]"
        }, {
            "release" : 1,
            "baseUrl" : "./samples/salamander/"
        }).toDestination();
    }

    play(time) {
        var _this = this;

        this.isPlaying = true;

        // telling the transport to execute our callback function every eight note.
        Tone.Transport.scheduleRepeat(function(time) {
            for (let note of roll.notes) {
                if (note.j == ruler.head.beat) {
                    note.key.attackRelease(note.duration * Tone.Time(BEAT_LENGTH), true);
                }
            }

            ruler.head.addBeat();
        }, BEAT_LENGTH);
    }

    cancel() {
        for(let note of roll.notes) {
            note.key.release();
        }
    }

    pause() {
        Tone.Transport.cancel();
        this.cancel();
        this.isPlaying = false;
    }

    createKeys() {
        this.keys = [];

        let keyY = this.y;
        let pitch = MAX_PITCH - 1;

        for (let i = 0; i < this.nOctaves; i++) {
            for (let j = 0; j < N_KEYS_PER_OCTAVE; j++) {
                // White key
                if (WHITE_KEY_INDEX.has(j)) {
                    let key = new Key(this.x, keyY, this.keyWidth, this.keyHeight, pitch, 255);
                    this.keys.push(key);

                    if (BLACK_KEY_INDEX.has(j + 1)) {
                        keyY += this.keyHeight/1.35;
                    }
                    else {
                        keyY += this.keyHeight;
                    }
                }
                else {
                    let key = new Key(this.x, keyY, this.keyWidth/2, this.keyHeight/2, pitch, 0);
                    this.keys.push(key);

                    keyY += this.keyHeight/4;
                }

                pitch--;
            }
        }
    }

    mousePressed() {
        for (let key of this.keys) {
            if (key.isBlack() && key.mousePressed()) {
                return true;
            }
        }

        for (let key of this.keys) {
            if (!key.isBlack() && key.mousePressed()) {
                return true;
            }
        }

        return false;
    }

    mouseDragged() {
        for (let key of this.keys) {
            key.mouseDragged();
        }
    }

    mouseReleased() {
        for (let key of this.keys) {
            key.mouseReleased();
        }
    }

    update() {
        let activeKey = null;

        for (let key of this.keys) {
            if (key.isBlack()) {
                key.update();

                if (key.isSelected() || key.isPressed()) {
                    activeKey = key;
                }
            }
        }

        for (let key of this.keys) {
            if (!key.isBlack()) {
                key.update();

                if (activeKey) {
                    if (key.isSelected()) {
                        key.deselect();
                    }
                }
            }
        }
    }

    draw() {
        // Draw white keys
        for (let key of this.keys) {
            if (key.color == 255) {
                key.draw();
            }
        }

        // Draw black keys
        for (let key of this.keys) {
            if (key.color == 0) {
                key.draw();
            }
        }
    }
}
