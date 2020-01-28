/* eslint-disable no-undef */
import { get, post } from '../helpers/Api';

export const getSolcList = () => get(SOLC_LIST_URL);

export const getEthContractLogs = (params) =>
	get(`${CRYPTO_API_URL}coins/eth/contracts/logs`, { ...params, token: CRYPTO_API_KEY });

export const getEthNetworkInformation = () => get(`${CRYPTO_API_URL}coins/eth/network`, { token: CRYPTO_API_KEY });

export const callContract = (address, params) =>
	post(`${CRYPTO_API_URL}coins/eth/contracts/${address}/call?token=${CRYPTO_API_KEY}`, params);
