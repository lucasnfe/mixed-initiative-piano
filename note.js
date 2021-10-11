let NOTE_EDIT_DIST = 5;

class Note extends Rect {
    constructor(i, j, duration, velocity) {
        let x = roll.x + j * roll.beatWidth;
        let y = roll.y + i * roll.beatHeight;
        let width = duration * roll.beatWidth;
        let height = roll.beatHeight;

        super(x, y, width, height);

        this.i = i;
        this.j = j;
        this.key = piano.getKeyWithRow(this.i);
        this.duration = duration;
        this.velocity = velocity;

        this.clickWidth = 0;
        this.clickPos = createVector(0, 0);
        this.clickDelta = createVector(0, 0);

        this.allowEdit = 0;
        this.isEditing = false;
    }

    mousePressed() {
        if (this.isMouseOver()) {
            this.clickWidth = this.width;

            this.clickPos.x = this.x;
            this.clickPos.y = this.y;

            this.clickDelta.x = this.x - mouseX;
            this.clickDelta.y = this.y - mouseY;
            this.state = RectState.PRESSED;

            this.key.attackRelease(this.duration * Tone.Time(BEAT_LENGTH), true);

            if (this.allowEdit > 0) {
                this.isEditing = true;
            }
        }
        else {
            this.state = RectState.RELEASED;
        }
    }

    mouseDragged() {
        if (this.isPressed()) {
            if (this.isEditing) {
                if (this.allowEdit == 1) {
                    this.x = mouseX;
                    this.x = constrain(this.x, roll.x, this.clickPos.x + this.clickWidth - roll.beatWidth);
                    this.width = this.clickWidth + (this.clickPos.x - this.x);
                }
                else if (this.allowEdit == 2) {
                    let newX = constrain(mouseX, this.clickPos.x + roll.beatWidth, roll.x + roll.getLength());
                    this.width = (newX - this.clickPos.x);
                }
            }
            else {
                this.i = floor((mouseY - roll.y)/roll.beatHeight);
                this.j = floor((mouseX - roll.x + this.clickDelta.x)/roll.beatWidth);

                this.i = constrain(this.i, 0, roll.nRows - 1);
                this.j = constrain(this.j, 0, roll.nColumns - this.duration);

                this.x = roll.x + this.j * roll.beatWidth;
                this.y = roll.y + this.i * roll.beatHeight;

                this.key = piano.getKeyWithRow(this.i);
            }

        }
    }

    mouseReleased() {
        if (this.allowEdit == 1) {
            this.j = round((this.x - roll.x)/roll.beatWidth);
            this.x = roll.x + this.j * roll.beatWidth;

            this.duration = round(this.width/roll.beatWidth);
            this.width = this.duration * roll.beatWidth;
        }
        else if (this.allowEdit == 2) {
            this.duration = round(this.width/roll.beatWidth);
            this.width = this.duration * roll.beatWidth;
        }

        this.allowEdit = 0;
        this.isEditing = false;
    }

    update() {
        if (this.isEditing) {
            cursor("ew-resize");
        }

        if (this.isMouseOver()) {
            if(this.isReleased()) {
                this.setState(RectState.SELECTED);
            }

            if (!this.isEditing) {
                let editDeltaLeft  = abs(this.x - mouseX);
                let editDeltaRight = abs(this.x + this.width - mouseX);

                if (editDeltaLeft < NOTE_EDIT_DIST) {
                    cursor("ew-resize");
                    this.allowEdit = 1;
                }
                else if (editDeltaRight < NOTE_EDIT_DIST) {
                    cursor("ew-resize");
                    this.allowEdit = 2;
                }
            }
        }
        else {
            if(this.isSelected()) {
                this.setState(RectState.RELEASED);
            }
        }
    }

    draw() {
        strokeWeight(0.8);

        switch (this.state) {
            case RectState.RELEASED:
                stroke(255);
                fill(253, 189, 46);
                break;
            case RectState.SELECTED:
                stroke(255);
                fill(233, 169, 26);
                break;
            case RectState.PRESSED:
                stroke(0);
                fill(233, 169, 26);
                break;
        }

        super.draw();
    }
}
