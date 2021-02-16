(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("NamingConventions", [], factory);
	else if(typeof exports === 'object')
		exports["NamingConventions"] = factory();
	else
		root["NamingConventions"] = factory();
})(window, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**************************************!*\
  !*** ./.build/naming-conventions.js ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NamingConventions": () => (/* binding */ NamingConventions),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * JavaScript naming conventions conversion
 * (c) 2020-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
const TYPE_NUMBER = 1, TYPE_LOWERCASE = 2, TYPE_UPPERCASE = 3, TYPE_SPECIAL = 4;
const conventions = {
    camelCase: {
        from(input) {
            return {
                parsedInput: input,
                regex: /[A-Z]/g
            };
        },
        to(letter) {
            return letter.toUpperCase();
        }
    },
    pascalCase: {
        from(input) {
            const parsedInput = input[0].toLowerCase() + input.substring(1);
            return {
                parsedInput,
                regex: /[A-Z]/g
            };
        },
        to(letter) {
            return letter.toUpperCase();
        },
        postProcess(result) {
            return result[0].toUpperCase() + result.substring(1);
        }
    },
    snakeCase: {
        from(input) {
            return {
                parsedInput: input,
                regex: /_[a-z]/g
            };
        },
        to(letter) {
            return `_${letter.toLowerCase()}`;
        }
    },
    kebabCase: {
        from(input) {
            return {
                parsedInput: input,
                regex: /-[a-z]/g
            };
        },
        to(letter) {
            return `-${letter.toLowerCase()}`;
        }
    }
};
const NamingConventions = {
    camelCase: 'camelCase',
    pascalCase: 'pascalCase',
    snakeCase: 'snakeCase',
    kebabCase: 'kebabCase',
    convert(input) {
        return {
            /**
             * Prepare provided input to be converted from given convention
             */
            from(convention) {
                const { parsedInput, regex } = _getConvention(convention).from(input);
                return {
                    to(targetConvention) {
                        return _replace(parsedInput, regex, targetConvention);
                    }
                };
            },
            /**
             * Parse provided input and convert it to desired convention
             */
            to(targetConvention) {
                const len = input.length, parsed = [];
                let prevType = 0, stack = '';
                for (let i = 0; i < len; i++) {
                    const type = _getType(input[i]);
                    if (i > 0 && !_compareTypes(prevType, type, stack) && stack.length) {
                        parsed.push(stack);
                        stack = '';
                    }
                    if (i === 0 || type !== TYPE_SPECIAL) {
                        stack += input[i].toLowerCase();
                    }
                    prevType = type;
                }
                if (stack.length) {
                    parsed.push(stack);
                }
                return _replace(parsed.join('-'), /-[a-z]/g, targetConvention);
            }
        };
    },
    /**
     * @param {string} conventionName
     * @param {NamingConventionProcessor} processor
     */
    addConvention(conventionName, processor) {
        conventions[conventionName] = processor;
        NamingConventions[conventionName] = conventionName;
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NamingConventions);
function _getConvention(convention) {
    if (typeof conventions[convention] !== 'undefined') {
        return conventions[convention];
    }
    throw new Error(`Unknown naming convention '${convention}'!`);
}
function _replace(parsedInput, regex, targetConvention) {
    const result = parsedInput.replace(regex, (match) => {
        return _getConvention(targetConvention).to(match.substring(match.length - 1));
    });
    if (result.length && typeof _getConvention(targetConvention).postProcess === 'function') {
        return _getConvention(targetConvention).postProcess(result);
    }
    return result;
}
function _getType(char) {
    if (!isNaN(parseInt(char, 10))) {
        return TYPE_NUMBER;
    }
    else if (char === char.toLowerCase() && char !== char.toUpperCase()) {
        return TYPE_LOWERCASE;
    }
    else if (char === char.toUpperCase() && char !== char.toLowerCase()) {
        return TYPE_UPPERCASE;
    }
    return TYPE_SPECIAL;
}
function _compareTypes(prevType, type, stack) {
    if (type === prevType) {
        return true;
    }
    else if (type === TYPE_NUMBER) {
        return prevType !== TYPE_SPECIAL;
    }
    else if (type === TYPE_LOWERCASE && prevType === TYPE_UPPERCASE) {
        return stack.length === 1; // for camelCase
    }
    return false;
}


__webpack_exports__ = __webpack_exports__.default;
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=naming-conventions.js.map