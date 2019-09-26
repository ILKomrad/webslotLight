import { Socket } from './socket.js';

export default class Model {
	constructor(settings) {
		this.data = {};
		this.settings = settings;
		this.socket = new Socket(settings);
	}

	init(data) {
		this.data = data;
		this.gameState = this.data.lastGame.gameState;
		this.setBalance(this.data.balance);
		this.betList = this.data.bets.map(b => b / 100);
		this.lineList = this.data.lines.map(b => parseInt(b, 10));
		this.setLineIndex();
		this.setBetIndex();
       	this.coinPrefix = (this.data.currencyCode === "EUR") ? "€" : this.data.currencyCode;
       	this.coinPrefixSym = (this.data.currencySymbol === "eur") ? "€" : this.data.currencySymbol;
       	this.lineList = this.data.lines.map(b => parseInt(b, 10));
       	this.credits = this.data.balance;
       	this.winTable = this.data.winTable.map(b => b.roles[0].paytable);
       	this.unfinishedGames = this.data.unfinishedGames;
       	this.settings.maxDoublerGames = this.data.max_doubler_games;
       	this.setLimit();
       	this.setWin(this.data.lastGame.win);
       	this.setGameType(this.data.lastGame.extra_game, this.data.lastGame.type);
       	this.checkBonus(this.data.lastGame);
	}

	async hello() {
		// await this.socket.open();
		// await this.socket.hello();
		// this.init(this.socket.data);
		this.init({
			balance: 100000,
			bets: [1, 2, 3, 5, 10, 20, 50, 100, 200],
			lines: [1, 5, 10, 15, 20],
			lastGame: {
				gameState: [
					[4, 0, 4, 0, 2],
					[4, 0, 0, 3, 2],
					[3, 0, 4, 0, 5],
					[4, 0, 4, 7, 3],
					[3, 0, 4, 5, 3]
				],
				lines: 20,
				bet: 40,
				win: 100,
			  extra_game: "normal",
				// extra_game: "simple_bonus",
				// extra_games_won: ["simple_bonus", 10],
            },
            unfinishedGames: false,
			winTable: [
				{
					symbol: 0, 
					roles: [
						{role: "joker", plays_with_joker: false, paytable: [0, 10, 100, 500, 2000]},
						{role: "normal", plays_with_joker: true, paytable: [0, 0, 30, 200, 500]},
						{role: "joker", plays_with_joker: true, paytable: [0, 0, 30, 200, 500]},
					], 
					roles_list: ["joker"]
				}
			]
		});
	}

	async getStatus() {
		return;
		const request = JSON.stringify( {
			cmd: 'get_status'
		});
		await this.socket.sendData(request);
		await this.socket.dataisReady('get_status');
		this.setSuperBank(this.socket.data.super_bank);
		this.setBalance(this.socket.data.balance);
	}

	async sendPlay() {
		// await this.socket.sendData(JSON.stringify({
		// 	cmd: 'play',
		// 	subType: this.getGameType(),
		// 	bet: +this.bet * 100,
		// 	lines: this.getLineIndex(),
		// 	userId: this.settings.userId,
		// 	gameMode: 'demo'
	 	// }));
		 // await this.socket.dataisReady('play');
		this.socket.data = {
			balance: 94010,
			balance_with_win: 104010,
			bet: 2000,
			cmd: "play",
			extra_game: "simple_bonus",
			extra_games_won: ["simple_bonus", 10],
			gameMode: "demo",
			gameState: [
				[3, 5, 7, 5, 2],
				[2, 8, 6, 6, 6],
				[7, 4, 8, 5, 4],
				[1, 7, 2, 8, 7],
				[8, 3, 5, 7, 3]
			],
			lines: 20,
			overlay: [
				[null, null, null],[null, null, null],[null, null, null],[null, null, null],[null, null, null]
			],
			result: "ok",
			spin_win: 10000,
			type: "normal",
			userId: "977EF0194D6FFFBC",
			win: 10000,
			winLines: []
		}
	 	this.update(this.socket.data);
	}

	async sendUpdate() {
		return;
		await this.socket.sendData(JSON.stringify({
    	cmd: 'update',
      userId: this.settings.userId
    }));
	}

	async take() {
		return;
		const request = JSON.stringify({
			cmd: 'double',
			subType: 'double',
			action: 'take'
		});
		await this.socket.sendData(request);
		await this.socket.dataisReady('double');
		this.setGameType(this.socket.data.extra_game);
	}

	async double() {
		return;
		const request = JSON.stringify({
			action: "get",
			cmd: "double",
			subType: "double"
		});
		await this.socket.sendData(request);
		await this.socket.dataisReady("double"); 
		
		return this.socket.data;
	}

