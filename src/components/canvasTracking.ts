import { gsap } from 'gsap';

export const canvasTrack = () => {
  class CanvasTrack {
    private stage: HTMLElement;
    private maxOffsetX: number;
    private maxOffsetY: number;
    private paddingOffsetX: number;
    private paddingOffsetY: number;

    private xTo: (value: number) => void;
    private yTo: (value: number) => void;

    constructor() {
      this.stage = document.querySelector('.canvas_stage') as HTMLElement;
      gsap.set(this.stage, { width: '150vw', height: '150vh' });
      this.maxOffsetX = 0;
      this.maxOffsetY = 0;
      this.paddingOffsetX = 0;
      this.paddingOffsetY = 0;

      this.calculateMovement();

      this.xTo = gsap.quickTo(this.stage, 'x', { duration: 2, ease: 'power3.out' });
      this.yTo = gsap.quickTo(this.stage, 'y', { duration: 2, ease: 'power3.out' });

      this.startTracking();
      this.resizeListener();
    }

    private calculateMovement() {
      const bounds = this.stage.getBoundingClientRect();

      this.paddingOffsetX = window.innerWidth * 0.02;
      this.paddingOffsetY = window.innerHeight * 0.02;

      this.maxOffsetX = (bounds.width - window.innerWidth) / 2 + this.paddingOffsetX;
      this.maxOffsetY = (bounds.height - window.innerHeight) / 2 + this.paddingOffsetY;
    }

    private startTracking() {
      document.addEventListener('mousemove', (e) => {
        const percentX = e.clientX / window.innerWidth;
        const percentY = e.clientY / window.innerHeight;

        const targetX = (percentX - 0.5) * 2 * this.maxOffsetX * -1;
        const targetY = (percentY - 0.5) * 2 * this.maxOffsetY * -1;

        this.xTo(targetX);
        this.yTo(targetY);

        // gsap.to(this.stage, {
        //   x: targetX,
        //   y: targetY,
        //   ease: 'power3.out',
        //   duration: 0.6,
        // });
      });
    }

    private resizeListener() {
      window.addEventListener('resize', () => this.calculateMovement());
    }
  }
  new CanvasTrack();
};
export default canvasTrack;
