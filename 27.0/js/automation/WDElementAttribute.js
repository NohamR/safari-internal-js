//# sourceURL=__InjectedScript_WDElementAttribute.js
function(element){"use strict";var utils={};utils.enclosingNodeOrSelfMatchingPredicate=function(targetNode,predicate){for(let node=targetNode;node&&node!==targetNode.getRootNode();node=node.parentNode)
if(predicate(node))
return node;return null;}
utils.nodeIsElement=function(node){return!!node&&node.nodeType===Node.ELEMENT_NODE;}
utils.parentElementForElement=function(element){if(!element)
return null;return utils.enclosingNodeOrSelfMatchingPredicate(element.parentNode,utils.nodeIsElement);}
utils.cascadedStylePropertyForElement=function(element,property){if(!element||!property)
return null;let computedStyle=window.getComputedStyle(element);let computedStyleProperty=computedStyle.getPropertyValue(property);if(computedStyleProperty&&computedStyleProperty!=="inherit")
return computedStyleProperty;
 
let parentElement=utils.parentElementForElement(element);return utils.cascadedStylePropertyForElement(parentElement,property);}
utils.isShown=function(element){function enclosingElementOrSelfMatchingPredicate(targetElement,predicate){for(let element=targetElement;element&&element!==targetElement.getRootNode();element=utils.parentElementForElement(element))
if(predicate(element))
return element;return null;}
function elementSubtreeHasNonZeroDimensions(element){let boundingBox=element.getBoundingClientRect();if(boundingBox.width>0&&boundingBox.height>0)
return true;if(element.tagName.toUpperCase()==="PATH"&&boundingBox.width+boundingBox.height>0){let strokeWidth=utils.cascadedStylePropertyForElement(element,"stroke-width");return!!strokeWidth&&(parseInt(strokeWidth,10)>0);}
let cascadedOverflow=utils.cascadedStylePropertyForElement(element,"overflow");if(cascadedOverflow==="hidden")
return false;
return Array.from(element.childNodes).some((childNode)=>{if(childNode.nodeType===Node.TEXT_NODE)
return true;if(utils.nodeIsElement(childNode))
return elementSubtreeHasNonZeroDimensions(childNode);return false;});}
function elementOverflowsContainer(element){let cascadedOverflow=utils.cascadedStylePropertyForElement(element,"overflow");if(cascadedOverflow!=="hidden")
return false;return true;}
function isElementSubtreeHiddenByOverflow(element){if(!element)
return false;if(!elementOverflowsContainer(element))
return false;if(!element.childNodes.length)
return false;return Array.from(element.childNodes).every((childNode)=>{if(!utils.nodeIsElement(childNode))
return true;if(!elementSubtreeHasNonZeroDimensions(childNode))
return true;return isElementSubtreeHiddenByOverflow(childNode);});}
if(!(element instanceof Element))
throw new Error("Cannot check the displayedness of a non-Element argument.");switch(element.tagName.toUpperCase()){case"BODY":return true;case"SCRIPT":case"NOSCRIPT":return false;case"OPTGROUP":case"OPTION":let enclosingSelectElement=utils.enclosingNodeOrSelfMatchingPredicate(element,(e)=>e.tagName.toUpperCase()==="SELECT");return utils.isShown(enclosingSelectElement);case"INPUT":if(element.type==="hidden")
return false;break;case"MAP":default:break;}
if(utils.cascadedStylePropertyForElement(element,"visibility")!=="visible")
return false;let hasAncestorWithZeroOpacity=!!enclosingElementOrSelfMatchingPredicate(element,(e)=>{return Number(utils.cascadedStylePropertyForElement(e,"opacity"))===0;});let hasAncestorWithDisplayNone=!!enclosingElementOrSelfMatchingPredicate(element,(e)=>{return utils.cascadedStylePropertyForElement(e,"display")==="none";});if(hasAncestorWithZeroOpacity||hasAncestorWithDisplayNone)
return false;if(!elementSubtreeHasNonZeroDimensions(element))
return false;if(isElementSubtreeHiddenByOverflow(element))
return false;return true;}
return utils.isShown(element);}