	async doubleChoose(color) {
		return;
		const request = JSON.stringify({
			action: "bet",
			cmd: "double",
			playersChoice: color,
			subType: "double"
		});
		await this.socket.sendData(request);
		await this.socket.dataisReady("double"); 

		return this.socket.data;
	}

	update(data) {
		this.setBalance(data.balance);
		this.gameState = data.gameState;
		this.setWin(data.win);
		this.setGameType(data.extra_game, data.type);
		this.checkBonus(data);
		this.winLines = data.winLines;
	}

	setLineIndex() {
		this.lineIndex = this.lineList.length - 1;
	}

	setBalance(balance) {
		this.balance = balance;
	}

	setBetIndex() {
		if (this.data.lastGame.lines > 240) {
        	this.betIndex = this.betList.indexOf(this.data.lastGame.bet);
       	} else {
        	this.betIndex = this.betList.indexOf(this.data.lastGame.bet / this.data.lastGame.lines);
       	}

       	if (this.betIndex < 0) {this.betIndex = 0;}
	}

	setGameType(gameType, currentType) {
		this.gameType = gameType;

		if (currentType) {
			this.currentType = currentType;
		} else {
			this.currentType = gameType;
		}
	}

	checkBonus(data) {
		console.log( 'data', data, this.gameType, this.currentType )
		if ((this.gameType === "simple_bonus") || (this.currentType === "simple_bonus")) {
			this.isBonus = true;

			if (data.extra_games_won) {
				this.bonusGameNum = 1;
				this.bonusGameTotal = data.extra_games_won[1];
				this.bonusStarted = false;
			} else {
				this.bonusGameNum = data.game_number;
				this.bonusGameTotal = data.game_total;
				this.bonusStarted = true;
			}

			if (this.bonusGameTotal === this.bonusGameNum) {
				this.bonusFinished = true;
			} else {
				this.bonusFinished = false;
			}
		}
	}

	setWin(win) {
		this.win = win;
	}

	setLimit() {
		if (this.data.limitForBetFromCredits) { 
        	this.limitForBetFromCredits = this.data.limitForBetFromCredits / 100; 
        }
	}

	setSuperBank(superBank) {
		this.data.superBank = superBank;
	}


	setBet(isInit, ignoreWin) {
	    if (!isInit && (this.totalWin !== 0)) { return; }

	    if ( this.lineList[ this.lineIndex ] < 240 ) {
	      this.bet = Math.round( this.betList[ this.betIndex ].toFixed( 2 ) * this.lineList[ this.lineIndex ] * 100 ) / 100;
	    } else {
	      this.bet = Math.round( this.betList[ this.betIndex ] * 100 ) / 100;
	    }

	    if ((this.data.superBank === undefined) || (this.betIndex === 0)) { return; }

	    if (this.data.superBank === 0) {
	      if (this.bet > this.limitForBetFromCredits) {
	        this.betIndex -= 1;
	        this.setBet(isInit);
	      }
	    } else {
	      if (!this.checkBet()) { return;}
	      if ((this.data.superBank / 100 < this.bet) && this.betIndex) {
	        this.betIndex -= 1;
	        this.setBet(isInit);
	      }
	    }
	}

	getGameType() {
		return this.gameType;
	}

	getWin() {
		return this.win;
	}

	getBet() {
		return this.bet;
	}

	checkBet(bet, _index) {
	    if (!this.limitForBetFromCredits) { return true; }

	    let b, index;

	    if (bet || _index) {
	      index = (_index !== undefined) ? _index : this.betList.indexOf(bet);

	      if ( this.lineList[ this.lineIndex ] < 240 ) {
	        b = Math.round( this.betList[ index ].toFixed( 2 ) * this.lineList[ this.lineIndex ] * 100 ) / 100;
	      } else {
	        b = Math.round( this.betList[ index ] * 100 ) / 100;
	      }
	    }

	    if (this.data.superBank === 0) {
	      return (b <= this.limitForBetFromCredits);
	    } else {
	      return ((this.data.superBank / 100) >= this.limitForBetFromCredits);
	    }
	}

	getSuperBank() {
		return this.data.superBank;
	}

	getBalance() {
		return this.balance;
	}

	getGameState() {
		return this.gameState;
	}

	getLineIndex() {
		return this.lineList[this.lineIndex];
	}

	getInterfaceInfo() {
		return {
			balance: this.getBalance(),
			lineIndex: this.getLineIndex(),
			bet: this.getBet(),
			win: this.getWin(),
			superBank: this.getSuperBank(),
			gameType: this.getGameType()
		}
	}
}