export class Socket {
	constructor(settings) {
	    this.url = settings.url;
	    this.idle = true;
	    this.timeout = 10000; // ms
	    this.opened = false;
	    this.close = false;
	    this.settings = settings;
   	}

   	async open() {
    	const that = this;
     	console.log('Connecting to server...', this.url);
     	this.instanse = new WebSocket(this.url);
     	try {
       		return await new Promise( (resolve, reject) => {
	       		that.instanse.onopen = () => {
		         	console.log('Connected to socket', that.url);
		         	that.opened = true;
		         	resolve('Success');
		       	};

		       	that.instanse.onclose = (event) => {
		        	if (event.wasClean) {
		           		console.log('Socket closed fine');
		         	} else {
		           		console.log('Alert: Socket destroyed');
		         	}
		         	const error = 'Network error.\n Please restart.\n Error code: ' + String(event.code);
		         	reject(new Error('Socket closed', error));
		       	};

		       	const timer = setTimeout(() => {
		        	reject(new Error('reconnect'));
		       	}, 2000);

		       	that.instanse.onerror = (error) => {
		        	console.log('Socket Error ', error);
		        	reject(new Error('socket not opened', error));
		       	};
	     	});
		} catch (err) {
		    return Promise.reject(err);
		}
 	}

 	async helloFromServer() {
     	const that = this;
     	const ready = await new Promise((resolve, reject) => {
       		const timer = setTimeout(() => {
         		reject(new Error('socket timeout'));
       		}, that.timeout);

       		that.instanse.onmessage = (event) => {
         		that.data = JSON.parse(event.data);
         		that.serverAlive = true;
         		that.dataReady = true;
         		console.log('Server respond: ', JSON.parse(JSON.stringify(that.data)));
         		that.idle = true;
         		clearTimeout(timer);
         		resolve('Success');
       		};
     	});
     	return ready;
   	}

   	async sendData(text, waitForReply = true) {
     	const milisec = Date.now();
     	console.log('%c  ▶  ', 'color: white; background-color: #b56900', new Date().toLocaleTimeString(), JSON.parse(text) );
     	if (!this.close) {
       		if (waitForReply) this.idle = false;
       		this.instanse.send(text);
     	}
   	}

   	async dataisReady(cmd, time) {
     	const that = this;
     	const t = time || that.timeout;
     	const ready = await new Promise(((resolve, reject) => {
	       	const timer = setTimeout(() => {
	         	if (!that.close) {
	           		that.instanse.close();
	           		that.close = true;
	           		that.dataReady = true;
	           		that.idle = true;
	         	}
	         	reject(new Error('socket timeout'));
	       	}, t);

	       	that.instanse.onmessage = (event) => {
	         	console.log('%c  ◀  ', 'color: white; background-color: #b56900', new Date().toLocaleTimeString(), new Date().getMilliseconds(), JSON.parse(event.data));
	        	const data = JSON.parse(event.data);
				console.log( data.cmd, cmd );
	         	if (cmd && (data.cmd !== cmd)) {
	           		return;
	         	}

	         	if (data.cmd !== 'enabled_keys') {
	           		that.data = data;
		        }
	         	that.dataReady = true;
	         	that.idle = true;
	         	clearTimeout(timer);
	         	resolve('Success');
	       	};
     	}));

     	return ready;
   	}

   	async hello() {
     	await this.sendData(JSON.stringify({
       		cmd: 'hello',
       		game: "revoltex:Pedros Farm",
       		// game: this.settings.gameName,
       		gameMode: 'demo',
       		userId: this.settings.userId
     	}));

     	try {
       		await this.helloFromServer();
     	} catch (error) {
       		console.error(error);
       		throw error;
     	}
   	}
}