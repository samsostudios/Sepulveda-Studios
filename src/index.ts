import { initCanvasTrack } from '$components/canvasTracking';
import loadComponent from '$utils/loadComponent';

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('/// mainJS ///');

  const canvas = initCanvasTrack();

  // loadComponent('.hero_canvas', () => import('$components/canvasTracking'));
  loadComponent('.modal_component', () => import('$components/modal'));
});
