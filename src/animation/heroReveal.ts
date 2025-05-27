// eslint-disable-next-line simple-import-sort/imports
import { initCanvasTrack } from '$components/canvasTracking';
import { gsap, random } from 'gsap';

export const heroReveal = () => {
  const canvasImages = [...document.querySelectorAll('.canvas_img')];
  const heroContent = document.querySelector('.hero_content');

  //   const canvas = initCanvasTrack();

  console.log('reveal', performance.now());
  const tl = gsap.timeline();
  tl.to(canvasImages, {
    duration: 1.5,
    opacity: 1,
    y: 0,
    // x: 'random(24, 24, 1)',
    stagger: { from: 'random' },
    ease: 'sine.out',
  });
  tl.to(heroContent, { duration: 1, opacity: 1, y: '0', ease: 'power3.inOut' }, '<');
  //   tl.to(canvasImages, { duration: 1, opacity: 1 }, '<');
};

export const heroSet = () => {
  const canvasImages = [...document.querySelectorAll('.canvas_img')];
  const heroContent = document.querySelector('.hero_content');

  gsap.set(canvasImages, { opacity: 0, y: 'random(-48, 48, 1)' });
  gsap.set(heroContent, { opacity: 0, y: '1rem' });
};
