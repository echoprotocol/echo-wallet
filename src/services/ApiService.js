/* eslint-disable no-undef */
import { get, post } from '../helpers/Api';

export const getSolcList = () => get(SOLC_LIST_URL);

export const getEthContractLogs = (params) =>
	get(`${CRYPTO_API_URL}coins/eth/contracts/logs`, params, { authorization: CRYPTO_API_URL });

export const callContract = (address, params) =>
	post(`${CRYPTO_API_URL}coins/eth/contracts/${address}/call`, params, { authorization: CRYPTO_API_URL });
