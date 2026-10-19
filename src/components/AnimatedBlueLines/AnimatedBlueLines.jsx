import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './AnimatedBlueLines.css';

gsap.registerPlugin(ScrollTrigger);

const paths = [
  'M-300 180 C 200 20, 500 500, 1000 240 S 1600 80, 2200 320',
  'M-300 400 C 200 220, 550 650, 1050 420 S 1650 240, 2200 520',
  'M-300 620 C 200 400, 600 850, 1100 600 S 1650 430, 2200 700',
  'M-300 850 C 200 620, 600 1050, 1100 800 S 1700 600, 2200 900',
  'M-300 1080 C 200 850, 650 1250, 1150 1000 S 1700 820, 2200 1120',
  'M-300 1320 C 200 1050, 650 1450, 1150 1200 S 1750 1050, 2200 1350',
  'M-300 1550 C 200 1300, 650 1650, 1200 1400 S 1750 1250, 2200 1580',
];

export default function AnimatedBlueLines() {
  const rootRef = useRef(null);
  const svgRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray('.blue-line');

      /*
       * Initial state
       */
      lines.forEach((line) => {
        const length = line.getTotalLength();

        gsap.set(line, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      /*
       * Draw lines based on scroll
       */
      lines.forEach((line, index) => {
        const length = line.getTotalLength();

        gsap.fromTo(
          line,
          {
            strokeDashoffset: length,
          },
          {
            strokeDashoffset: 0,

            ease: 'none',

            scrollTrigger: {
              trigger: document.documentElement,

              start: `${index * 5}% top`,
              end: `${60 + index * 5}% top`,

              scrub: 1.5,
            },
          }
        );
      });

      /*
       * Horizontal movement
       */
      lines.forEach((line, index) => {
        gsap.to(line, {
          x: index % 2 === 0 ? 100 : -100,

          ease: 'none',

          scrollTrigger: {
            trigger: document.documentElement,

            start: 'top top',
            end: 'bottom bottom',

            scrub: 2,
          },
        });
      });

      /*
       * Main SVG parallax
       */
      gsap.to(svgRef.current, {
        y: -220,

        ease: 'none',

        scrollTrigger: {
          trigger: document.documentElement,

          start: 'top top',
          end: 'bottom bottom',

          scrub: 2,
        },
      });

    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="animated-blue-lines"
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        className="blue-lines-svg"
        viewBox="0 0 1900 1700"
        preserveAspectRatio="none"
      >
        {paths.map((d, index) => (
          <path
            key={index}
            d={d}
            className={`blue-line blue-line-${index + 1}`}
          />
        ))}
      </svg>
    </div>
  );
}