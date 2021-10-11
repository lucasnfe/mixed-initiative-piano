
class Key extends Rect {
    constructor(x, y, width, height, pitch, color) {
        super(x, y, width, height);
        this.color = color;
        this.pitch = pitch;
        this.isPlayingRoll = false;
    }

    didEnterPressed() {
        this.attack();
    }

    didEnterSelected() {
        this.select();
    }

    didEnterReleased() {
        this.release();
    }

    didExitPressed() {
        this.release();
    }

    didExitSelected() {
        return;
    }

    didExitReleased() {
        return;
    }

    update() {
        if (this.isPlayingRoll) {
            return;
        }

        if (this.isMouseOver()) {
            if (mouseIsPressed) {
                if (this.state == RectState.SELECTED) {
                    this.didExitSelected();
                    this.didEnterPressed();
                }
                else if (this.state == RectState.RELEASED) {
                    this.didExitReleased();
                    this.didEnterPressed();
                }

                this.setState(RectState.PRESSED);
            }
            else {
                if (this.state == RectState.PRESSED) {
                    this.didExitPressed();
                    this.didEnterSelected();
                }
                else if (this.state == RectState.RELEASED) {
                    this.didExitReleased();
                    this.didEnterSelected();
                }

                this.setState(RectState.SELECTED);
            }
        }
        else {
            if (this.state == RectState.SELECTED) {
                this.didExitSelected();
                this.didEnterReleased();
            }
            else if (this.state == RectState.PRESSED) {
                this.didExitPressed();
                this.didEnterReleased();
            }

            this.setState(RectState.RELEASED);
        }
    }

    draw() {
        strokeWeight(1.2);

        switch (this.state) {
            case RectState.RELEASED:
                stroke(0);
                fill(this.color);
                break;
            case RectState.SELECTED:
                stroke(0);
                fill(220);
                break;
            case RectState.PRESSED:
                stroke(0);
                fill(253, 189, 46);
                break;
        }

        super.draw();
    }

    attack(fromRoll = false) {
        this.setState(RectState.PRESSED);
        let note = Tone.Frequency(this.pitch, "midi").toNote();
        piano.sampler.triggerAttack(note);
        this.isPlaying = true;
        this.isPlayingRoll = fromRoll;
    }

    select() {
        if (!this.isPlayingRoll) {
            this.setState(RectState.SELECTED);
        }
    }

    deselect() {
        if (!this.isPlayingRoll) {
            this.setState(RectState.RELEASED);
        }
    }

    release() {
        this.setState(RectState.RELEASED);
        let note = Tone.Frequency(this.pitch, "midi").toNote();
        piano.sampler.triggerRelease(note);
        this.isPlayingRoll = false;
    }

    attackRelease(duration, fromRoll = false) {
        var _this = this;
        this.attack(fromRoll);
        console.log("attack");

        Tone.Transport.scheduleOnce(() => {
            console.log("released");
            _this.release();
        }, "+" + duration);
    }
}
