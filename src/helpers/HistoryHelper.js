import accounting from 'accounting';

export default (amount, precision, symbol) => accounting.formatMoney(amount / (10 ** precision), symbol, precision, ' ', '.', '%v %s');
