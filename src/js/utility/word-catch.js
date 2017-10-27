function WordCatch(sTxt, fOnType, bReticent, bDisabled) {

  if (!(this && this instanceof WordCatch)) {

    return new WordCatch(sTxt || null, fOnType || null, Boolean(bReticent), Boolean(bDisabled));

  }

  if (sTxt) {

    this.content = sTxt;

  }

  if (fOnType) {

    this.ontype = fOnType;

  }

  if (bReticent) {

    this.reticent = true;

  }

  bDisabled || this.enable();

}


/**
  @brief		`WordCatch.prototype` object
  Note: The original prototype will be preserved as prototype of the new prototype
**/
WordCatch.prototype = (function () {


  /* Private namespace */


  /**
    @brief		A `"keypress"` event listener (private, event-invoked)
    @param		oKEvt		The `"keypress"` event
    @return		Nothing
    A `"keypress"` event sent by form fields or `contentEditable` elements will be ignored, unless the
    latters possess a class that matches the string `sListenClass`.
  **/
  function spellOnKeypress(oKEvt) {

    var

        /* var */ oThis, nRank, bPrevent = false, /* const */ oEvent = oKEvt || /* IE */ window.event,
      nChr = oEvent.charCode, sNodeType = oEvent.target.nodeName.toUpperCase(),
      bEditable = oEvent.target.isContentEditable || /^(?:TEXTAREA|INPUT|SELECT|BUTTON)$/.test(sNodeType);

    /*
      `nRank` possible values:
      `0` -> `oEvent.target` doesn't possess/inherit any special class
      `1` -> `oEvent.target` possesses/inherits the `"enchanted"` class
      `2` -> `oEvent.target` possesses/inherits the `"cursed"` class
      The higher the value, the higher its priority. Direct assignment prevails over inheritance.

    */

    for (oThis = oEvent.target, nRank = 0; nRank === 0 && oThis && oThis.classList; oThis = oThis.parentNode) {

      nRank = oThis.classList.contains(sForbidClass) ? 2
        : oThis.classList.contains(sListenClass) ? 1
          : 0;


    }

    if (bEditable && !oEvent.target.classList.contains(sListenClass) || nChr === 0 || nRank === 2) {

      return /* true */;

    }

    for (var /* let */ nStartPos, nIdx = 0; nIdx < aActive.length; nIdx++) {

      oThis = aActive[nIdx];

      if (typeof oThis.content !== "string" || oThis.reticent && nRank !== 1) {

        continue;

      }

      nStartPos = isFinite(oThis.INDEX) && oThis.INDEX >= 0 ? Math.floor(oThis.INDEX) : 0;

      oThis.INDEX = nChr === oThis.content.charCodeAt(nStartPos) ?
        nStartPos + 1
        : nChr === oThis.content.charCodeAt(0) ?
          1
          :
          0;

      bPrevent = bPrevent || oThis.noticeable && oThis.INDEX > (bEditable && nStartPos === 1 ? 1 : 0);

      if (oThis.INDEX === oThis.content.length) {

        typeof oThis.ontype === "function" && oThis.ontype(oEvent.target);
        oThis.INDEX = 0;

      }

    }

    bPrevent && (
      oKEvt.preventDefault ?
        oKEvt.preventDefault()
        : /* IE */
        (oKEvt.returnValue = false)
    );

    /*
    In the case of `window.onkeypress = spellOnKeypress` instead of
    `window.addEventListener("keypress", spellOnKeypress, false)`...:
    */

    /*
    return !bPrevent;
    */

  }


  var
      /* const */ sListenClass = "enchanted", sForbidClass = "cursed", oDefault = WordCatch.prototype,
    oProto = Object.create(oDefault), aActive = [],
      /* var */ bUnlocked = true;


  /* Export to global namespace */


  /* Default values */


  /** @brief	The string that triggers the event **/
  oDefault.content = null;

  /** @brief	The function that will be invoked when `spell` is completed **/
  oDefault.ontype = null;

  /** @brief	The `spell` is active only on elements possessing a class that matches the string `sListenClass` **/
  oDefault.reticent = false;

  /** @brief	If `true`, prevents `"keypress"` event's default actions whenever a typed character matches the `spell`'s `content` **/
  oDefault.noticeable = true;

  /** @brief	The number of correct characters consecutively typed in respect to the `content` property (opaque) **/
  oDefault.INDEX = 0;


  /* `WordCatch` object methods */


  /**
    @brief		Gets the listening status
    @return		The value of the private variable `bUnlocked`
    Private variables used: `bUnlocked`
  **/
  WordCatch.getStatus = function () {

    return bUnlocked;

  };


  /**
    @brief		Adds or removes the `spellOnKeypress` event handler to the `window` object
    @param		bListen		The boolean expressing whether the event handler must be added
            (`true`) or removed (`false`)
    @return		Nothing
    Private variables used: `bUnlocked`
  **/
  WordCatch.setStatus = function (bListen) {

    if (arguments.length === 0 || Boolean(bListen) === bUnlocked) {

      return false;

    }

    window[bListen ? "addEventListener" : "removeEventListener"]("keypress", spellOnKeypress, false);
    bUnlocked = !bUnlocked;

    return true;


  };


  /* Alternatively... */

  /*
  Object.defineProperty(WordCatch, "listening", {
    get: WordCatch.getStatus,
    set: WordCatch.setStatus,
    enumerable: true,
    configurable: false
  });
  delete WordCatch.getStatus;
  delete WordCatch.setStatus;
  */


  /**
    @brief		Checks whether a string matches an active key; if it does, the typing event will be
        triggered
    @param		sTxt		The string to check
    @param		oElement	The element to be passed to the function referenced by `spell.ontype`
            (optional)
    @return		Nothing
    If the argument @p oElement is not expressed the `window` object will be passed instead.
    Private variables used: `aActive`
  **/
  WordCatch.pronounce = function (sTxt, oElement) {

    for (var /* let */ nIdx = 0; nIdx < aActive.length; nIdx++) {

      typeof aActive[nIdx].ontype === "function" && sTxt === aActive[nIdx].content && aActive[nIdx].ontype(oElement || window);

    }

  };


  /**
    @brief		Resets the status of all `spell`s currently active
    @return		Nothing
    Private variables used: `aActive`
  **/
  WordCatch.unspellAll = function () {

    for (var /* let */ nIdx = 0; nIdx < aActive.length; aActive[nIdx++].INDEX = 0);

  };


  /**
    @brief		Disables all `spell`s currently active
    @return		Nothing
    Private variables used: `aActive`, `bUnlocked`
  **/
  WordCatch.makeSilence = function () {

    WordCatch.unspellAll();
    aActive.length = 0;
    bUnlocked && window.removeEventListener("keypress", spellOnKeypress, false);

  };


  /**
    @brief		Gets the list of all `spell`s currently active
    @return		A new array containing all `spell`s currently active
    Private variables used: `aActive`
  **/
  WordCatch.activeList = function () {

    return aActive.slice();

  };


  /* `WordCatch` instances methods */


  /**
    @brief		Enables a `spell`
    @return		`false` if the `spell` had been already enabled, `true` otherwise
    Private variables used: `aActive`, `bUnlocked`
  **/
  oProto.enable = function () {

    var /* const */ bIsNew = aActive.indexOf(this) === -1;

    bUnlocked && aActive.length === 0 && window.addEventListener("keypress", spellOnKeypress, false);
    bIsNew && aActive.push(this);

    return bIsNew;

  };


  /**
    @brief		Disables a `spell`
    @return		`false` if the `spell` had been already disabled, `true` otherwise
    Private variables used: `aActive`, `bUnlocked`
  **/
  oProto.disable = function () {

    var /* const */ nKeyIdx = aActive.indexOf(this);

    nKeyIdx > -1 && aActive.splice(nKeyIdx, 1);
    this.INDEX = 0;
    bUnlocked && aActive.length === 0 && window.removeEventListener("keypress", spellOnKeypress, false);;

    return nKeyIdx > -1;

  };


  return oProto;


})();


/**
  @brief		Resets the status of a `spell` by setting its `INDEX` property to `0`
  @return		Nothing
**/
WordCatch.prototype.unspell = function () {

  this.INDEX = 0;

};

module.exports = WordCatch;
