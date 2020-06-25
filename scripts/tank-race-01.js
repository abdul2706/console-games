var TAG = '[tank-fight]';
var DIRECTION = {
    UP: 'up',
    RIGHT: 'right',
    DOWN: 'down',
    LEFT: 'left'
};
var GAME_STATUSES = {
    START: 'start',
    PLAY: 'play',
    PAUSE: 'pause',
    END: 'end'
};
var CONFIG = {
    CONSOLE_WIDTH: 10,
    CONSOLE_HEIGHT: 20,
    UNIT_PIXEL_WIDTH: 25,
    UNIT_PIXEL_HEIGHT: 25,
    GAME_SPEED: 0.1,
    GAME_STATUS: GAME_STATUSES.START,
    USER_SCORE: 0,
    GENERATE_TANK_DELAY: 50
};
var clog = console.log;

var user_tank = new Tank(CONFIG.CONSOLE_WIDTH / 2, CONFIG.CONSOLE_HEIGHT / 2, DIRECTION.UP);
// var bullets = [];
var generate_tank_counter = 0;

function setup() {
    let TAG2 = TAG + '[setup]';
    clog(TAG2 + '[starts]');
    let canvas = createCanvas(CONFIG.UNIT_PIXEL_WIDTH * CONFIG.CONSOLE_WIDTH, CONFIG.UNIT_PIXEL_HEIGHT * CONFIG.CONSOLE_HEIGHT + 50);
    textFont('PixelColeco');
    canvas.parent('main');
    clog(TAG2 + '[ends]');
}

function draw() {
    let TAG2 = TAG + '[draw]';
    // clog(TAG2 + '[starts]');
    draw_console_grid();
    display_bottom_bar();
    if (CONFIG.GAME_STATUS == GAME_STATUSES.START) {
        display_game_start();
    } else if (CONFIG.GAME_STATUS == GAME_STATUSES.PLAY) {
        update_tanks();
        // update_bullets();
        update_user_tank();

        // fire_bullets();
        // check_bullets_collision();
        generate_tank();

        draw_tanks();
        // draw_bullets();
    } else if (CONFIG.GAME_STATUS == GAME_STATUSES.PAUSE) {
        display_game_pause();
    } else if (CONFIG.GAME_STATUS == GAME_STATUSES.END) {
        display_game_end();
    }
    // clog(TAG2 + '[ends]');
}

function display_game_start() {
    // background(255);
    textSize(50);
    fill(0);
    stroke(0);
    textAlign(CENTER);
    text('START\nGAME', width / 2, height / 2 - 50);
}

function display_game_pause() {
    // background(255);
    textSize(50);
    fill(0);
    stroke(0);
    textAlign(CENTER);
    text('RESUME', width / 2, height / 2);
}

function display_game_end() {
    // background(255);
    textSize(100);
    fill(0);
    stroke(0);
    textAlign(CENTER);
    text(`${CONFIG.USER_SCORE}`, width / 2, height / 2);
}

function display_bottom_bar() {
    fill(0);
    rect(-1, CONFIG.CONSOLE_HEIGHT * CONFIG.UNIT_PIXEL_HEIGHT, CONFIG.CONSOLE_WIDTH * CONFIG.UNIT_PIXEL_WIDTH + 1, 50);
    if (CONFIG.GAME_STATUS == GAME_STATUSES.PLAY) {
        textSize(25);
        fill(255);
        stroke(0);
        textAlign(CENTER);
        text('X', CONFIG.UNIT_PIXEL_WIDTH, CONFIG.CONSOLE_HEIGHT * CONFIG.UNIT_PIXEL_HEIGHT + 30);
        text(`SCORE: ${CONFIG.USER_SCORE}`, width / 2, CONFIG.CONSOLE_HEIGHT * CONFIG.UNIT_PIXEL_HEIGHT + 30);
    } else if (CONFIG.GAME_STATUS == GAME_STATUSES.PAUSE) {
        textSize(25);
        fill(255);
        stroke(0);
        textAlign(CENTER);
        text(`SCORE: ${CONFIG.USER_SCORE}`, width / 2, CONFIG.CONSOLE_HEIGHT * CONFIG.UNIT_PIXEL_HEIGHT + 30);
    }
}

