class Tank {
    constructor(x, y, direction) {
        this.x = x || 0;
        this.y = y || 0;
        this.direction = direction || 'up';
        this.bullet_counter = 0;
        this.bullet_counter_max = Math.round(Math.random() * 50 + 50);
        this.direction_counter = 0;
        this.direction_counter_max = Math.round(Math.random() * 50 + 50);
        this.MASKS = {
            'up': [
                [0, 1, 0],
                [1, 1, 1],
                [1, 0, 1],
            ],
            'right': [
                [1, 1, 0],
                [0, 1, 1],
                [1, 1, 0],
            ],
            'down': [
                [1, 0, 1],
                [1, 1, 1],
                [0, 1, 0],
            ],
            'left': [
                [0, 1, 1],
                [1, 1, 0],
                [0, 1, 1],
            ],
        };
        this.bullets = [];
    }

    getX() {
        return this.x;
    }

    setX(x) {
        this.x = x;
        if (this.x < 1) { this.x = 1; }
        if (this.x > CONFIG.CONSOLE_WIDTH - 2) { this.x = CONFIG.CONSOLE_WIDTH - 2; }
    }

    getY() {
        return this.y;
    }

    setY(y) {
        this.y = y;
        if (this.y < 1) { this.y = 1; }
        if (this.y > CONFIG.CONSOLE_HEIGHT - 2) { this.y = CONFIG.CONSOLE_HEIGHT - 2; }
    }

    getDirection() {
        return this.direction;
    }

    setDirection(direction) {
        this.direction = direction;
    }

    debug_log() {
        clog('Tank (x = ' + this.x + '; y = ' + this.y + '; dir = ' + this.direction + ')');
    }

    console_draw() {
        let MASK = this.MASKS[this.direction];
        for (let j = 0; j < MASK.length; j++) {
            for (let i = 0; i < MASK[j].length; i++) {
                if (MASK[j][i]) {
                    let x2 = Math.round((this.x + i - 1)) * CONFIG.UNIT_PIXEL_WIDTH,
                        y2 = Math.round((this.y + j - 1)) * CONFIG.UNIT_PIXEL_HEIGHT;
                    rect(x2, y2, CONFIG.UNIT_PIXEL_WIDTH, CONFIG.UNIT_PIXEL_HEIGHT);
                }
            }
        }
    }

    create_bullet() {
        let x2, y2;
        switch (this.direction) {
            case 'up':
                x2 = this.x + 1;
                y2 = this.y - 0;
                break;
            case 'right':
                x2 = this.x + 2;
                y2 = this.y + 1;
                break;
            case 'down':
                x2 = this.x + 1;
                y2 = this.y + 2;
                break;
            case 'left':
                x2 = this.x - 0;
                y2 = this.y + 1;
                break;
        }
        // clog('#################\n', x2, y2, '\n#################');
        let new_bullet = new Bullet(x2, y2, this.direction);
        // new_bullet.debug_log();
        this.bullets.push(new_bullet);
    }

    draw_bullets() {
        // clog('[draw_bullets]');
        for (let bullet_index = 0; bullet_index < this.bullets.length; bullet_index++) {
            this.bullets[bullet_index].update_coordinates(2 * CONFIG.GAME_SPEED);
            if (this.bullets[bullet_index].isInside) {
                this.bullets[bullet_index].console_draw();
            } else {
                this.bullets.splice(bullet_index, 1);
            }
        }
    }

    update_coordinates(num) {
        let x_prev = this.x,
            y_prev = this.y;
        let x2 = this.x,
            y2 = this.y;
        switch (this.direction) {
            case 'up':
                y2 = this.y - num;
                break;
            case 'right':
                x2 = this.x + num;
                break;
            case 'down':
                y2 = this.y + num;
                break;
            case 'left':
                x2 = this.x - num;
                break;
        }
        this.setX(x2);
        this.setY(y2);
        let collision = this.check_collision();
        if (collision) {
            this.setX(x_prev);
            this.setY(y_prev);
        }
    }

    update_direction() {
        let temp = Math.floor(Math.random() * 4);
        switch (temp) {
            case 0:
                this.direction = 'up';
                break;
            case 1:
                this.direction = 'right';
                break;
            case 2:
                this.direction = 'down';
                break;
            case 3:
                this.direction = 'left';
                break;
        }
    }

