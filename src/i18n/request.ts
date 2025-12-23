import { getRequestConfig } from 'next-intl/server';
import { i18n } from '../i18n.config';

export default getRequestConfig(async ({ locale }) => {
    const activeLocale = (locale as string) || i18n.defaultLocale;

    return {
        messages: (await import(`../messages/${activeLocale}.json`)).default,
        locale: activeLocale,
        timeZone: 'UTC'
    };
});
