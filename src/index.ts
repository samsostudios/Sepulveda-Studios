import loadComponent from '$utils/loadComponent';

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('/// mainJS ///');

  loadComponent('.hero_canvas', () => import('$components/canvasTracking'));
});
