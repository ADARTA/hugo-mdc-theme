import styles from './../sass/theme-styles.scss';

/** IF you want ALL components, then uncoment the 'import * from mdc' line
  * must then comment out all the following imports and precede the components
  * with 'mdc.<component>.' ie md.ripple.MDCRipple
  * only recommended if you are going to use EVERY component in your app
**/
// import * as mdc from "material-components-web/dist/material-components-web";
import { MDCRipple } from '@material/ripple';
import { MDCIconToggle } from "@material/icon-toggle";
import {
  MDCPersistentDrawer,
  MDCPersistentDrawerFoundation,
  MDCTemporaryDrawer,
  MDCTemporaryDrawerFoundation
} from "@material/drawer";
import { MDCTextfield } from '@material/textfield';
import { MDCSimpleMenu } from '@material/menu';
import mdcAutoInit from "@material/auto-init";
import adminDebug from "./debug-dialog";

/* if you are using mdc-auto-init outside of material-components-web, you must manually provide a mapping between data-mdc-auto-init attribute values and the components which they map to. This can be achieved via mdcAutoInit.register.*/
mdcAutoInit.register('MDCTextfield', MDCTextfield);
mdcAutoInit.register('MDCRipple', MDCRipple);
mdcAutoInit.register('MDCIconToggle', MDCIconToggle);

mdcAutoInit();

// const mdc = {}
// mdc.autoInit = mdcAutoInit;
// mdc.ripple = ripple;
// mdc.menu = menu;
// mdc.iconToggle = iconToggles;
// mdc.drawer = drawer;

import iconToggle from "./icon-toggle";

// Log the version number
console.log(`Theme App version ${APP_VERSION}`);
if (process.env.NODE_ENV !== 'production') {
  console.log(`You are running a "${ process.env.NODE_ENV }" compile of the Theme.`)
  if (process.env.NODE_ENV === "development") {
    /* Debug */
    window.onload = () => {
      adminDebug.showSnackbar();
    };
  }
}

/* go to a link on a call */
const goLocation = (path) => {
  if (path && path !== window.location.href) {
    window.location.href = path;
  }
  return false;
};
window.goLocation = goLocation;

/* nav Menu */
const myChildEl = document.querySelector("#child-menu");
let myChildMenu = null;
if (myChildEl) {
  myChildMenu = new MDCSimpleMenu(myChildEl);
}
const myNavButton = document.querySelector('#open-nav-button');
if (myNavButton && myChildMenu){
  myNavButton.addEventListener('click', () => myChildMenu.open = !myChildMenu.open);
  myChildMenu.listen("MDCSimpleMenu:selected", ({ detail }) => {
    if (detail.item.dataset && detail.item.dataset.href) {
      window.location.href = detail.item.dataset.href;
    }
  });
}
/* side Menu */
const menuEl = document.querySelector(".menu-show");
let myMenuToggle = null;
if (menuEl) {
  myMenuToggle = new MDCIconToggle(menuEl);
}
let drawerEl = document.querySelector(".mdc-temporary-drawer");
let myDrawer = null;
if (drawerEl) {
  myDrawer = new MDCTemporaryDrawer(drawerEl);
} else {
  drawerEl = document.querySelector(".mdc-persistent-drawer");
  if (drawerEl) {
    myDrawer = new MDCPersistentDrawer(drawerEl);
  }
}
if (myDrawer && myMenuToggle) {
  myDrawer.listen("transitionend", ({ detail }) => {
    if (!myDrawer.open) {
      myMenuToggle.on = false;
    }
  });
}
const asideCloseEl = document.querySelector("#aside-close");
if (asideCloseEl) {
  MDCRipple.attachTo(asideCloseEl);
}
if (menuEl && myDrawer) {
  menuEl.addEventListener("MDCIconToggle:change", ({ detail }) => {
    console.log("myDrawer", myDrawer, myDrawer.open);

    if (detail.isOn) {
      myDrawer.open = true;
    } else {
      myDrawer.open = false;
    }
  });
  if (asideCloseEl) {
    asideCloseEl.addEventListener("click", ({ detail }) => {
      myDrawer.open = false;
    });
  }
}
if (myDrawer && myMenuToggle) {
  myDrawer.listen("transitionend", ({ detail }) => {
    if (!myDrawer.open) {
      myMenuToggle.on = false;
    }
  });
}
