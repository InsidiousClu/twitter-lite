import { DateTime } from 'luxon';

export const formatTime = (date: string | undefined): string => {
	const toFormat = (dateTime: DateTime) => {
		const diff = DateTime.local().diff(dateTime, ['hours']);
		return diff.hours > 24 ? dateTime.toFormat('d.m.yyyy') : diff.toFormat('h:mm ago');
	};
	if (!date) {
		return toFormat(DateTime.local());
	}
	return toFormat(DateTime.fromISO(date));
};
