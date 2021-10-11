var RectState = {
  RELEASED: 0,
  SELECTED: 1,
  PRESSED:  2
};

class Rect {
    constructor(x, y, width, height)  {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.state = RectState.RELEASED;
    }

    isPressed() {
        return this.state == RectState.PRESSED;
    }

    isSelected() {
        return this.state == RectState.SELECTED;
    }

    isReleased() {
        return this.state == RectState.RELEASED;
    }

    draw() {
        rect(this.x, this.y, this.width, this.height);
    }

    mousePressed() {
    }

    mouseReleased() {
    }

    mouseDragged() {
    }

    isMouseOver() {
        var minX = this.x
        var maxX = this.x + this.width
        var minY = this.y
        var maxY = this.y + this.height

        if (mouseX >= minX && mouseX <= maxX && mouseY >= minY && mouseY <= maxY) {
            return true;
         }

         return false;
    }

    setState(state) {
        this.state = state;
    }
}
