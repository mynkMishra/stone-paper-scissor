class SessionStorageService {
	static set(key, value) {
		try {
			sessionStorage.setItem(key, JSON.stringify(value));
		} catch (e) {
			console.log(e);
		}
	}

	static get(key) {
		try {
			return JSON.parse(sessionStorage.getItem(key));
		} catch (e) {
			console.log(e);
		}
	}

	static remove(key) {
		sessionStorage.removeItem(key);
	}
}

export default SessionStorageService;
