class Minimap {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.beatWidth = this.width/roll.nColumns;
        console.log(this.width, this.beatWidth);
        this.beatHeight = this.height/roll.nRows;
    }

    draw() {
        fill(240);
        noStroke();
        rect(this.x, this.y, this.width, this.height);

        for(let note of roll.notes) {
            let x = this.x + note.j * this.beatWidth;
            let y = this.y + note.i * this.beatHeight;
            let width = note.duration * this.beatWidth;
            let height = this.beatHeight;

            fill(253, 189, 46);
            rect(x, y, width, height);
        }
    }
}
