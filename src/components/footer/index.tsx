

import { getTranslations } from "next-intl/server";

const Footer = async () => {
  const t = await getTranslations()

  return (
    <footer className='border-t p-8 text-center text-accent'>
      <div className='container'>
        <p>{t('copyRight')}</p>
      </div>
    </footer>
  );
};

export default Footer;