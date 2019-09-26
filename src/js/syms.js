export class Sprite {
    constructor(name, container) {
		this.container = container;
	   	this.create(name, container);
	   	this.type = 'sprite';
    }
    
    create(name, container) {
		let sheet = PIXI.Loader.shared.resources[name];
	    this.sprite = new PIXI.Sprite(sheet.texture);
	    this.sprite.name = name;
	  	this.setAnchor(0.5);
	    container.addChild(this.sprite);
	}

	getType() {
		return this.type;
	}
    
    setSize(size) {
		this.sprite.width = size.x;
      	this.sprite.height = size.y;
		this.size = size;
    }
    
    getSize() {
        return this.size;
    }

	setPos(pos) {
		this.sprite.x = pos.x
        this.sprite.y = pos.y;
        this.pos = pos;
    }
    
    getPos() {
        return this.size;
    }

	setAnchor(n) {
		this.sprite.anchor.set(n);
    }
    
    destroy() {
		this.sprite.destroy();
		this.container.removeChild(this.sprite);
	}
}

export class StaticSprite extends Sprite {
    setSizeCoef(coef) {
		this.coef = coef;
	}

	setPosCoef(coef) {
		this.posCoef = coef;
    }
    
    setSize(size) {
		if (this.coef) {
			this.sprite.width = size.x * this.coef.x;
      		this.sprite.height = size.y * this.coef.y;
		} else {
			this.sprite.width = size.x;
      		this.sprite.height = size.y;
		}
		this.size = size;
    }
    
    setPos(pos) {
        if (this.posCoef !== undefined) {
            this.sprite.x = pos.x * this.posCoef.x;
            this.sprite.y = pos.y * this.posCoef.y;
        } else {
            this.sprite.x = pos.x
            this.sprite.y = pos.y;
        }
        this.pos = pos;
	}
}

export class AnimSprite extends Sprite {
	constructor(name, container) {
		super(name, container);
	}

	create(name, container) {
		let sheet = PIXI.Loader.shared.resources[name].spritesheet;
	    this.setFrames(sheet);
	    this.sprite = new PIXI.AnimatedSprite(this.frames);
	    this.sprite.name = name;
	    this.sprite.anchor.set(0.5);
	    container.addChild(this.sprite);
	}

	setFrames(frames) {
		this.frames = [];
	    for (let z in frames.textures) {
	        let sprite = frames.textures[z];
	        this.frames.push(sprite);
	    }
	}

	setFrame(num) {
		this.sprite.gotoAndStop(num);
	}

	stop() {
		this.setFrame(0);
	}

	play() {
	    this.sprite.play();
	}

	setAnimSpeed(speed) {
	    this.sprite.animationSpeed = speed;
	}
}