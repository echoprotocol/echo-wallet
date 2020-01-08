let ipcRenderer;

try {
	({ ipcRenderer } = window);
} catch (e) {
	console.log('Err electron import');
}

class MainProcessAPIService {

	getPlatform() {
		return new Promise((resolve) => {

			if (!ipcRenderer) {
				return resolve(null);
			}

			ipcRenderer.once('getPlatform', (_, platform) => {
				resolve(platform);
			});

			ipcRenderer.send('getPlatform');

			return null;
		});

	}

}


export default MainProcessAPIService;
