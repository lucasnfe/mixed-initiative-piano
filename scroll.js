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
            this.x = constrain(this.x, roll.x, windowWidth - this.width);
            scroll = -map(this.x, roll.x, windowWidth - this.width, 0, roll.x + roll.getLength() - windowWidth);
        }
    }

    mouseReleased() {
        this.setState(RectState.RELEASED);
    }

    moveLeft(speed=2) {
        this.x += -speed;
        this.x = constrain(this.x, roll.x, windowWidth - this.width);
        scroll = -map(this.x, roll.x, windowWidth - this.width, 0, roll.x + roll.getLength() - windowWidth);
    }

    moveRight(speed=2) {
        this.x += speed;
        this.x = constrain(this.x, roll.x, windowWidth - this.width);
        scroll = -map(this.x, roll.x, windowWidth - this.width, 0, roll.x + roll.getLength() - windowWidth);
    }

    draw() {
        fill(100);
        rect(this.x, this.y, this.width, this.height, 20);
    }
}
