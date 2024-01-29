
const BLOCK_SIZE = 14;
const STAGE_WIDTH = 13, STAGE_HEIGHT = 13;
let stage = Array.from({length: STAGE_HEIGHT}, () => Array(STAGE_WIDTH).fill(0));
let curBlocks = [];

window.onload = () => {
    let context = canvas.getContext("2d");
    canvas.width = canvas.height = 13 * BLOCK_SIZE;

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

        if( nextBlocks ) {
            if( isCollapse(nextBlocks) ) {
                if( e.keyCode == 40 ) {
                    if( curBlocks.filter(p => p[1] < 0).length ) {
                        location.reload();
                    }
                    curBlocks.map((p, i) => i > 0? stage[p[1]][p[0]] = 1 : "");
                    curBlocks = [];
                }
            } else {
                curBlocks = nextBlocks;
            }
        }
    }

    setInterval(() => draw(context), 16);
    setInterval(() => {
        if( !curBlocks.length ) {
            curBlocks = createRandomBlocks();
        }

        let nextBlocks = getMovedBlocks(curBlocks, 0, 1);

        if( isCollapse(nextBlocks) ) {
            if( curBlocks.filter(p => p[1] < 0).length ) {
                location.reload();
            }
            curBlocks.map((p, i) => i > 0? stage[p[1]][p[0]] = 1 : "");
            curBlocks = [];
        } else {
            curBlocks = nextBlocks;
        }

        stage.forEach((s, i) => {
            if( s.reduce((a, b) => a + b) == STAGE_WIDTH ) {
                for( let j = i; j > 0; j-- ) {
                    stage[j] = stage[j - 1];
                }
                stage[0] = Array(STAGE_WIDTH).fill(0);
            }
        });
    }, 700);
}

function isCollapse(blocks) {
    return blocks.filter((p, i) => i > 0 && p[1] >= 0 && (p[0] < 0 || p[0] >= STAGE_WIDTH || p[1] >= STAGE_HEIGHT || stage[p[1]][p[0]])).length;
}

function getMovedBlocks(blocks, mx, my) {
    return blocks.map(p => [p[0] + mx, p[1] + my]);
}

function getRotatedBlocks(blocks) {
    return blocks.map(p => [blocks[0][0] + blocks[0][1] - p[1], blocks[0][1] - blocks[0][0] + p[0]]);
}

function createRandomBlocks() {
    let kind = Math.random() * 7 | 0;
    let m = STAGE_WIDTH / 2 | 0;

    if( kind == 0 ) {
        return [[m - 0.5, -1.5], [m, -1], [m - 1, -1], [m, -2], [m - 1, -2]];
    } else if( kind == 1 ) {
        return [[m, -1], [m, -1], [m - 1, -1], [m + 1, -1], [m - 1, -2]];
    } else if( kind == 2 ) {
        return [[m, -1], [m, -1], [m - 1, -1], [m + 1, -1], [m, -2]];
    } else if( kind == 3 ) {
        return [[m, -1], [m, -1], [m - 1, -1], [m + 1, -1], [m + 1, -2]];
    } else if( kind == 4 ) {
        return [[m, -1], [m, -1], [m - 1, -1], [m, -2], [m + 1, -2]];
    } else if( kind == 5 ) {
        return [[m, -1], [m, -1], [m + 1, -1], [m, -2], [m - 1, -2]];
    } else {
        return [[m, -2], [m, -2], [m, -1], [m, -3], [m, -4]];
    }
}

function draw(context) {
    stage.map((o, y) => stage[y].map((n, x) => drawBlock(context, x, y, n? "black" : "#BBB")));
    curBlocks.map(p => drawBlock(context, p[0], p[1], "black"));
}

function drawBlock(context, x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}