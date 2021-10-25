class Scroll extends Rect {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.clickDelta = createVector(0, 0);
    }

    mousePressed() {
        if (this.isMouseOver()) {
            this.clickDelta.x = this.x - mouseX;
            this.clickDelta.y = this.y - mouseY;

            this.setState(RectState.PRESSED);
        }
    }

    mouseDragged() {
        if (this.isPressed()) {
            this.x = mouseX + this.clickDelta.x;
            this.x = constrain(this.x, roll.x, WINDOW_WIDTH - this.width);
            scroll = -map(this.x, roll.x, WINDOW_WIDTH - this.width, 0, roll.x + roll.getLength() - WINDOW_WIDTH);
        }
    }

    mouseReleased() {
        this.setState(RectState.RELEASED);
    }

    moveLeft(speed=2) {
        this.x += -speed;
        this.x = constrain(this.x, roll.x, WINDOW_WIDTH - this.width);
        scroll = -map(this.x, roll.x, WINDOW_WIDTH - this.width, 0, roll.x + roll.getLength() - WINDOW_WIDTH);
    }

    moveRight(speed=2) {
        this.x += speed;
        this.x = constrain(this.x, roll.x, WINDOW_WIDTH - this.width);
        scroll = -map(this.x, roll.x, WINDOW_WIDTH - this.width, 0, roll.x + roll.getLength() - WINDOW_WIDTH);
    }

    draw() {
        fill(100);
        noStroke();
        rect(this.x, this.y, this.width, this.height, 20);
    }
}
