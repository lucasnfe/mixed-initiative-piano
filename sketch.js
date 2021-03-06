const PIANO_X = 0;
const PIANO_Y = 80;
const PIANO_WIDTH = 120;
const PIANO_HEIGHT = 400;
const PIANO_NUM_OCTAVES = 3;

const ROLL_X = 140;
const ROLL_Y = PIANO_Y;
const ROLL_WIDTH = 2000;
const ROLL_HEIGHT = PIANO_HEIGHT;

const BEAT_WIDTH = 20;
const BEAT_LENGTH = "8n";

const MEASURE_SCROLL_AREA = 10;

const HORIZONTAL_SCROLL_X = ROLL_X;
const HORIZONTAL_SCROLL_Y = PIANO_HEIGHT + 85;

const MINIMAP_X = HORIZONTAL_SCROLL_X;
const MINIMAP_Y = HORIZONTAL_SCROLL_Y + 15;

let scroll = 0;

// Input state
let isMousePressed = false;

function setup() {
    WINDOW_WIDTH = windowWidth - 5;
    WINDOW_HEIGHT = windowHeight - 5;

    // Setup canvas
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
    background(255);

    staticItems = createGraphics(ROLL_WIDTH, WINDOW_HEIGHT);
    staticItems.clear();

    // Set the tempo in beats per minute.
    Tone.Transport.bpm.value = 120;
    Tone.Transport.start();

    // Create piano
    piano = new PianoRoll(PIANO_X, PIANO_Y, PIANO_WIDTH, PIANO_HEIGHT, PIANO_NUM_OCTAVES);

    // Create roll
    const nBeats = Math.floor((ROLL_WIDTH - ROLL_X)/BEAT_WIDTH);
    const beatHeight = piano.height/piano.nKeys;

    roll = new Roll(ROLL_X, ROLL_Y, piano.nKeys, nBeats, BEAT_WIDTH, beatHeight);
    roll.drawStatic();

    // Create ruler
    const rulerBodyWidth  = 1.0;
    const rulerBodyHeight = piano.nKeys * beatHeight;
    const rulerHeadWidth  = 10;
    const rulerHeadHeight = 10;

    ruler = new Ruler(ROLL_X, ROLL_Y, rulerBodyWidth, rulerBodyHeight, rulerHeadWidth, rulerHeadHeight);

    // Create measure marks
    const measuresHeight = 30;
    measures = new Measures(ROLL_X, ROLL_Y - measuresHeight, roll.getLength(), measuresHeight);
    measures.draw();

    // Create horizontal scroll bar
    horizontalScroll = new Scroll(HORIZONTAL_SCROLL_X, HORIZONTAL_SCROLL_Y, 100, 10);

    // Create minimap
    minimap = new Minimap(MINIMAP_X, MINIMAP_Y, WINDOW_WIDTH - ROLL_X, 100);
}

function draw() {
    // Clear dynamic objects
    background(255);

    // Set cursor
    cursor("auto");
    if (measures.isMouseOver()) {
        cursor("ew-resize");
    }

    // Draw static objects
    image(staticItems, scroll, 0);

    // Update dynamic objects
    piano.update();
    roll.update();
    ruler.update();

    // Select key if roll is inserting
    if (roll.isInserting) {
        piano.getKeyWithRow(roll.insertStartPosition.x).select();
    }
    else {
        measures.update();
    }

    horizontalScroll.draw();
    minimap.draw();

    push();
    translate(scroll, 0);
    roll.draw();
    ruler.draw();
    pop();

    // Draw hidden area
    drawHiddenArea();
    piano.draw();
}

function drawHiddenArea() {
    fill(255);
    noStroke();
    rect(0, 0, ROLL_X - 5, WINDOW_HEIGHT);
}

function mousePressed() {
    roll.mousePressed();
    horizontalScroll.mousePressed();

    if (!roll.isInserting) {
        piano.mousePressed();
        measures.mousePressed();
    }
}

function mouseReleased() {
    piano.mouseReleased();
    roll.mouseReleased();
    horizontalScroll.mouseReleased();

    if (!roll.isInserting) {
        measures.mouseReleased();
    }
}

function mouseDragged() {
    piano.mouseDragged();
    roll.mouseDragged();
    horizontalScroll.mouseDragged();

    if (!roll.isInserting) {
        measures.mouseDragged();
    }
}

function keyPressed(event) {
    switch (event.key) {
        case " ":
            togglePiano();
            break;
        case "Shift":
            setInserting(true);
            break;
        case "Delete":
            deleteNote();
            break;
    }

    // prevent any default
    return false;
}

function keyReleased(event) {
    switch (event.key) {
        case "Shift":
            setInserting(false);
            break;
    }

    // prevent any default
    return false;
}

function setInserting(isInserting) {
    if (!mouseIsPressed) {
        roll.isInserting = isInserting;
    }
}

function deleteNote() {
    roll.deleteNote();
}

function togglePiano() {
    if (!piano.isPlaying) {
        piano.play();
    }
    else {
        piano.pause();
    }
}
