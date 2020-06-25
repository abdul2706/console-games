class Block {
    constructor(x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 1;
        this.h = h || 1;
    }

    setX(x) {
        this.x = x;
        if (this.x < 1) { this.x = 1; }
        if (this.x > CONFIG.CONSOLE_WIDTH - 2) { this.x = CONFIG.CONSOLE_WIDTH - 2; }
    }

    setY(y) {
        this.y = y;
        if (this.y < 1) { this.y = 1; }
        if (this.y > CONFIG.CONSOLE_HEIGHT - 2) { this.y = CONFIG.CONSOLE_HEIGHT - 2; }
    }

    debug_log() {
        clog('Tank (x = ' + this.x + '; y = ' + this.y + '; dir = ' + this.direction + ')');
    }

    console_draw() {
        let MASK = Tank.MASKS[this.direction];
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
                y2 = this.y - 1;
                break;
            case 'right':
                x2 = this.x + 3;
                y2 = this.y + 1;
                break;
            case 'down':
                x2 = this.x + 1;
                y2 = this.y + 3;
                break;
            case 'left':
                x2 = this.x - 1;
                y2 = this.y + 1;
                break;
        }
        let new_bullet = new Bullet(x2, y2, this.direction, this);
        return new_bullet;
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
        // let collision = this.check_collision();
        // if (collision) {
        //     this.setX(x_prev);
        //     this.setY(y_prev);
        // }
        return [x_prev, y_prev];
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

    check_tank_collision(obj) {
        let x1 = Math.round(this.x),
            x2 = Math.round(obj.x),
            y1 = Math.round(this.y),
            y2 = Math.round(obj.y);
        // clog(x1, x2, Math.abs(x1 - x2), y1, y2, Math.abs(y1 - y2));
        if (Math.abs(x1 - x2) < 3 && Math.abs(y1 - y2) < 3) {
            return true;
        }
    }
}