function mouseClicked() {
    clog(mouseX, mouseY);
    if (CONFIG.GAME_STATUS == GAME_STATUSES.START) {
        clog('game status is start');
        if (mouseX > 2 * CONFIG.UNIT_PIXEL_WIDTH &&
            mouseX < 8 * CONFIG.UNIT_PIXEL_WIDTH &&
            mouseY > 7 * CONFIG.UNIT_PIXEL_HEIGHT &&
            mouseY < 12 * CONFIG.UNIT_PIXEL_HEIGHT) {
            clog('game status changing to play');
            CONFIG.GAME_STATUS = GAME_STATUSES.PLAY;
        }
    } else if (CONFIG.GAME_STATUS == GAME_STATUSES.PLAY) {
        clog('game status is play');
        if (mouseX > 0 &&
            mouseX < 2 * CONFIG.UNIT_PIXEL_WIDTH &&
            mouseY > CONFIG.CONSOLE_HEIGHT * CONFIG.UNIT_PIXEL_HEIGHT) {
            clog('game status changing to pause');
            CONFIG.GAME_STATUS = GAME_STATUSES.PAUSE;
        }
    } else if (CONFIG.GAME_STATUS == GAME_STATUSES.PAUSE) {
        clog('game status is pause');
        if (mouseX > 6 * CONFIG.UNIT_PIXEL_WIDTH &&
            mouseX < 15 * CONFIG.UNIT_PIXEL_WIDTH &&
            mouseY > 8 * CONFIG.UNIT_PIXEL_HEIGHT &&
            mouseY < 11 * CONFIG.UNIT_PIXEL_HEIGHT) {
            clog('game status changing to play');
            CONFIG.GAME_STATUS = GAME_STATUSES.PLAY;
        }
    }
}

function keyPressed() {
    clog('[keyPressed]', keyCode);
    if (keyCode == 32) {
        bullets.push(user_tank.create_bullet());
    } else if (keyCode == 27) {
        if (CONFIG.GAME_STATUS == GAME_STATUSES.PLAY) {
            CONFIG.GAME_STATUS = GAME_STATUSES.PAUSE;
        } else if (CONFIG.GAME_STATUS == GAME_STATUSES.PAUSE) {
            CONFIG.GAME_STATUS = GAME_STATUSES.PLAY;
        }
    }
}

function update_tanks() {
    for (let i = 1; i < tanks.length; i++) {
        prev_coordinates = tanks[i].update_coordinates(CONFIG.GAME_SPEED);

        let collision = false;
        for (let j = 0; j < tanks.length; j++) {
            if (i != j && tanks[i].check_tank_collision(tanks[j])) {
                collision = true;
                break;
            }
        }
        if (collision) {
            tanks[i].setX(prev_coordinates[0]);
            tanks[i].setY(prev_coordinates[1]);
        }

        // clog(tanks[i].direction_counter, tanks[i].direction_counter_delay);
        if (tanks[i].direction_counter % tanks[i].direction_counter_delay == 0) {
            tanks[i].update_direction();
            tanks[i].direction_counter_delay = Math.round(Math.random() * 50 + 50);
        }
        tanks[i].direction_counter++;
    }
}

function update_bullets() {
    for (let bullet_index = 0; bullet_index < bullets.length; bullet_index++) {
        bullets[bullet_index].update_coordinates(CONFIG.GAME_SPEED * 2);
        if (!bullets[bullet_index].isInside) {
            bullets.splice(bullet_index, 1);
        }
    }
}

function update_user_tank() {
    let TAG2 = TAG + '[update_user_tank]';
    let current_direction = user_tank.direction;
    let x_prev = user_tank.x,
        y_prev = user_tank.y,
        d_prev = user_tank.direction;

    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        // clog(TAG2 + '[UP_ARROW]');
        if (current_direction == DIRECTION.UP) {
            user_tank.setY(user_tank.y - CONFIG.GAME_SPEED);
        } else {
            user_tank.direction = DIRECTION.UP;
        }
    } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        // clog(TAG2 + '[RIGHT_ARROW]');
        if (current_direction == DIRECTION.RIGHT) {
            user_tank.setX(user_tank.x + CONFIG.GAME_SPEED);
        } else {
            user_tank.direction = DIRECTION.RIGHT;
        }
    } else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        // clog(TAG2 + '[DOWN_ARROW]');
        if (current_direction == DIRECTION.DOWN) {
            user_tank.setY(user_tank.y + CONFIG.GAME_SPEED);
        } else {
            user_tank.direction = DIRECTION.DOWN;
        }
    } else if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        // clog(TAG2 + '[LEFT_ARROW]');
        if (current_direction == DIRECTION.LEFT) {
            user_tank.setX(user_tank.x - CONFIG.GAME_SPEED);
        } else {
            user_tank.direction = DIRECTION.LEFT;
        }
    }

    let collision = false;
    for (let i = 1; i < tanks.length; i++) {
        if (user_tank.check_tank_collision(tanks[i])) {
            collision = true;
            break;
        }
    }
    if (collision) {
        user_tank.setX(x_prev);
        user_tank.setY(y_prev);
        user_tank.direction = d_prev;
    }
}

