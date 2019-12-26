import { EN_LOCALE } from '../constants/GlobalConstants';

class LanguageService {

	static getDefaultLanguage() {
		return EN_LOCALE;
	}

	static getCurrentLanguage() {

		const locale = localStorage.getItem('locale') || this.getDefaultLanguage();

		return locale;
	}

	/**
	 *
	 * @param {String} language
	 * @return {*}
	 */
	static setCurrentLanguage(language) {

		localStorage.setItem('locale', language);

		return language;
	}

	static resetLanguage() {
		localStorage.removeItem('locale');
	}

}

export default LanguageService;
