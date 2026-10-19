import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis;

export function initSmoothScroll() {
  if (lenis) return lenis;

  lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 0.85,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
}