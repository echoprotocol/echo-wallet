import { constants } from 'echojs-lib';

export const STABLE_COINS = {
	EBTC: 'EBTC',
	EETH: 'EETH',
	SETH: 'SETH',
	SBTC: 'SBTC',
};

export const SIDECHAIN_ASSETS_DATA = {
	eETH: {
		id: `1.${constants.PROTOCOL_OBJECT_TYPE_ID.ASSET}.1`,
		precision: 8,
		symbol: STABLE_COINS.EETH,
	},
	eBTC: {
		id: `1.${constants.PROTOCOL_OBJECT_TYPE_ID.ASSET}.2`,
		precision: 8,
		symbol: STABLE_COINS.EBTC,
	},
	sETH: {
		id: `1.${constants.PROTOCOL_OBJECT_TYPE_ID.ASSET}.3`,
		precision: 8,
		symbol: 'SETH',
	},
	sBTC: {
		id: `1.${constants.PROTOCOL_OBJECT_TYPE_ID.ASSET}.4`,
		precision: 8,
		symbol: 'SBTC',
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
	SETH: {
		echo: 'SETH',
		original: 'SETH',
	},
	SBTC: {
		echo: 'SBTC',
		original: 'SBTC',
	},
};

export const CHECK_BLOCK_INTERVAL = 15 * 1000;
