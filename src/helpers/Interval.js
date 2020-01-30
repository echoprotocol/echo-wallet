class Interval {

	constructor() {
		this.instance = null;
	}

	makeInterval(callback = () => {}, time = 0) {
		this.stopInterval();
		this.instance = setInterval(callback, time);
	}

	stopInterval() {
		if (!this.instance) {
			return;
		}

		clearInterval(this.instance);
		this.instance = null;
	}

}


const interval = new Interval();

export default interval;
