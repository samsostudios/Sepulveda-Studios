// eslint-disable-next-line simple-import-sort/imports
import { breakpoints, isTouchDevice } from '$utils/deviceInfo';
import { getCanvasTrack } from './canvasTracking';
import { gsap } from 'gsap';

export const modal = () => {
  class Modal {
    private modalElement: HTMLElement;
    private modalBlur: HTMLElement;
    private openModal: HTMLAnchorElement;
    private closeModal: HTMLAnchorElement;
    private layoutModal: HTMLElement;
    private deviceSize: number;
    private deviceTouch: boolean;

    constructor() {
      this.modalElement = document.querySelector('.modal_component') as HTMLElement;
      this.modalBlur = this.modalElement.querySelector('.modal_blur') as HTMLElement;
      this.layoutModal = this.modalElement.querySelector('.modal_layout') as HTMLElement;

      this.openModal = document.querySelector('#modalOpen') as HTMLAnchorElement;
      this.closeModal = document.querySelector('#modalClose') as HTMLAnchorElement;

      const bp = breakpoints();
      const dt = isTouchDevice();
      console.log('bp!', bp, dt);

      this.listener();
    }

    private listener() {
      this.openModal.addEventListener('click', () => {
        getCanvasTrack()?.disable();
        this.modalIn();
      });

      this.closeModal.addEventListener('click', () => {
        getCanvasTrack()?.enable();
        this.modalOut();
      });
    }

    private modalIn() {
      const tl = gsap.timeline();

      tl.set(this.layoutModal.children, { opacity: '0' });
      tl.set(this.modalElement, { gridTemplateColumns: '1fr 0fr' });
      tl.set(this.modalBlur, { opacity: 0 });

      tl.to(this.modalElement, { display: 'grid' });

      tl.to(this.modalBlur, { duration: 1, opacity: 1, ease: 'power2.out' }, '<');
      tl.to(
        this.modalElement,
        {
          duration: 1,
          gridTemplateColumns: '1fr 1fr',
          ease: 'power4.out',
        },
        '<0.8'
      );
      tl.fromTo(
        this.layoutModal.children,
        { opacity: 0, y: 24 },
        {
          duration: 1,
          opacity: 1,
          y: 0,
          stagger: 0.08,
          ease: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
        },
        '<0.5'
      );
    }

    private modalOut() {
      const tl = gsap.timeline();

      tl.to(this.layoutModal.children, {
        duartion: 1,
        opacity: 0,
        y: 24,
        ease: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
      });
      tl.to(
        this.modalElement,
        { duration: 1, gridTemplateColumns: '1fr 0fr', ease: 'power4.out' },
        '<0.6'
      );
      tl.to(this.modalBlur, { duration: 1, opacity: 0, ease: 'power2.out' }, '<');

      tl.to(this.modalElement, { display: 'none' });
    }
  }

  new Modal();
};
export default modal;