    check_collision() {
        for (let i = 1; i < tanks.length; i++) {
            let tank = tanks[i];
            // clog(i, this.x, tank.getX(), this.x - tank.getX());
            let x1 = Math.round(this.x),
                x2 = Math.round(tank.getX()),
                y1 = Math.round(this.y),
                y2 = Math.round(tank.getY());
            if (Math.abs(x1 - x2) < 3 && Math.abs(y1 - y2) < 3) {
                // clog(i, x1, x2, Math.abs(x1 - x2), y1, y2, Math.abs(y1 - y2));
                return true;
            }
        }
    }

    check_bullets_collision() {
        for (let i = 0; i < tanks.length; i++) {
            let tank_bullets = tanks[i].bullets;
            // clog(i, tank_bullets.length);
            // clog(i, this.x, tank.getX(), this.x - tank.getX());
            for (let j = 0; j < tank_bullets.length; j++) {
                let bullet = tank_bullets[j];
                let x1 = Math.round(this.x) + 1,
                    x2 = Math.round(bullet.getX()),
                    y1 = Math.round(this.y) + 1,
                    y2 = Math.round(bullet.getY());
                if (Math.abs(x1 - x2) < 2 && Math.abs(y1 - y2) < 2) {
                    // clog(i, x1, x2, Math.abs(x1 - x2), y1, y2, Math.abs(y1 - y2));
                    // clog('bullet collided');
                    return true, i, j;
                }
            }
        }
        return false;
    }
}

class Bullet {
    constructor(x, y, direction) {
        this.x = x || 0;
        this.y = y || 0;
        this.direction = direction || 'up';
        this.isInside = true;
    }

    getX() {
        return this.x;
    }

    setX(x) {
        this.x = x;
    }

    getY() {
        return this.y;
    }

    setY(y) {
        this.y = y;
    }

    getDirection() {
        return this.direction;
    }

    setDirection(direction) {
        this.direction = direction;
    }

    debug_log() {
        clog('Bullet (x = ' + this.x + '; y = ' + this.y + '; dir = ' + this.direction + ')');
    }

    update_coordinates(num) {
        switch (this.direction) {
            case 'up':
                this.setY(this.getY() - num);
                break;
            case 'right':
                this.setX(this.getX() + num);
                break;
            case 'down':
                this.setY(this.getY() + num);
                break;
            case 'left':
                this.setX(this.getX() - num);
                break;
        }

        if (this.x < 0 || this.x > CONFIG.CONSOLE_WIDTH + 1 ||
            this.y < 0 || this.y > CONFIG.CONSOLE_HEIGHT + 1) {
            this.isInside = false;
        }
    }

    console_draw() {
        let x2 = Math.round((this.x - 1)) * CONFIG.UNIT_PIXEL_WIDTH,
            y2 = Math.round((this.y - 1)) * CONFIG.UNIT_PIXEL_HEIGHT;
        rect(x2, y2, CONFIG.UNIT_PIXEL_WIDTH, CONFIG.UNIT_PIXEL_HEIGHT);
    }
}

var TAG = '[sketch]';
var DIRECTION = {
    UP: 'up',
    RIGHT: 'right',
    DOWN: 'down',
    LEFT: 'left'
};
var CONFIG = {
    CONSOLE_WIDTH: 10,
    CONSOLE_HEIGHT: 20,
    UNIT_PIXEL_WIDTH: 25,
    UNIT_PIXEL_HEIGHT: 25,
    GAME_SPEED: 0.2,
    BULLET_FIRE_DELAY: 10
};
var clog = console.log;

var tanks = [
    new Tank(5, 10, DIRECTION.UP),
    new Tank(1, 1, DIRECTION.UP),
    new Tank(8, 1, DIRECTION.UP),
    new Tank(1, 18, DIRECTION.UP),
    new Tank(8, 18, DIRECTION.UP),
];

function setup() {
    let TAG2 = TAG + '[setup]';
    clog(TAG2 + '[starts]');
    createCanvas(CONFIG.UNIT_PIXEL_WIDTH * CONFIG.CONSOLE_WIDTH, CONFIG.UNIT_PIXEL_HEIGHT * CONFIG.CONSOLE_HEIGHT);
    clog(TAG2 + '[ends]');
}

