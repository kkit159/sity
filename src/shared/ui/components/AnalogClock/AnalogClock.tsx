import { type FC, useEffect, useState } from 'react';

import s from './AnalogClock.module.scss';

export const AnalogClock: FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondAngle = seconds * 6 - 90;
  const minuteAngle = minutes * 6 + seconds * 0.1 - 90;
  const hourAngle = hours * 30 + minutes * 0.5 - 90;

  return (
    <div className={s.clock}>
      <svg className={s.clockSvg} viewBox={'-20 -20 230 230'}>
        <circle className={s.clockFace} cx={'100'} cy={'100'} r={'95'} />

        {/* Hour markers (lines) */}
        {Array.from({ length: 12 }).map((_, index) => {
          const angle = index * 30 - 90;
          const x1 = 100 + 75 * Math.cos((angle * Math.PI) / 180);
          const y1 = 100 + 75 * Math.sin((angle * Math.PI) / 180);
          const x2 = 100 + 85 * Math.cos((angle * Math.PI) / 180);
          const y2 = 100 + 85 * Math.sin((angle * Math.PI) / 180);

          return <line key={index} className={s.hourMarker} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}

        {/* Minute markers (smaller lines) */}
        {/* {Array.from({ length: 60 }).map((_, i) => {
          if (i % 5 === 0) return null; // Skip hour markers
          const angle = (i * 6) - 90;
          const x1 = 100 + 80 * Math.cos((angle * Math.PI) / 180);
          const y1 = 100 + 80 * Math.sin((angle * Math.PI) / 180);
          const x2 = 100 + 85 * Math.cos((angle * Math.PI) / 180);
          const y2 = 100 + 85 * Math.sin((angle * Math.PI) / 180);
          
          return (
            <line
              key={i}
              className={s.minuteMarker}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
            />
          );
        })} */}

        {/* Hour hand */}
        <line
          className={s.hourHand}
          x1={'100'}
          y1={'100'}
          x2={100 + 40 * Math.cos((hourAngle * Math.PI) / 180)}
          y2={100 + 40 * Math.sin((hourAngle * Math.PI) / 180)}
        />

        {/* Minute hand */}
        <line
          className={s.minuteHand}
          x1={'100'}
          y1={'100'}
          x2={100 + 60 * Math.cos((minuteAngle * Math.PI) / 180)}
          y2={100 + 60 * Math.sin((minuteAngle * Math.PI) / 180)}
        />

        {/* Second hand */}
        <line
          className={s.secondHand}
          x1={'100'}
          y1={'100'}
          x2={100 + 70 * Math.cos((secondAngle * Math.PI) / 180)}
          y2={100 + 70 * Math.sin((secondAngle * Math.PI) / 180)}
        />

        {/* Center dot */}
        <circle className={s.centerDot} cx={'100'} cy={'100'} r={'3'} />
      </svg>
    </div>
  );
};
