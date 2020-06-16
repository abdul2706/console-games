function check_tank_collision(obj) {
    let mask1 = Tank.MASKS[this.direction],
        mask2 = Tank.MASKS[obj.direction];
    let x1 = Math.round(this.x),
        x2 = Math.round(obj.x),
        y1 = Math.round(this.y),
        y2 = Math.round(obj.y);
    // clog(x1, x2, Math.abs(x1 - x2), y1, y2, Math.abs(y1 - y2));
    if (Math.abs(x1 - x2) < 3 && Math.abs(y1 - y2) < 3) {
        let collision_mask = [];
        let mask_cols = Math.abs(x1 - x2) + 3,
            mask_rows = Math.abs(y1 - y2) + 3;
        // clog(mask_rows, mask_cols);
        for (let j = 0; j < mask_rows; j++) {
            collision_mask.push([]);
            for (let i = 0; i < mask_cols; i++) {
                collision_mask[j].push(0);
            }
        }

        let min_x = (x1 < x2) ? x1 : x2,
            max_x = (x1 > x2) ? x1 : x2,
            min_y = (y1 < y2) ? y1 : y2,
            max_y = (y1 > y2) ? y1 : y2;
        clog(x1, min_x, x1 - min_x, y1, min_y, y1 - min_y);
        clog(x2, min_x, x2 - min_x, y2, min_y, y2 - min_y);

        let index_x = x1 - min_x,
            index_y = y1 - min_y;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                collision_mask[index_y + i][index_x + j] += mask1[i][j];
            }
        }
        index_x = x2 - min_x;
        index_y = y2 - min_y;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                collision_mask[index_y + i][index_x + j] += mask2[i][j];
            }
        }

        Tank.printMask(collision_mask);

        for (let i = 0; i < collision_mask.length; i++) {
            for (let j = 0; j < collision_mask[i].length; j++) {
                if (collision_mask[i][j] > 1) {
                    clog('collided');
                    return true;
                }
            }
        }
    }
}

function printMask(mask) {
    let log_string = '';
    for (let i = 0; i < mask.length; i++) {
        for (let j = 0; j < mask[i].length; j++) {
            log_string += mask[i][j] + ' ';
        }
        log_string += '\n';
    }
    clog(log_string);
}