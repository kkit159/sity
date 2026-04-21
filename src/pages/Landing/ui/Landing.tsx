/* eslint-disable unicorn/prevent-abbreviations */
import { Button } from '@gravity-ui/uikit';
import { type FC, useEffect, useRef } from 'react';

import chatBubbles from '../images/chat-bubbles.png';
import iconCamera from '../images/icon-camera.png';
import iconClock from '../images/icon-clock.png';
import iconDashboard from '../images/icon-dashboard.png';
import iconEye from '../images/icon-eye.png';
import iconFilm from '../images/icon-film.png';
import iconHeadset from '../images/icon-headset.png';
import iconPencil from '../images/icon-pencil.png';
import lightBulb from '../images/light-bulb.png';
import project1Thumb from '../images/project-1-thumb.jpg';
import project1 from '../images/project-1.jpg';
import project2Thumb from '../images/project-2-thumb.jpg';
import project2 from '../images/project-2.jpg';
import project3Thumb from '../images/project-3-thumb.jpg';
import project3 from '../images/project-3.jpg';
import project4Thumb from '../images/project-4-thumb.jpg';
import project4 from '../images/project-4.jpg';
import project5Thumb from '../images/project-5-thumb.jpg';
import project5 from '../images/project-5.jpg';
import project6Thumb from '../images/project-6-thumb.jpg';
import project6 from '../images/project-6.jpg';
import team1 from '../images/team-1.jpg';
import team2 from '../images/team-2.jpg';
import team3 from '../images/team-3.jpg';
import videoPoster from '../images/video-poster.jpg';

import s from './Landing.module.css';

const bars = [
  ['end', 'top'],
  ['side', 'top', 'left'],
  ['side', 'top', 'right'],
  ['middle'],
  ['side', 'bottom', 'left'],
  ['side', 'bottom', 'right'],
  ['end', 'bottom'],
];

const createDigit = (digit: string): HTMLElement => {
  const $digit = document.createElement('figure');

  $digit.classList.add('digit');
  $digit.dataset.digit = digit;

  bars.forEach((classes) => {
    const $span = document.createElement('span');

    $span.classList.add(...classes);
    $digit.append($span);
  });

  return $digit;
};

const Clock: FC = () => {
  const mainRef = useRef<HTMLElement>(null);
  const hourRef = useRef<{ number: number } | null>(null);
  const minuteRef = useRef<{ number: number } | null>(null);
  const secondRef = useRef<{ number: number } | null>(null);

  useEffect(() => {
    if (!mainRef.current) {
      return;
    }

    const initGroup = (num: number, padding = 2) => {
      const $group = document.createElement('div');

      $group.classList.add('group');

      const digits = [...`${num}`.padStart(padding, '0')].map((digit) => {
        return createDigit(digit);
      });

      $group.append(...digits);

      return {
        element: $group,
        set number(val: number) {
          num = val;
          const padded = `${num}`.padStart(padding, '0');
          const lastTwo = padded.slice(-2);

          let i = 0;

          for (const digit of lastTwo) {
            digits[i].dataset.digit = digit;
            i++;
          }
        },
        get number() {
          return num;
        },
      };
    };

    const addDigits = (number: number) => {
      const $digits = document.createElement('div');

      $digits.classList.add('digits');
      const group = initGroup(number);
      const groupShadow1 = initGroup(number);
      const groupShadow2 = initGroup(number);

      groupShadow1.element.classList.add('shadow', 'shadow1');
      groupShadow2.element.classList.add('shadow', 'shadow2');
      $digits.append(group.element);
      $digits.append(groupShadow1.element);
      $digits.append(groupShadow2.element);
      mainRef.current?.append($digits);

      return {
        set number(val: number) {
          number = val;
          group.number = val;
          groupShadow1.number = val;
          groupShadow2.number = val;
        },
        get number() {
          return number;
        },
      };
    };

    const addColon = () => {
      const $colonGroup = document.createElement('div');

      $colonGroup.classList.add('colon-group');

      const $colon = document.createElement('figure');

      $colon.append(document.createElement('span'));
      $colon.classList.add('colon');

      const $colonShadow1 = document.createElement('figure');

      $colonShadow1.append(document.createElement('span'));
      $colonShadow1.classList.add('colon', 'shadow', 'shadow1');

      const $colonShadow2 = document.createElement('figure');

      $colonShadow2.append(document.createElement('span'));
      $colonShadow2.classList.add('colon', 'shadow', 'shadow2');

      $colonGroup.append($colon);
      $colonGroup.append($colonShadow1);
      $colonGroup.append($colonShadow2);
      mainRef.current?.append($colonGroup);
    };

    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    hourRef.current = addDigits(hours);
    addColon();
    minuteRef.current = addDigits(minutes);
    addColon();
    secondRef.current = addDigits(seconds);

    const update = () => {
      now = new Date();
      const newSeconds = now.getSeconds();

      if (seconds !== newSeconds) {
        hours = now.getHours();
        minutes = now.getMinutes();
        seconds = newSeconds;
        hourRef.current!.number = hours;
        minuteRef.current!.number = minutes;
        secondRef.current!.number = seconds;
      }

      requestAnimationFrame(update);
    };

    update();

    if (/^(?:(?!chrome|android)[\s\S])*(?:safari|iPad|iPhone|iPod)/i.test(navigator.userAgent)) {
      document.body.classList.add('safari');
    }

    return () => {
      mainRef.current?.remove();
    };
  }, []);

  return (
    <div className={s.clockWrapper}>
      <main ref={mainRef} className={s.clockMain} />
    </div>
  );
};

