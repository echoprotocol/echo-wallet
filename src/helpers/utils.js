import { LINUX_PLATFORM, MAC_PLATFORM } from '../constants/PlatformConstants';

export const isPlatformSupportNode = (platform) =>
	[LINUX_PLATFORM, MAC_PLATFORM].includes(platform);
