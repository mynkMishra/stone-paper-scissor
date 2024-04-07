class LocalStorageService {
	static set(key, value) {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (e) {
			console.log(e);
		}
	}

	static get(key) {
		try {
			return JSON.parse(localStorage.getItem(key));
		} catch (e) {
			console.log(e);
		}
	}

	static remove(key) {
		localStorage.removeItem(key);
	}
}

export default LocalStorageService;
