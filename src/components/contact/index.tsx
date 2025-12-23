import MainHeading from '@/components/main-heading';
import { Routes } from '@/constants/enums';


import { getTranslations } from 'next-intl/server';

const Contact = async ({ locale }: { locale: string }) => {
  const t = await getTranslations({ locale, namespace: 'home.contact' });

  return (
    <section className='section-gap' id={Routes.CONTACT}>
      <div className='container text-center'>
        <MainHeading
          subTitle={t('dont_hesitate')}
          title={t('contactUs')}
        />
        <div className='mt-8'>
          <a className='text-3xl md:text-4xl underline text-accent font-bold' href='tel:+2012121212'>
            +2012121212
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;