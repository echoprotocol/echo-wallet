import { platform } from 'os';
import { WIN_PLATFORM, LINUX_PLATFORM, MAC_PLATFORM } from '../src/constants/PlatformConstants';

export default () => {
	switch (platform()) {
		case 'aix':
		case 'freebsd':
		case 'linux':
		case 'openbsd':
		case 'android':
			return LINUX_PLATFORM;
		case 'darwin':
		case 'sunos':
			return MAC_PLATFORM;
		case 'win32':
			return WIN_PLATFORM;
		default:
			throw new Error('Unknown error');
	}
};
