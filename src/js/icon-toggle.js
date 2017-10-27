import { MDCIconToggle } from '@material/icon-toggle';

function debug(query) {
  const iconEl =  document.querySelector(query);
  iconEl.addEventListener('MDCIconToggle:change', ({detail}) => {
    console.log('toggleIsOn', detail.isOn);
  });
  return iconEl;
}
function disable(query) {
  const iconEl = document.querySelector(query);
  let me = new MDCIconToggle(iconEl);
  me.disabled = true;
}
function enable(query) {
  const iconEl = document.querySelector(query);
  let me = new MDCIconToggle(iconEl);
  me.disabled = false;
}

export default { debug, disable, enable}
