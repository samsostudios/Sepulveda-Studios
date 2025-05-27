// eslint-disable-next-line simple-import-sort/imports
import { breakpoints } from '$utils/deviceInfo';
import { gsap } from 'gsap';

class CanvasTrack {
  private stage: HTMLElement;
  private maxOffsetX = 0;
  private maxOffsetY = 0;
  private paddingOffsetX = 0;
  private paddingOffsetY = 0;
  // private deviceSize: number;
  // private deviceTouch: boolean;
  private isEnabled = true;
  private parallaxElements: HTMLElement[];
  private xTo!: (v: number) => void;
  private yTo!: (v: number) => void;
  private parallaxConfigs: {
    el: HTMLElement;
    container: HTMLElement;
    xTo: gsap.QuickToFunc;
    yTo: gsap.QuickToFunc;
    maxX: number;
    maxY: number;
  }[] = [];

  constructor() {
    this.stage = document.querySelector('.canvas_stage') as HTMLElement;

    this.parallaxElements = [...document.querySelectorAll('.u-img-fill.is-parallax')].map(
      (item) => item as HTMLElement
    );

    const bp = breakpoints();
    console.log('bp!', bp);

    this.setupStage();
    this.calculateMovement();
    this.setupTrackers();
    this.setupParallax();
    this.startTracking();
    this.resizeListener();
  }

  private setupStage() {
    gsap.set(this.stage, {
      // width: '130vw',
      height: '130vh',
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
    });
  }

  private calculateMovement() {
    const bounds = this.stage.getBoundingClientRect();
    this.paddingOffsetX = window.innerWidth * 0.05;
    this.paddingOffsetY = window.innerHeight * 0.1;
    this.maxOffsetX = (bounds.width - window.innerWidth) / 2 + this.paddingOffsetX;
    this.maxOffsetY = (bounds.height - window.innerHeight) / 2 + this.paddingOffsetY;
  }

  private setupTrackers() {
    this.xTo = gsap.quickTo(this.stage, 'x', { duration: 1, ease: 'power3.out' });
    this.yTo = gsap.quickTo(this.stage, 'y', { duration: 1, ease: 'power3.out' });
  }

  private setupParallax() {
    this.parallaxElements.forEach((el) => {
      const container = el.closest('.canvas_img') as HTMLElement;
      if (!container) return;

      const containerBounds = container.getBoundingClientRect();
      const imageBounds = el.getBoundingClientRect();

      const maxX = (imageBounds.width - containerBounds.width) / 2;
      const maxY = (imageBounds.height - containerBounds.height) / 2;

      gsap.set(el, { top: '50%', left: '50%', xPercent: -50, yPercent: -50 });

      this.parallaxConfigs.push({
        el,
        container,
        maxX,
        maxY,
        xTo: gsap.quickTo(el, 'x', { duration: 1.5, ease: 'power3.out' }),
        yTo: gsap.quickTo(el, 'y', { duration: 1.5, ease: 'power3.out' }),
      });
    });
  }

  private startTracking() {
    const handleMove = (clientX: number, clientY: number) => {
      if (!this.isEnabled) return;

      const percentX = clientX / window.innerWidth;
      const percentY = clientY / window.innerHeight;

      const targetX = (percentX - 0.5) * 2 * this.maxOffsetX * -1;
      const targetY = (percentY - 0.5) * 2 * this.maxOffsetY * -1;

      this.xTo(targetX);
      this.yTo(targetY);

      const offsetX = (percentX - 0.5) * 2;
      const offsetY = (percentY - 0.5) * 2;

      this.parallaxConfigs.forEach(({ xTo, yTo, maxX, maxY }) => {
        xTo(offsetX * -maxX);
        yTo(offsetY * -maxY);
      });
    };
    document.addEventListener('mousemove', (e) => {
      handleMove(e.clientX, e.clientY);
    });

    document.addEventListener(
      'touchmove',
      (e) => {
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          handleMove(touch.clientX, touch.clientY);
        }
      },
      { passive: true }
    );
  }

  private resizeListener() {
    window.addEventListener('resize', () => this.calculateMovement());
  }

  public enable() {
    this.isEnabled = true;
  }

  public disable() {
    this.isEnabled = false;
  }

  public kill() {
    this.disable();
    gsap.killTweensOf(this.stage);
    window.removeEventListener('resize', this.calculateMovement);
    // Optional: remove mouse listener if needed
  }
}

let instance: CanvasTrack | null = null;

export function initCanvasTrack() {
  if (!instance) {
    instance = new CanvasTrack();
  }
  return instance;
}

export function getCanvasTrack() {
  return instance;
}

export function destroyCanvasTrack() {
  instance?.kill();
  instance = null;
}
