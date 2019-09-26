import { AnimSprite } from './syms';

export default class ReelSym extends AnimSprite {
    constructor(name, container) {
		super(name, container);
		this.type = 'symbol';
		this.setAnimSpeed(.19);
	}

	blured(num, size) {
		this.setNum(num);
		this.change('blured', size, num);
	}

	stopMove(size) {
		this.change('sym' + this.getNum(), size);
	}

	setNum(num) {
		this.num = num;
	}

	getNum() {
		return this.num;
	}

	setScale(scale) {
		this.sprite.width = this.size.x * scale;
		this.sprite.height = this.size.y * scale;
	}

	incOrderNum() {
		this.orderNum++;
	}

	setOrderNum(num) {
		this.orderNum = num;
	}

	getOrderNum(num) {
		return this.orderNum;
    }
    
    setReelNum(n) {
        this.reelNum = n;
    }

    getReelNum() {
        return this.reelNum;
    }
}