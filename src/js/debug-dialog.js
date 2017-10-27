import {MDCDialog} from "@material/dialog";
import {MDCSnackbar} from "@material/snackbar";
import WordCatch from "./utility/word-catch";

const dialogEL = document.querySelector("#debug-mdc-dialog");
let adminDialog = null;
if (dialogEL) {
  adminDialog = new MDCDialog(dialogEL);
}
const debugDialog = {
  show: () => {
    if (adminDialog) {
      adminDialog.show();
    } else {
      console.log("Admin debug window not included in page");
    }
  }
};

const snackbarEL = document.querySelector("#debug-mdc-snackbar");
let adminSnackbar = null;
if (snackbarEL) adminSnackbar = new MDCSnackbar(snackbarEL);
const snackbarObj = {
  message: "Show Debug Dialog?",
  actionText: "Show",
  actionHandler: () => {
    if (adminDialog) {
      adminDialog.show();
    } else {
      console.warn("Admin debug window not included in page");
    }
  }
};
const debugSnackbar = {
  show: () => {
    if (adminDialog && adminSnackbar) {
      adminSnackbar.show(snackbarObj);
      const thisSpell = new WordCatch("debug", (element) => {
        adminDialog.show();
        console.log('typed debug');
      });
      return true;
    } else {
      console.warn("Admin debug not setup on this page");
      return false;
    }
  }
};

const showDialog = debugDialog.show;
const showSnackbar = debugSnackbar.show;

export default {showDialog, showSnackbar};
