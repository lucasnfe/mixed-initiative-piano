class RulerHead {
    constructor(x, y, width, height) {
        // Use rect as the head bounding box
        this.x = x - width/2 + 0.5;
        this.y = y - height;
        this.width = width;
        this.height = height;
        this.isDragging = false;
        this.setBeat(0);
    }

    setBeat(beat) {
        this.beat = beat;
        this.beat = constrain(this.beat, 0, roll.nColumns - 1);
        this.x = roll.x + this.beat * roll.beatWidth - this.width/2;
    }

    addBeat() {
        this.beat = (this.beat + 1) % roll.nColumns;
        this.x = roll.x + this.beat * roll.beatWidth - this.width/2;
    }

    dragTo(x) {
        this.moveTo(x);
        this.isDragging = true;
    }

    dropTo(x) {
        this.moveTo(x);
        this.isDragging = false;
    }

    moveTo(x) {
        this.x = x - this.width/2 + 0.5;
        this.x = constrain(this.x, roll.x - this.width/2, roll.x - this.width/2 + roll.getLength());
    }

    draw() {
        stroke(0);
        strokeWeight(0);
        fill(20);

        beginShape();
            vertex(this.x, this.y);
            vertex(this.x + this.width, this.y);
            vertex(this.x + this.width, this.y + this.height/2);
            vertex(this.x + this.width/2, this.y + this.height);
            vertex(this.x, this.y + this.height/2);
        endShape(CLOSE);
    }
}

class Ruler {
    constructor(x, y, bodyWidth, bodyHeight, headWidth, headHeight) {
        this.head = new RulerHead(x, y, headWidth, headHeight)

        this.x = x;
        this.y = y;
        this.bodyWidth = bodyWidth;
        this.bodyHeight = bodyHeight;
    }

    update() {
        if (this.head.isDragging) {
            this.updatePosition();
        }
        else {
            this.setBeat(this.head.beat);
        }
    }

    updatePosition() {
        this.x = this.head.x + this.head.width/2 - 0.5;
    }

    setBeat(beatNumber) {
        this.x = roll.x + beatNumber * roll.beatWidth - 0.5;
    }

    mousePressed() {
        this.head.mousePressed();
    }

    mouseDragged() {
        this.head.mouseDragged();
    }

    mouseReleased() {
        this.head.mouseReleased();
    }

    draw() {
        // Draw head
        this.head.draw();

        // Draw body
        stroke(0);
        strokeWeight(0);
        fill(20);

        rect(this.x, this.y, this.bodyWidth, this.bodyHeight);
    }
}
