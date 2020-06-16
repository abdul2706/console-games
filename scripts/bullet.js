class Bullet {
    constructor(x, y, direction, parent_tank) {
        this.x = x || 0;
        this.y = y || 0;
        this.direction = direction || 'up';
        this.isInside = true;
        this.parent_tank = parent_tank;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    debug_log() {
        clog('Bullet (x = ' + this.x + '; y = ' + this.y + '; dir = ' + this.direction + '; isInside = ' + this.isInside + ')');
    }

    update_coordinates(num) {
        switch (this.direction) {
            case 'up':
                this.y = this.y - num;
                break;
            case 'right':
                this.x = this.x + num;
                break;
            case 'down':
                this.y = this.y + num;
                break;
            case 'left':
                this.x = this.x - num;
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