const _handleScrollTo = (id: string) => {
  const element = document.querySelector(`#${id}`);

  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const handleImageClick = (imageSource: string) => {
  window.open(imageSource, '_blank');
};

export const Landing: FC = () => {
  return (
    <div className={s.root}>
      {/* <header className={s.header} id={'top'}>
        <div className={s.wrapper}>
          <h1 className={s.logo}>
            <a
              href={'#'}
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo('home');
              }}
              className={s.logoLink}
            >
              Chase2
            </a>
          </h1>
          <nav>
            <ul className={s.navigation}>
              <li>
                <a
                  href={'#home'}
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollTo('home');
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href={'#about'}
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollTo('about');
                  }}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href={'#services'}
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollTo('services');
                  }}
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href={'#portfolio'}
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollTo('portfolio');
                  }}
                >
                  Portfolio
                </a>
              </li>
              <li>
                <a
                  className={s.navCta}
                  href={'#'}
                  onClick={(e) => {
                    return e.preventDefault();
                  }}
                >
                  Try Now
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header> */}

      <section className={s.banner} id={'home'}>
        <div className={s.bannerContainer}>
          <div className={s.bannerLeft}>
            <h2>Очередь онлайн</h2>
            <p className={s.subtitle}>Инновационное решение для управления очередями</p>
            <div className={s.buttons}>
              <Button view={'action'} size={'xl'} className={s.startButton}>
                Начать
              </Button>
              <Button view={'outlined-action'} size={'xl'} className={s.startButton}>
                Подробнее
              </Button>
            </div>
          </div>
          {/* <div className={s.bannerDivider} /> */}
          <div className={s.bannerRight}>
            <Clock />
          </div>
        </div>
      </section>

      <section className={s.videoSection}>
        <div className={s.wrapper}>
          <h3>What is Chase?</h3>
          <p className={s.subtitle}>Watch our promotional video</p>
          <video
            width={'790'}
            src={'video.mp4'}
            poster={videoPoster}
            onClick={(e) => {
              const video = e.currentTarget;

              video.play();
            }}
            controls
            preload={'metadata'}
          >
            <p>Video playback unsupported</p>
          </video>
          <a
            href={'#'}
            className={s.button1}
            onClick={(e) => {
              return e.preventDefault();
            }}
          >
            Begin
          </a>
        </div>
      </section>

      <section className={s.servicesSection} id={'services'}>
        <div className={s.wrapper}>
          <h3>Services</h3>
          <p className={s.subtitle}>We do lots of cool things</p>
          <ul className={s.servicesList}>
            <li>
              <div className={s.imageContainer}>
                <img src={iconPencil} alt={'services icon'} />
              </div>
              <h5>Graphic Design</h5>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida blandit lacus a laoreet.</p>
              <a
                href={'#'}
                onClick={(e) => {
                  return e.preventDefault();
                }}
              >
                Learn More
              </a>
            </li>
            <li>
              <div className={s.imageContainer}>
                <img src={iconCamera} alt={'services icon'} />
              </div>
              <h5>Photography</h5>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida blandit lacus a laoreet.</p>
              <a
                href={'#'}
                onClick={(e) => {
                  return e.preventDefault();
                }}
              >
                Learn More
              </a>
            </li>
            <li>
              <div className={s.imageContainer}>
                <img src={iconFilm} alt={'services icon'} />
              </div>
              <h5>Animation</h5>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida blandit lacus a laoreet.</p>
              <a
                href={'#'}
                onClick={(e) => {
                  return e.preventDefault();
                }}
              >
                Learn More
              </a>
            </li>
            <div className={s.clear} />
          </ul>
        </div>
      </section>

      <section className={s.textSection}>
        <div className={s.wrapper}>
          <div className={`${s.image} ${s.alignLeft}`}>
            <img src={lightBulb} alt={'light bulb'} className={s.alignLeft} />
          </div>
          <div className={`${s.text} ${s.alignLeft}`}>
            <h3>We Love Bright Ideas</h3>
            <p className={s.subtitle}>See Your Ideas Brought to Life</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida blandit lacus a laoreet. Nullam
              sollicitudin urna metus, at malesuada orci fringilla in. Curabitur eleifend risus vitae ligula semper
              scelerisque. Nulla sed nisl nulla.
            </p>
            <p>Fusce interdum suscipit ipsum, quis mattis metus posuere sit amet. Mauris rutrum imperdiet tortor.</p>
          </div>
          <div className={s.clear} />
        </div>
      </section>

      <section className={s.featuresSection}>
        <div className={s.wrapper}>
          <ul className={s.featureSquares}>
            <li>
              <div className={s.image}>
                <img src={iconEye} alt={'feature icon'} />
              </div>
              <div className={s.text}>
                <h5>Attention to Detail</h5>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ut dignissim sapien. Mauris congue
                  faucibus enim, vel molestie lectus.
                </p>
              </div>
            </li>
            <li>
              <div className={s.image}>
                <img src={iconClock} alt={'feature icon'} />
              </div>
              <div className={s.text}>
                <h5>Save Time</h5>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ut dignissim sapien. Mauris congue
                  faucibus enim, vel molestie lectus.
                </p>
              </div>
            </li>
            <li>
              <div className={s.image}>
                <img src={iconDashboard} alt={'feature icon'} />
              </div>
              <div className={s.text}>
                <h5>Complete Control</h5>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ut dignissim sapien. Mauris congue
                  faucibus enim, vel molestie lectus.
                </p>
              </div>
            </li>
            <li>
              <div className={s.image}>
                <img src={iconHeadset} alt={'feature icon'} />
              </div>
              <div className={s.text}>
                <h5>24/7 Support</h5>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ut dignissim sapien. Mauris congue
                  faucibus enim, vel molestie lectus.
                </p>
              </div>
            </li>
            <div className={s.clear} />
          </ul>
        </div>
      </section>

      <section className={s.textSection}>
        <div className={s.wrapper}>
          <div className={`${s.image} ${s.alignRight}`}>
            <img src={chatBubbles} alt={'light bulb'} className={s.alignLeft} style={{ marginTop: '60px' }} />
          </div>
          <div className={`${s.text} ${s.alignRight}`}>
            <h3>Let&apos;s Talk</h3>
            <p className={s.subtitle}>We&apos;re here to listen to your needs</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis gravida blandit lacus a laoreet. Nullam
              sollicitudin urna metus, at malesuada orci fringilla in.
            </p>
            <ul className={s.listCheckmarks}>
              <li>Curabitur eleifend risus vitae ligula semper scelerisque.</li>
              <li>Fusce interdum suscipit ipsum.</li>
              <li>Quis mattis metus posuere sit amet.</li>
              <li>Mauris rutrum imperdiet tortor.</li>
            </ul>
          </div>
          <div className={s.clear} />
        </div>
      </section>

      <section className={s.teamSection} id={'about'}>
        <div className={s.wrapper}>
          <h3>The Team</h3>
          <p className={s.subtitle}>Get to know us</p>
          <ul className={s.teamList}>
            <li>
              <div className={s.imageContainer}>
                <img src={team1} alt={'team member'} />
              </div>
              <h5>John Garret</h5>
              <p>Lead Designer</p>
              <ul className={s.socialLinks}>
                <li>
                  <a
                    href={'#'}
                    className={s.facebook}
                    onClick={(e) => {
                      return e.preventDefault();
                    }}
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href={'#'}
                    className={s.twitter}
                    onClick={(e) => {
                      return e.preventDefault();
                    }}
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href={'#'}
                    className={s.google}
                    onClick={(e) => {
                      return e.preventDefault();
                    }}
                  >
                    Google+
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <div className={s.imageContainer}>
                <img src={team2} alt={'team member'} />
              </div>
              <h5>Alice Mills</h5>
              <p>Lead Designer</p>
              <ul className={s.socialLinks}>
                <li>
                  <a
                    href={'#'}
                    className={s.facebook}
                    onClick={(e) => {
                      return e.preventDefault();
                    }}
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href={'#'}
                    className={s.twitter}
                    onClick={(e) => {
                      return e.preventDefault();
                    }}
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href={'#'}
                    className={s.google}
                    onClick={(e) => {
                      return e.preventDefault();
                    }}
                  >
                    Google+
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <div className={s.imageContainer}>
                <img src={team3} alt={'team member'} />
              </div>
              <h5>Scott Harris</h5>
              <p>Lead Designer</p>
              <ul className={s.socialLinks}>
                <li>
                  <a
                    href={'#'}
                    className={s.facebook}
                    onClick={(e) => {
                      return e.preventDefault();
                    }}
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href={'#'}
                    className={s.twitter}
                    onClick={(e) => {
                      return e.preventDefault();
                    }}
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href={'#'}
                    className={s.google}
                    onClick={(e) => {
                      return e.preventDefault();
                    }}
                  >
                    Google+
                  </a>
                </li>
              </ul>
            </li>
            <div className={s.clear} />
          </ul>
        </div>
      </section>

      <section className={s.portfolioSection} id={'portfolio'}>
        <h3>Portfolio</h3>
        <p className={s.subtitle}>Our featured works</p>

        <ul className={s.portfolioList}>
          <li className={s.item}>
            <a
              href={project1}
              className={s.photoOverlay}
              onClick={(e) => {
                e.preventDefault();
                handleImageClick(project1);
              }}
            >
              <img src={project1Thumb} alt={''} />
            </a>
          </li>
          <li className={s.item}>
            <a
              href={project2}
              className={s.photoOverlay}
              onClick={(e) => {
                e.preventDefault();
                handleImageClick(project2);
              }}
            >
              <img src={project2Thumb} alt={''} />
            </a>
          </li>
          <li className={s.item}>
            <a
              href={project3}
              className={s.photoOverlay}
              onClick={(e) => {
                e.preventDefault();
                handleImageClick(project3);
              }}
            >
              <img src={project3Thumb} alt={''} />
            </a>
          </li>
          <li className={s.item}>
            <a
              href={project4}
              className={s.photoOverlay}
              onClick={(e) => {
                e.preventDefault();
                handleImageClick(project4);
              }}
            >
              <img src={project4Thumb} alt={''} />
            </a>
          </li>
          <li className={s.item}>
            <a
              href={project5}
              className={s.photoOverlay}
              onClick={(e) => {
                e.preventDefault();
                handleImageClick(project5);
              }}
            >
              <img src={project5Thumb} alt={''} />
            </a>
          </li>
          <li className={s.item}>
            <a
              href={project6}
              className={s.photoOverlay}
              onClick={(e) => {
                e.preventDefault();
                handleImageClick(project6);
              }}
            >
              <img src={project6Thumb} alt={''} />
            </a>
          </li>
          <div className={s.clear} />
        </ul>
      </section>

      <section className={s.emailListSection}>
        <h3>Subscribe</h3>
        <p className={s.subtitle}>Stay up to date with us</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input type={'text'} placeholder={'Your Name'} />
          <input type={'email'} placeholder={'Email Address'} />
          <button type={'submit'} title={'Submit'}>
            Submit
          </button>
        </form>
      </section>

      <section className={s.pricingSection}>
        <div className={s.wrapper}>
          <h3>Services</h3>
          <p className={s.subtitle}>We do lots of cool things</p>
          <ul className={s.pricingTable}>
            <li>
              <div className={s.priceContainer}>
                <span className={s.currencySymbol} style={{ left: '40px' }}>
                  $
                </span>
                <span className={s.price}>9</span>
                <span className={s.term}>/mo</span>
              </div>
              <h5>Basic</h5>
              <ul className={s.features}>
                <li>500GB Storage</li>
                <li>Unlimited Bandwidth</li>
                <li>10 Clients</li>
                <li>50 Projects</li>
                <div className={s.clear} />
              </ul>
              <a
                href={'#'}
                className={s.button2}
                onClick={(e) => {
                  return e.preventDefault();
                }}
              >
                Begin
              </a>
            </li>
            <li>
              <div className={s.priceContainer}>
                <span className={s.currencySymbol} style={{ left: '20px' }}>
                  $
                </span>
                <span className={s.price}>12</span>
                <span className={s.term}>/mo</span>
              </div>
              <h5>Premium</h5>
              <ul className={s.features}>
                <li>1TB Storage</li>
                <li>Unlimited Bandwidth</li>
                <li>50 Clients</li>
                <li>250 Projects</li>
                <div className={s.clear} />
              </ul>
              <a
                href={'#'}
                className={s.button1}
                onClick={(e) => {
                  return e.preventDefault();
                }}
              >
                Begin
              </a>
            </li>
            <li>
              <div className={s.priceContainer}>
                <span className={s.currencySymbol} style={{ left: '20px' }}>
                  $
                </span>
                <span className={s.price}>18</span>
                <span className={s.term}>/mo</span>
              </div>
              <h5>Elite</h5>
              <ul className={s.features}>
                <li>5TB Storage</li>
                <li>Unlimited Bandwidth</li>
                <li>Unlimited Clients</li>
                <li>Unlimited Projects</li>
                <div className={s.clear} />
              </ul>
              <a
                href={'#'}
                className={s.button2}
                onClick={(e) => {
                  return e.preventDefault();
                }}
              >
                Begin
              </a>
            </li>
            <div className={s.clear} />
          </ul>
        </div>
      </section>

      <section className={s.textSection}>
        <div className={`${s.text} ${s.alignCenter}`}>
          <h3>Heard Enough?</h3>
          <p className={s.subtitle}>Let&apos;s get started</p>
          <p>
            <a
              href={'#'}
              className={s.button1}
              onClick={(e) => {
                return e.preventDefault();
              }}
            >
              Begin
            </a>
          </p>
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.wrapper}>
          <a
            className={`${s.logo} ${s.logoLink}`}
            href={'#'}
            onClick={(e) => {
              return e.preventDefault();
            }}
          >
            Chase
          </a>
          <div className={s.footerLeft}>
            <p className={s.copyright}>Copyright 2016 &copy; Chase</p>
            <p className={s.footerLinks}>
              <a
                href={'#'}
                onClick={(e) => {
                  return e.preventDefault();
                }}
              >
                Contact Us
              </a>{' '}
              I{' '}
              <a
                href={'#'}
                onClick={(e) => {
                  return e.preventDefault();
                }}
              >
                Terms &amp; Conditions
              </a>{' '}
              I
              <a
                href={'#'}
                onClick={(e) => {
                  return e.preventDefault();
                }}
              >
                Privacy
              </a>
            </p>
          </div>
          <div className={s.footerRight}>
            <a
              href={'#'}
              className={`${s.social} ${s.facebook}`}
              onClick={(e) => {
                return e.preventDefault();
              }}
            >
              Facebook
            </a>
            <a
              href={'#'}
              className={`${s.social} ${s.twitter}`}
              onClick={(e) => {
                return e.preventDefault();
              }}
            >
              Twitter
            </a>
            <a
              href={'#'}
              className={`${s.social} ${s.google}`}
              onClick={(e) => {
                return e.preventDefault();
              }}
            >
              Google+
            </a>
          </div>
          <div className={s.clear} />
        </div>
      </footer>
    </div>
  );
};
