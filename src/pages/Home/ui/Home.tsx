import { Button, Steps } from 'antd';
import { type FC, useCallback } from 'react';

import { AnalogClock } from 'shared/ui/components';

import businessOwner1 from 'static/businessOwner1.png';
import businessOwner2 from 'static/businessOwner2.png';
import businessOwner3 from 'static/businessOwner3.png';

import { useTranslation } from '../lib';

import s from './Home.module.scss';

const handleStartClick = () => {
  // TODO: Implement navigation to main functionality
};

export const Home: FC = () => {
  const { t } = useTranslation();

  const onClick = useCallback(() => {
    handleStartClick();
  }, []);

  return (
    <div className={s.homePage}>
      <section id="home" className={s.welcomeSection}>
        <div className={s.left}>
          <div className={s.quoteText}>
            <div className={s.quoteLeft}>
              <span className={s.quoteIcon}></span>
              <span className={s.quoteIcon}></span>
              <span className={s.quoteIcon}></span>
            </div>
            <span className={s.quoteContent}>
              Экономим ваше время. Убираем хаос. <br /> Клиенты сами становятся в очередь.
            </span>
            <div className={s.quoteRight}>
              <span className={s.quoteIcon}></span>
              <span className={s.quoteIcon}></span>
              <span className={s.quoteIcon}></span>
            </div>
          </div>

          <div className={s.leftContent}>
            <h2 className={s.title}>
              <span className={s.titleLine1}>Инновационное</span>
              <span className={s.titleLine2}>
                <span className={s.arrow}></span>
                решение
              </span>
              <span className={s.titleLine3}>вчерашних забот</span>
            </h2>
            <Button type={'default'} className={s.startButton}>
              Начать регистрацию
            </Button>
          </div>

          <div className={s.owners}>
            <div className={s.ownersAvatars}>
              <img src={businessOwner1} alt="Business owner 1" className={s.avatar} />
              <img src={businessOwner2} alt="Business owner 2" className={s.avatar} />
              <img src={businessOwner3} alt="Business owner 3" className={s.avatar} />
            </div>
            <span className={s.ownersText}>100+ владельцев бизнеса пользуются нашим сервисом</span>
          </div>
        </div>
        <div className={s.right}>
          <AnalogClock />
        </div>
      </section>
      <section id="how-it-works" className={s.howItWorksSection}>
        <Steps
          /*
           * current={current}
           * onChange={onChange}
           */
          items={[
            {
              title: 'Step 1',
              icon: <b>1</b>,
              description: <b>gdffd</b>,
            },
            {
              title: 'Step 2',
              description: <b>gdffd</b>,
            },
            {
              icon: <></>,
              title: (
                <Steps
                  /*
                   * current={current}
                   * onChange={onChange}
                   */
                  direction={'vertical'}
                  items={[
                    {
                      title: 'Step 4',
                      icon: <b>4</b>,
                      description: <b>gdffd</b>,
                    },
                    {
                      icon: <b>5</b>,
                      title: 'Step 5',
                      description: <b>gdffd</b>,
                    },
                    {
                      icon: <b>6</b>,
                      title: 'Step 6',
                      description: <b>gdffd</b>,
                    },
                  ]}
                />
              ),
            },
          ]}
        />

        <Steps
          direction="vertical"
          items={[
            {
              title: 'Step 1',
              icon: <b>1</b>,
              description: <b>gdffd</b>,
            },
            {
              title: 'Step 2',
              description: <b>gdffd</b>,
            },
            {
              title: 'Step 2',
              description: <b>gdffd</b>,
            },
            {
              title: 'Step 2',
              description: <b>gdffd</b>,
            },
          ]}
        />
      </section>
      <section id="queue-types" className={s.queueTypesSection}>
        {/* Типы очередей */}
      </section>
      <section id="contacts" className={s.contactsSection}>
        {/* Контакты */}
      </section>
    </div>
  );
};