function fire_bullets() {
    for (let i = 1; i < tanks.length; i++) {
        if (tanks[i].bullet_counter % tanks[i].bullet_counter_delay == 0) {
            bullets.push(tanks[i].create_bullet());
            tanks[i].bullet_counter_delay = Math.round(Math.random() * 50 + 50);
        }
        tanks[i].bullet_counter++;
    }
}

function generate_tank() {
    let tank_coordinates = [
        [1, 1],
        [8, 1],
        [1, 18],
        [8, 18]
    ];
    if (tanks.length < 5 && generate_tank_counter % CONFIG.GENERATE_TANK_DELAY == 0) {
        let index = Math.floor(Math.random() * tank_coordinates.length);
        let new_tank = new Tank(tank_coordinates[index][0], tank_coordinates[index][1]);
        let collision = false;
        for (let i = 0; i < tanks.length; i++) {
            if (new_tank.check_tank_collision(tanks[i])) {
                collision = true;
                break;
            }
        }
        if (!collision) {
            tanks.push(new_tank);
        }
    }
    generate_tank_counter++;
}

function draw_console_grid() {
    let TAG2 = TAG + '[draw_console_grid]';
    // clog(TAG2 + '[starts]');
    background(255);
    stroke(200);
    fill(255);
    for (let j = 0; j < CONFIG.CONSOLE_HEIGHT; j++) {
        for (let i = 0; i < CONFIG.CONSOLE_WIDTH; i++) {
            let x = i * CONFIG.UNIT_PIXEL_WIDTH,
                y = j * CONFIG.UNIT_PIXEL_HEIGHT;
            rect(x, y, CONFIG.UNIT_PIXEL_WIDTH, CONFIG.UNIT_PIXEL_HEIGHT);
        }
    }
    // clog(TAG2 + '[ends]');
}

function draw_tanks() {
    let TAG2 = TAG + '[draw_tanks]';
    // clog(TAG2 + '[starts]');
    stroke(0, 255, 0);
    fill(0, 255, 0);
    user_tank.console_draw();
    for (let tank_index = 1; tank_index < tanks.length; tank_index++) {
        stroke(0, 0, 255);
        fill(0, 0, 255);
        tanks[tank_index].console_draw();
    }
    // clog(TAG2 + '[ends]');
}

function draw_bullets() {
    let TAG2 = TAG + '[draw_bullets]';
    // clog(TAG2 + '[starts]');
    stroke(255, 0, 0);
    fill(255, 0, 0);
    for (let bullet_index = 0; bullet_index < bullets.length; bullet_index++) {
        bullets[bullet_index].console_draw();
    }
    // clog(TAG2 + '[ends]');
}

function check_bullets_collision() {
    for (let i = 0; i < bullets.length; i++) {
        let x1 = Math.round(bullets[i].x),
            y1 = Math.round(bullets[i].y);
        for (let j = i + 1; j < bullets.length; j++) {
            let x2 = Math.round(bullets[j].x),
                y2 = Math.round(bullets[j].y);
            if (x1 == x2 && y1 == y2) {
                bullets.splice(i, 1);
                bullets.splice(j, 1);
            }
        }
    }
    for (let i = 0; i < bullets.length; i++) {
        let x1 = Math.round(bullets[i].x),
            y1 = Math.round(bullets[i].y);
        for (let j = 0; j < tanks.length; j++) {
            let x2 = Math.round(tanks[j].x) + 1,
                y2 = Math.round(tanks[j].y) + 1;
            if (Math.abs(x1 - x2) < 2 && Math.abs(y1 - y2) < 2) {
                // clog(i, 'bullet collided with tank', j);
                if (j == 0) {
                    CONFIG.GAME_RUNNING = false;
                    return;
                } else {
                    if (bullets[i].parent_tank == user_tank) {
                        CONFIG.USER_SCORE++;
                        bullets.splice(i, 1);
                        tanks.splice(j, 1);
                    }
                }
                // clog(i, j, x1, x2, Math.abs(x1 - x2), y1, y2, Math.abs(y1 - y2));
            }
        }
    }
}