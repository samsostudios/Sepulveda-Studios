/* eslint-disable simple-import-sort/imports */
import { breakpoints } from '$utils/deviceInfo';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { heroReveal, heroSet } from 'src/animation/heroReveal';

gsap.registerPlugin(SplitText);

class Preloader {
  private component: HTMLElement;
  private baseText: HTMLHeadingElement;
  private textMask: HTMLElement;
  private digits: Element[];
  private count: number;
  private max: number;
  private tl: GSAPTimeline;
  private letterHeight: number;
  private isGsapDone: boolean;
  private isTickerDone: boolean;
  private letterMovement: number;

  constructor() {
    this.component = document.querySelector('.preload_component') as HTMLElement;
    this.baseText = this.component.querySelector('#preloaderSplit') as HTMLHeadingElement;
    this.textMask = this.component.querySelector('.preload_text-mask') as HTMLElement;

    this.digits = [...document.querySelectorAll('.preload_digit')];
    this.count = 0;
    this.max = 100;
    this.letterHeight = parseFloat(window.getComputedStyle(this.digits[0]).height) / 16;

    this.isGsapDone = false;
    this.isTickerDone = false;

    const bp = breakpoints();
    const deviceSize = bp[0];

    this.letterMovement = 64;
    if (deviceSize === 'mobile-lanscape' || deviceSize === 'mobile-portrait') {
      this.letterMovement = 32;
    }

    this.tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.isGsapDone = true;
        this.checkDone();
      },
    });

    document.fonts.ready.then(() => {
      console.log('fonts reaady');
      this.startLoader();
      this.ticker();
    });
  }

  private startLoader() {
    const splitTarget = this.baseText;
    splitTarget.offsetHeight;
    const split = SplitText.create(splitTarget, { type: 'words, chars' });

    this.tl.set(this.baseText, { opacity: 1 });
    this.tl.from(split.chars, {
      opacity: 0,
      y: this.letterMovement,
      stagger: { amount: 0.5, from: 'start' },
      ease: 'sine.inOut',
    });
    this.tl.to(this.textMask, { duration: 2, width: '100%', ease: 'expo.inOut' });

    this.tl.play();
  }

  private ticker() {
    const totalSteps = this.max + 1;
    const gDur = this.tl.duration();
    const gTick = (gDur * 1000) / totalSteps;

    const interval = setInterval(() => {
      this.count++;
      if (this.count > this.max) {
        clearInterval(interval);
        this.isTickerDone = true;
        this.checkDone();
        return;
      }

      const padded = String(this.count).padStart(3, '0');
      this.updateDigits(padded);
    }, gTick);
  }

  private updateDigits(value: string) {
    this.digits.forEach((digitEl, index) => {
      const inner = digitEl.querySelector('.preload_digit-inner');
      const targetDigit = Number(value[index]);

      gsap.to(inner, {
        y: -targetDigit * this.letterHeight + 'rem',
        duration: 0.2,
        ease: 'power2.out',
      });
    });
  }

  private checkDone() {
    if (this.isTickerDone && this.isGsapDone) {
      heroSet();
      console.log('✅ Prealoader');
      const tl = gsap.timeline();
      tl.to(this.component, { delay: 0.5, duration: 1, opacity: 0, ease: 'sine.out' });
      tl.to(this.component, {
        duration: 0,
        display: 'none',
      });

      tl.call(heroReveal);
    }
  }
}

export const preloader = () => {
  new Preloader();
};
export default preloader;
