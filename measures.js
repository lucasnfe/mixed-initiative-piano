class Measures extends Rect {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }

    update() {
        if (this.isPressed()) {
            if (mouseX > WINDOW_WIDTH - MEASURE_SCROLL_AREA) {
                horizontalScroll.moveRight();
                ruler.head.dragTo(-scroll + mouseX);
                ruler.updatePosition();
            }
            else if (mouseX < ROLL_X) {
                horizontalScroll.moveLeft();
                ruler.head.dragTo(-scroll + mouseX);
                ruler.updatePosition();
            }
        }
    }

    mousePressed() {
        if (this.isMouseOver()) {
            this.setState(RectState.PRESSED);

            piano.pause();
            ruler.head.dragTo(-scroll + mouseX);
        }
    }

    mouseDragged() {
        if (mouseIsPressed && this.isPressed()) {
            piano.pause();
            ruler.head.dragTo(-scroll + mouseX)
        }
    }

    mouseReleased() {
        if (this.isPressed()) {
            ruler.head.dropTo(-scroll + mouseX);

            let beat = round((-scroll + mouseX - roll.x)/roll.beatWidth);
            ruler.head.setBeat(beat);
        }

        this.setState(RectState.RELEASED);
    }

    draw() {
        staticItems.textSize(12);
        staticItems.stroke(0);
        staticItems.fill(0);

        let measure_div = Tone.Time("1m")/Tone.Time(BEAT_LENGTH);
        let quarter_div = Tone.Time("4n")/Tone.Time(BEAT_LENGTH);

        for (let j0 = 0; j0 < roll.nColumns/measure_div; j0++) {
            let x0 = this.x + j0 * BEAT_WIDTH * measure_div;
            let y0 = this.y;

            staticItems.strokeWeight(0);
            staticItems.text(j0, x0 + 5, y0 + 12);

            staticItems.strokeWeight(1);
            staticItems.line(x0, y0, x0, y0 + this.height);

            for (let j1 = quarter_div; j1 < measure_div; j1 += quarter_div) {
                let x1 = this.x + (j0 * measure_div + j1) * BEAT_WIDTH;
                let y1 = this.y + this.height/2;

                staticItems.line(x1, y1, x1, y1 + this.height/2);
            }
        }
    }
}
