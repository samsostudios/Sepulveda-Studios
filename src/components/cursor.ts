// eslint-disable-next-line simple-import-sort/imports
import { isTouchDevice } from '$utils/deviceInfo';
import { gsap } from 'gsap';

class Cursor {
  private cursorEle: HTMLElement;
  private pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  private mouseStore = { x: this.pos.x, y: this.pos.y };
  private speed = 0.2;

  constructor() {
    this.cursorEle = document.querySelector('.cursor_element') as HTMLElement;

    const touchDevice = isTouchDevice();
    console.log('Cursor');
    console.log('touch', touchDevice);

    if (touchDevice) {
      gsap.set(this.cursorEle, { display: 'none' });
    }

    if (!touchDevice) {
      this.init();
    }
  }

  private init() {
    gsap.set(this.cursorEle, { xPercent: -50, yPercent: -50 });
    window.addEventListener('mousemove', (e) => {
      this.mouseStore.x = e.clientX;
      this.mouseStore.y = e.clientY;
    });

    gsap.ticker.add(this.cursorTrack.bind(this));
  }
  private cursorTrack() {
    this.pos.x += (this.mouseStore.x - this.pos.x) * this.speed;
    this.pos.y += (this.mouseStore.y - this.pos.y) * this.speed;

    gsap.set(this.cursorEle, { x: this.pos.x, y: this.pos.y });
  }
}

export const cursor = () => {
  new Cursor();
};

export default cursor;
