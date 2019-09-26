import Reels from './reels';
import Iface from './iface';

export default class Presenter {
    constructor(settings) {
		this.container = document.querySelector('#container');;
		this.childs = [];
		this.scene = new PIXI.Container();
		this.reels = new Reels(this.scene, settings);
		this.iface = new Iface();
		this.childs.push(this.reels);
		// this.childs.push(this.iface);
        this.createRenderer();
    }

	createRenderer(gameState) {
		this.app = new PIXI.Application({
		    resolution: 2,
		    antialias: false,
		    forceFXAA: false,
		    forceCanvas: false,
		    autoResize: true,
		    // transparent: true,
		    clearBeforeRender: true,
		    preserveDrawingBuffer: false,
		    roundPixels: false,
		});
		this.app.stage.addChild(this.scene);
		this.container.appendChild(this.app.view);
	}

	setSize(width, height) {
		this.width = width;
		this.height = height;
		this.app.renderer.resize(width, height);
		
		for (let z = 0; z < this.childs.length; z++) {
        	this.childs[z].setMetrics({x: width, y: height});
        }
	}
	
	init(gameState, ifaceData) {
		this.reels.setReels(gameState)
		this.iface.init(ifaceData);
	}

	render() {
		this.app.ticker.add(() => {
			// TWEEN.update();
			// this.reels.spin();
    	});
	}

	updateIndicators() {}

	spin() {}
}