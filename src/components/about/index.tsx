import { Routes } from '@/constants/enums';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

async function About({ locale }: { locale: string }) {

  const t = await getTranslations({ locale, namespace: 'home.about' });
  
  return (
    <section className='section-gap' id={Routes.ABOUT}>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          <div className='relative h-[400px] lg:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl group'>
            <Image
              src='/assets/images/about-chef.png'
              alt={t('aboutUs')}
              fill
              className='object-cover group-hover:scale-110 transition-transform duration-700'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8'>
              <p className='text-white font-medium italic'>{`"${t('chefQuote')}"`}</p>
            </div>
          </div>

          <div className='flex flex-col gap-6 md:gap-8'>
            <div>
              <span className='text-primary font-bold tracking-widest uppercase text-sm mb-3 block'>
                {t('ourStory')}
              </span>
              <h2 className='text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6'>
                {t('aboutUs')}
              </h2>
            </div>

            <div className='space-y-4 text-muted-foreground text-lg leading-relaxed'>
              <p className='border-l-4 border-primary pl-6 py-2 italic font-medium text-foreground'>
                {t('descriptions.one')}
              </p>
              <p>{t('descriptions.two')}</p>
              <p>{t('descriptions.three')}</p>
            </div>

            <div className='grid grid-cols-2 gap-6 mt-4'>
              <div className='p-4 rounded-2xl bg-secondary/10 border border-secondary/20'>
                <div className='text-3xl font-black text-primary mb-1'>100%</div>
                <div className='text-sm font-bold uppercase tracking-wider text-muted-foreground'>{t('highlights.freshBeef')}</div>
              </div>
              <div className='p-4 rounded-2xl bg-secondary/10 border border-secondary/20'>
                <div className='text-3xl font-black text-primary mb-1'>24/7</div>
                <div className='text-sm font-bold uppercase tracking-wider text-muted-foreground'>{t('highlights.fastSupport')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;