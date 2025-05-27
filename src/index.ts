import { initCanvasTrack } from '$components/canvasTracking';
import loadComponent from '$utils/loadComponent';

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('/// mainJS ///');

  document.addEventListener('click', (e) => {
    console.log('clicked', e.target);
  });

  const canvas = initCanvasTrack();

  console.log('HERE');

  // loadComponent('.hero_canvas', () => import('$components/canvasTracking'));
  loadComponent('.modal_component', () => import('$components/modal'));
  loadComponent('.preload_component', () => import('$components/preloader'));
  loadComponent('.cursor_component', () => import('$components/cursor'));
});
