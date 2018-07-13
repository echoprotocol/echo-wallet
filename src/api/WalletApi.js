export function validateAccountExist(instance, accountName, shouldExist, limit = 50) {
	instance.dbApi().exec('lookup_accounts', [accountName, limit])
		.then((result) => {
			console.log(result);
			if (!result.find((i) => i === accountName) && shouldExist) {
				return 'Account not found';
			}

			if (result.find((i) => i === accountName) && !shouldExist) {
				return 'Account name is already taken';
			}

			return null;
		});
}

export function createWallet(account, password) {

	return new Promise((resolve) => {
		resolve(password);
	});
}

export function unlockWallet(account, password) {

	return new Promise((resolve) => {
		resolve(password);
	});
}
