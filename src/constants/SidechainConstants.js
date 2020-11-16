export const STABLE_COINS = {
	EBTC: 'EBTC',
	EETH: 'EETH',
	SETH: 'SETH',
	SBTC: 'SBTC',
};

export const SIDECHAIN_ASSETS_DATA = {
	eETH: {
		precision: 18,
		symbol: STABLE_COINS.EETH,
	},
	eBTC: {
		precision: 8,
		symbol: STABLE_COINS.EBTC,
	},
};

export const SIDECHAIN_DISPLAY_NAMES = {
	EETH: {
		echo: 'eETH',
		original: 'ETH',
	},
	EBTC: {
		echo: 'eBTC',
		original: 'BTC',
	},
};

export const CHECK_BLOCK_INTERVAL = 15 * 1000;
