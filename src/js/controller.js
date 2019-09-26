export default class Controller {
    constructor() {
        console.log('controller')
    }

    async init(presenter, model) {
        this.presenter = presenter;
        this.model = model;
        await this.model.hello();
        await this.model.getStatus();
        this.presenter.init(this.model.getGameState(), this.model.getInterfaceInfo());
        
        if (this.model.unfinishedGames) {
			this.gameStart(true);
		}
    }

    gameStart(isRestore, respins) {
        if (this.model.isBonus) {
			this.bonusProcces(true);
		}

		if (!restore) {
			this.presenter.updateIndicators({balance: this.model.getBalance()});
		}

		if (!restore && !respin) {
			this.model.sendPlay();
		}

		if (!restore) {
			this.presenter.spin({
				clutch: this.model.clutch, //catz2
				locked: this.model.locked //extra_dice
			})
		}
    }

    bonusProcces() {}
}