function draw() {
    let TAG2 = TAG + '[draw]';
    // clog(TAG2 + '[starts]');
    draw_console_grid();
    update_tanks();
    update_user_tank();
    check_bullets_collision();
    draw_tanks();
    // clog(TAG2 + '[ends]');
}

function keyPressed() {
    if (keyCode == 32) {
        tanks[0].create_bullet();
    }
}

function check_bullets_collision() {
    // clog('check_bullets_collision');
    for (let tank_index = 0; tank_index < tanks.length; tank_index++) {
        let collision = tanks[tank_index].check_bullets_collision();
        // clog('collision -> ', collision);
        // if (collision) {
        //     clog(tank_index);
        // }
    }
}

function update_tanks() {
    for (let tank_index = 1; tank_index < tanks.length; tank_index++) {
        tanks[tank_index].update_coordinates(CONFIG.GAME_SPEED);

        if (tanks[tank_index].direction_counter % tanks[tank_index].direction_counter_max == 0) {
            tanks[tank_index].update_direction();
            tanks[tank_index].direction_counter_max = Math.round(Math.random() * 50 + 50);
        }
        tanks[tank_index].direction_counter++;

        // if (tanks[tank_index].bullet_counter % tanks[tank_index].bullet_counter_max == 0) {
        //     tanks[tank_index].create_bullet();
        //     tanks[tank_index].bullet_counter_max = Math.round(Math.random() * 50 + 50);
        // }
        // tanks[tank_index].bullet_counter++;
    }
}

function update_user_tank() {
    let TAG2 = TAG + '[update_user_tank]';
    let current_direction = tanks[0].getDirection();
    let x_prev = tanks[0].getX(),
        y_prev = tanks[0].getY();

    if (keyIsDown(UP_ARROW)) {
        // clog(TAG2 + '[UP_ARROW]');
        if (current_direction == DIRECTION.UP) {
            tanks[0].setY(tanks[0].getY() - CONFIG.GAME_SPEED);
        } else {
            tanks[0].setDirection(DIRECTION.UP);
        }
    } else if (keyIsDown(RIGHT_ARROW)) {
        // clog(TAG2 + '[RIGHT_ARROW]');
        if (current_direction == DIRECTION.RIGHT) {
            tanks[0].setX(tanks[0].getX() + CONFIG.GAME_SPEED);
        } else {
            tanks[0].setDirection(DIRECTION.RIGHT);
        }
    } else if (keyIsDown(DOWN_ARROW)) {
        // clog(TAG2 + '[DOWN_ARROW]');
        if (current_direction == DIRECTION.DOWN) {
            tanks[0].setY(tanks[0].getY() + CONFIG.GAME_SPEED);
        } else {
            tanks[0].setDirection(DIRECTION.DOWN);
        }
    } else if (keyIsDown(LEFT_ARROW)) {
        // clog(TAG2 + '[LEFT_ARROW]');
        if (current_direction == DIRECTION.LEFT) {
            tanks[0].setX(tanks[0].getX() - CONFIG.GAME_SPEED);
        } else {
            tanks[0].setDirection(DIRECTION.LEFT);
        }
    }
    let collision = tanks[0].check_collision();
    if (collision) {
        tanks[0].setX(x_prev);
        tanks[0].setY(y_prev);
    }
}

function draw_tanks() {
    let TAG2 = TAG + '[draw_tanks]';
    // clog(TAG2 + '[starts]');
    stroke(0, 255, 0);
    fill(0, 255, 0);
    tanks[0].console_draw();
    tanks[0].draw_bullets();
    for (let tank_index = 1; tank_index < tanks.length; tank_index++) {
        stroke(0, 0, 255);
        fill(0, 0, 255);
        tanks[tank_index].console_draw();
        // tanks[tank_index].draw_bullets();
    }
    // clog(TAG2 + '[ends]');
}

function draw_console_grid() {
    let TAG2 = TAG + '[draw_console_grid]';
    // clog(TAG2 + '[starts]');
    background(200);
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