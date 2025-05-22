import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

export const preloader = () => {
  class Preloader {
    private component: HTMLElement;
    private baseText: HTMLHeadingElement;
    private textMask: HTMLElement;
    private digits: Element[];
    private count: number;
    private max: number;

    constructor() {
      this.component = document.querySelector('.preload_component') as HTMLElement;
      this.baseText = this.component.querySelector('#preloaderSplit') as HTMLHeadingElement;
      this.textMask = this.component.querySelector('.preload_text-mask') as HTMLElement;

      this.digits = [...document.querySelectorAll('.preload_digit')];
      this.count = 0;
      this.max = 100;

      console.log('preloader');

      this.startLoader();
      this.ticker();
    }

    private startLoader() {
      const tl = gsap.timeline();

      const split = SplitText.create(this.baseText);

      tl.from(split.chars, {
        opacity: 0,
        y: 64,
        stagger: { amount: 0.5, from: 'start' },
        ease: 'power2.inOut',
      });
      tl.to(this.textMask, { duration: 2, width: '100%', ease: 'expo.inOut' });
    }

    private ticker() {
      console.log('ticker');
      const interval = setInterval(() => {
        this.count++;
        if (this.count > this.max) {
          clearInterval(interval);
          return;
        }

        const padded = String(this.count).padStart(3, '0');
        this.updateDigits(padded);
      }, 40);
    }

    private updateDigits(value: string) {
      console.log('update', this.digits);
      this.digits.forEach((digitEl, index) => {
        const inner = digitEl.querySelector('.preload_digit-inner');
        const targetDigit = Number(value[index]);

        console.log('!!', inner);

        gsap.to(inner, {
          y: -targetDigit * 6 + 'rem',
          duration: 0.2,
          ease: 'power2.out',
        });
      });
    }
  }
  new Preloader();
};
export default preloader;
