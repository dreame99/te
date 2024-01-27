
const STAGE_WIDTH = 13, STAGE_HEIGHT = 13;
const BLOCK_SIZE = 14;
let curBlocks = [];
let stackedBlocks = [];

window.onload = () => {
    let context = canvas.getContext("2d");
    canvas.width = BLOCK_SIZE * STAGE_WIDTH;
    canvas.height = BLOCK_SIZE * STAGE_HEIGHT;

    for( let x = 0; x < STAGE_WIDTH; x++ ) {
        stackedBlocks.push({x: x, y: STAGE_HEIGHT - 1, color: "black"});
    }
    for( let y = 0; y < STAGE_HEIGHT; y++ ) {
        stackedBlocks.push({x: 0, y: y, color: "black"});
        stackedBlocks.push({x: STAGE_WIDTH - 1, y: y, color: "black"});
    }

    update(context);

    document.onkeydown = e => {
        let nextBlocks;

        if( e.keyCode == 37 ) {
            nextBlocks = getMovedBlocks(curBlocks, -1, 0);
        } else if( e.keyCode == 39 ) {
            nextBlocks = getMovedBlocks(curBlocks, 1, 0);
        } else if( e.keyCode == 40 ) {
            nextBlocks = getMovedBlocks(curBlocks, 0, 1);
        } else if( e.keyCode == 38 ) {
            nextBlocks = getRotatedBlocks(curBlocks);
        }

        if( isCollapse(nextBlocks, stackedBlocks) ) {
            if( e.keyCode == 40 ) {
                stackedBlocks.push(...curBlocks);
                curBlocks = [];
            }
        } else {
            curBlocks = nextBlocks;
        }

        update(context);
    }

    setInterval(() => {
        let nextBlocks = getMovedBlocks(curBlocks, 0, 1);

        if( isCollapse(nextBlocks, stackedBlocks) ) {
            stackedBlocks.push(...curBlocks);
            curBlocks = [];
        } else {
            curBlocks = nextBlocks;
        }

        update(context);
    }, 700);
}

function update(context) {
    if( curBlocks.length == 0 ) {
        curBlocks = createRandomBlocks();
    }

    drawStage(context);
    curBlocks.forEach(o => drawBlock(context, o.x, o.y, o.color));
    stackedBlocks.forEach(o => drawBlock(context, o.x, o.y, o.color));
    deleteFilledLine();
}

function deleteFilledLine() {
    for( let i = 0; i < STAGE_HEIGHT - 1; i++ ) {
        let lineBlocks = stackedBlocks.filter(o => o.x > 0 && o.x < STAGE_WIDTH - 1 && o.y == i);
        if( lineBlocks.length == STAGE_WIDTH - 2 ) {
            lineBlocks.map(lineBlock => stackedBlocks.splice(stackedBlocks.indexOf(lineBlock), 1));
            stackedBlocks.filter(o => o.x > 0 && o.x < STAGE_WIDTH - 1 && o.y < i).forEach(o => o.y++);
        }
    }
}

function getRotatedBlocks(blocks) {
    let cx = blocks[0].x;
    let cy = blocks[0].y;

    return blocks.map(o => { return {x: cx + cy - o.y, y: cy - cx + o.x, color: o.color} });
}

function getMovedBlocks(blocks, mx, my) {
    return blocks.map(o => Object.assign({}, o, {x: o.x + mx, y: o.y + my}));
}

function createRandomBlocks() {
    let kind = Math.random() * 7 | 0;
    let pos;

    if( kind == 0 ) {
        pos = [[0, -1, 0, -1], [-1, -1, -2, -2]];
    } else if( kind == 1 ) {
        pos = [[0, 1, -1, -1], [-1, -1, -1, -2]];
    } else if( kind == 2 ) {
        pos = [[0, 1, -1, 0], [-1, -1, -1, -2]];
    } else if( kind == 3 ) {
        pos = [[0, 1, -1, 1], [-1, -1, -1, -2]];
    } else if( kind == 4 ) {
        pos = [[0, 1, 0, -1], [-1, -1, -2, -2]];
    } else if( kind == 5 ) {
        pos = [[0, -1, 0, 1], [-1, -1, -2, -2]];
    } else {
        pos = [[0, 0, 0, 0], [-2, -1, -3, -4]];
    }

    return Array.from({length: 4}, (o, i) => { return {x: (STAGE_WIDTH / 2 | 0) + pos[0][i], y: pos[1][i], color: "#646E44"}});
}

function isCollapse(targetBlocks, sourceBlocks) {
    return targetBlocks.filter(o => sourceBlocks.filter(s => s.x == o.x && s.y == o.y).length).length;
}

function drawStage(context) {
    for( let x = 0; x < STAGE_WIDTH; x++ ) {
        for( let y = 0; y < STAGE_HEIGHT; y++ ) {
            drawBlock(context, x, y, "#B7C196");
        }
    }
}

function drawBlock(context, x, y, color) {
    let borderSize = Math.max(BLOCK_SIZE / 10, 1);
    context.fillStyle = color;
    context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    context.fillStyle = "#C4CFA1";
    context.fillRect(x * BLOCK_SIZE + borderSize, y * BLOCK_SIZE + borderSize, BLOCK_SIZE - borderSize * 2, BLOCK_SIZE - borderSize * 2);
    context.fillStyle = color;
    context.fillRect(x * BLOCK_SIZE + borderSize * 2, y * BLOCK_SIZE + borderSize * 2, BLOCK_SIZE - borderSize * 4, BLOCK_SIZE - borderSize * 4);
}