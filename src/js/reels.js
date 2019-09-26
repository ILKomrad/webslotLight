import ReelSym from './reelSym';
import MoveController from './moveController';

export default class Reels {
    constructor(parrentScene, settings) {
        this.symsNum = 5;
        this.reelsNum = 5;
        this.syms = [];
        this.moveControllers = [];
        this.settings = settings;
        this.scene = new PIXI.Container();
        parrentScene.addChild(this.scene);
    }

    setReels(gameState) {
		// this.addSymsBg(); 
		this.addSyms(gameState);
		// this.addBorder();
    }
    
    addSyms(gameState) {
        for (let x = 0; x < this.reelsNum; x++) {
			const moveController = new MoveController(this.settings, x, this); 
			for (let y = 0; y < this.symsNum; y++) {
				const sym = new ReelSym('sym' + gameState[x][y], this.scene);
                sym.setOrderNum(y);
                sym.setReelNum(x);
				sym.setAnimSpeed(this.settings.animations.animationSpeed);
				this.syms.push(sym);
				moveController.addChild(sym);
			}
			this.moveControllers.push(moveController);
		}
    }

    setMetrics(size) {
        const symW = (size.x * this.settings.reels.width) / this.reelsNum,
            symH = (size.y * this.settings.reels.height) / 3,
            left = size.x * this.settings.reels.offsetX - (size.x * this.settings.reels.width) / 2,
			top = size.y * this.settings.reels.offsetY - (size.y * this.settings.reels.height) / 2;

        this.offsetY = top; 
        this.setSymsPos(symW, symH, left, top);
    }

    setSymsPos(symW, symH, left, top) {
        for (let z = 0; z < this.syms.length; z++) {
            const s = this.syms[z], 
				posX = left + (s.getReelNum() * symW) + symW / 2,
				posY = top - symH / 2 + (s.getOrderNum() * symH);
			s.setSize({x: symW, y: symH});
			s.setPos({x: posX, y: posY})
		}
    }
}