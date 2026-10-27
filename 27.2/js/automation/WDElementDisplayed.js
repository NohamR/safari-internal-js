//# sourceURL=__InjectedScript_WDElementDisplayed.js
function fetchTagNameAndAttributesOfElement(element) {
  "use strict";
  let tagName = element.tagName.toUpperCase();
  let attributes = {};
  for (let i = 0; i < element.attributes.length; ++i) {
    let name = element.attributes[i].name.toLowerCase();
    let value = element.attributes[i].value;
    if (!value.length) value = null;
    attributes[name] = value;
  }
  return { tagName, attributes };
}
