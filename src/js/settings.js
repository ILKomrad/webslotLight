import { Common } from './common.js';

export default class Settings {
	constructor() {
		// this.url = 'ws://server.zeroelectronics.ru:11113/';
		this.lt = false;
		// this.url = 'ws://localhost:11111';
		this.url = 'ws://revoltex.com.ua:11111';
		this.userId = "977EF0194D6FFFBC";
		this.symsToStop = 5;
		this.stopShift = 8;
		this.bumpSteps = 10;
		this.animates = true;
		this.textures = {};
		this.images = [];
		this.textures['syms'] = [];
		this.textures['images'] = [];
		this.commonImagesSrc = 'assets/images/';
		this.commonSoundsSrc = 'assets/sounds/';
		this.spinSpeed = 0.29;
		this.sounds = [
			{name: 'spin', src: this.commonSoundsSrc + 'reel.mp3'},
			{name: 'stop', src: this.commonSoundsSrc + 'reel_stop1.mp3'},
		];
		this.animations = {
	        lineColor: "0xffffff",
	        animationSpeed: 0.19,
	        lineAnination: 2000
		};
		this.textures['images'].push({src: this.commonImagesSrc + 'doubler/cards/bb.png', name: 'bb'});
		this.textures['images'].push({src: this.commonImagesSrc + 'doubler/cards/rb.png', name: 'rb'});
		this.textures['images'].push({src: this.commonImagesSrc + 'doubler/cards/card.png', name: 'card'});
		this.textures['images'].push({src: this.commonImagesSrc + 'doubler/cards/lost.png', name: 'lost'});
		this.textures['images'].push({src: this.commonImagesSrc + 'doubler/cards/hist_cards.png', name: 'hist_cards'});
	    this.textures['images'].push({src: this.commonImagesSrc + 'interface/free_spins_label.png', name: 'free_spins_label'});
		this.createLines();
	}

	getImages() {
		for (let z = 0; z < this.symsCount; z++) {
			this.textures['syms'].push({src: this.symsPath + '/' + z + '.json', name: 'sym' + z});
		}
	}

	async waitLoad() {
		return new Promise(res => {
   			this.textures.syms.forEach(t => {
   				PIXI.Loader.shared.add(t.name, t.src);
   			});
   			this.textures.images.forEach((t) => {
   				PIXI.Loader.shared.add(t.name, t.src); 
   			});
   			PIXI.Loader.shared.load(res);
		});
	}

	async init() {
		const data = await this.getSettings(this.gameName = Common.getQueryVariable('id'));

		for (let i in data) {
			this[i] = data[i];
		}
		this.imagePath =  "assets/images/";
		this.symsPath = this.imagePath + this.gameAlias + '/symbols';
		this.interfacePath = this.imagePath + this.gameAlias + '/interface';
		this.soundsSrc = this.imagePath + this.gameAlias + '/sounds/';
		this.getImages();
		this.textures['syms'].push({src: this.symsPath + '/blured.json', name: 'blured'});
		this.textures['images'].push({src: this.interfacePath + '/mainscreen.jpg', name: 'mainscreen'});
		this.textures['images'].push({src: this.interfacePath + '/bonus_frame.png', name: 'bonus_frame'});

		if (this.symBg) {
			this.textures['images'].push({src: this.symsPath + '/bg.png', name: 'bg'});
		}

		if (this.border) {
			if (this.border === 'rect.png') {
				this.textures['images'].push({src: this.interfacePath + '/' + this.border, name: 'mainscreenBorder'});
			} else {
				this.textures['images'].push({src: this.imagePath + '/interface/' + this.border, name: 'mainscreenBorder'});
			}
		}
		await this.waitLoad();
	}

	async getSettings(name) {
		return new Promise(res => {
			fetch('./settings/' + name + '.json')
			.then(response => {
				res(response.json());
			})
		});
	}

	createLines() {
		this.lines = [
			[],
			[],
			[],
			[
				[[0, 1], [1, 1], [2, 1]], 
				[[0, 0], [1, 0], [2, 0]], 
				[[0, 2], [1, 2], [2, 2]], 
				[[0, 0], [1, 1], [2, 2]], 
				[[0, 2], [1, 1], [2, 0]]
			],
			[],
			[
				[[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]], 
				[[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], 
				[[0, 2], [1, 2], [2, 2], [3, 2], [4, 2]], 
				[[0, 0], [1, 1], [2, 2], [3, 1], [4, 0]], 
				[[0, 2], [1, 1], [2, 0], [3, 1], [4, 2]], 
				[[0, 0], [1, 0], [2, 1], [3, 2], [4, 2]], 
				[[0, 2], [1, 2], [2, 1], [3, 0], [4, 0]], 
				[[0, 1], [1, 0], [2, 0], [3, 0], [4, 1]],
				[[0, 1], [1, 2], [2, 2], [3, 2], [4, 1]], 
				[[0, 0], [1, 0], [2, 1], [3, 0], [4, 0]], 
				[[0, 2], [1, 2], [2, 1], [3, 2], [4, 2]], 
				[[0, 0], [1, 1], [2, 1], [3, 1], [4, 0]], 
				[[0, 2], [1, 1], [2, 1], [3, 1], [4, 2]], 
				[[0, 1], [1, 1], [2, 0], [3, 1], [4, 1]], 
				[[0, 1], [1, 1], [2, 2], [3, 1], [4, 1]], 
				[[0, 1], [1, 0], [2, 1], [3, 0], [4, 1]], 
				[[0, 1], [1, 2], [2, 1], [3, 2], [4, 1]], 
				[[0, 0], [1, 1], [2, 0], [3, 1], [4, 0]], 
				[[0, 2], [1, 1], [2, 2], [3, 1], [4, 2]], 
				[[0, 2], [1, 0], [2, 2], [3, 0], [4, 2]], 
				[[0, 0], [1, 2], [2, 0], [3, 2], [4, 0]], 
				[[0, 0], [1, 2], [2, 2], [3, 2], [4, 0]], 
				[[0, 2], [1, 0], [2, 0], [3, 0], [4, 2]], 
				[[0, 1], [1, 0], [2, 0], [3, 0], [4, 0]], 
				[[0, 1], [1, 2], [2, 2], [3, 2], [4, 2]]
			]
		]
	}
}