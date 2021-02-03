/**
 * JavaScript naming conventions conversion
 * (c) 2020 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
window.NamingConventions = (function(TYPE_NUMBER, TYPE_LOWERCASE, TYPE_UPPERCASE, TYPE_SPECIAL) {
    'use strict';

    /**
     * @typedef NamingConventionProcessor
     * @type Object
     * @property {Function(input: string): {parsedInput: string, regex: RegExp}} from
     * @property {Function(letter: string): {string}} to
     */

    const conventions = {
        camelCase: {
            from(input) {
                return {
                    parsedInput: input,
                    regex: /[A-Z]/g
                }

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
                }

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
                }
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
                }
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
        /**
         *
         * @param input
         * @returns {{from: Function, to: Function}}
         */
        convert(input) {
            return {
                /**
                 * Prepare provided input to be converted from given convention
                 * @param {string} convention
                 * @returns {{to: Function}}
                 */
                from(convention) {
                    const {parsedInput, regex} = _getConvention(convention).from(input);
                    return {
                        to(targetConvention) {
                            return _replace(parsedInput, regex, targetConvention);
                        }
                    }
                },
                /**
                 * Parse provided input and convert it to desired convention
                 * @param {string} targetConvention
                 * @returns {string}
                 */
                to(targetConvention) {
                    const len = input.length,
                        parsed = [];
                    let prevType = 0,
                        stack = '';

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
            }
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

    return NamingConventions;

    /**
     * @param {string} convention
     * @returns {Object}
     * @private
     */
    function _getConvention(convention) {
        if (typeof conventions[convention] !== 'undefined') {
            return conventions[convention];
        }
        throw new Error(`Unknown naming convention '${convention}'!`)
    }

    /**
     * @param {string} parsedInput
     * @param {RegExp} regex
     * @param {string} targetConvention
     * @private
     */
    function _replace(parsedInput, regex, targetConvention) {
        const result = parsedInput.replace(regex, (match) => {
            return _getConvention(targetConvention).to(match.substring(match.length - 1));
        });
        if (result.length && typeof _getConvention(targetConvention).postProcess === 'function') {
            return _getConvention(targetConvention).postProcess(result);
        }
        return result;
    }

    /**
     * @param {string} char
     * @returns {number}
     * @private
     */
    function _getType(char) {
        if (!isNaN(parseInt(char, 10))) {
            return TYPE_NUMBER;
        } else if (char === char.toLowerCase() && char !== char.toUpperCase()) {
            return TYPE_LOWERCASE;
        } else if (char === char.toUpperCase() && char !== char.toLowerCase()) {
            return TYPE_UPPERCASE;
        }
        return TYPE_SPECIAL;
    }

    /**
     * @param {number} prevType
     * @param {number} type
     * @param {string} stack
     * @returns {boolean}
     * @private
     */
    function _compareTypes(prevType, type, stack) {
        if (type === prevType) {
            return true;
        } else if (type === TYPE_NUMBER) {
            return prevType !== TYPE_SPECIAL;
        } else if (type === TYPE_LOWERCASE && prevType === TYPE_UPPERCASE) {
            return stack.length === 1; // for camelCase
        }
        return false;
    }
})(1, 2, 3, 4);
