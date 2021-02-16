/**
 * JavaScript naming conventions conversion
 * (c) 2020-2021 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */
const TYPE_NUMBER = 1, TYPE_LOWERCASE = 2, TYPE_UPPERCASE = 3, TYPE_SPECIAL = 4;

export interface NamingConventionProcessor {
    from: (input: string) => { parsedInput: string, regex: RegExp },
    to: (letter: string) => string,
    postProcess?: (result: string) => string
}

const conventions: {[convention: string]: NamingConventionProcessor} = {
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

export type NamingConvention = keyof typeof conventions;

export const NamingConventions = {
    camelCase: 'camelCase',
    pascalCase: 'pascalCase',
    snakeCase: 'snakeCase',
    kebabCase: 'kebabCase',
    convert(input: string) {
        return {
            /**
             * Prepare provided input to be converted from given convention
             */
            from(convention: NamingConvention): { to: (targetConvention: NamingConvention) => string } {
                const {parsedInput, regex} = _getConvention(convention).from(input);
                return {
                    to(targetConvention: NamingConvention): string {
                        return _replace(parsedInput, regex, targetConvention);
                    }
                }
            },
            /**
             * Parse provided input and convert it to desired convention
             */
            to(targetConvention: NamingConvention): string {
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
    addConvention(conventionName: string, processor: NamingConventionProcessor): void {
        conventions[conventionName] = processor;
        NamingConventions[conventionName] = conventionName;
    }
};

export default NamingConventions;

function _getConvention(convention: NamingConvention): NamingConventionProcessor {
    if (typeof conventions[convention] !== 'undefined') {
        return conventions[convention];
    }
    throw new Error(`Unknown naming convention '${convention}'!`)
}

function _replace(parsedInput: string, regex: RegExp, targetConvention: NamingConvention): string {
    const result = parsedInput.replace(regex, (match) => {
        return _getConvention(targetConvention).to(match.substring(match.length - 1));
    });
    if (result.length && typeof _getConvention(targetConvention).postProcess === 'function') {
        return _getConvention(targetConvention).postProcess(result);
    }
    return result;
}

function _getType(char: string): number {
    if (!isNaN(parseInt(char, 10))) {
        return TYPE_NUMBER;
    } else if (char === char.toLowerCase() && char !== char.toUpperCase()) {
        return TYPE_LOWERCASE;
    } else if (char === char.toUpperCase() && char !== char.toLowerCase()) {
        return TYPE_UPPERCASE;
    }
    return TYPE_SPECIAL;
}

function _compareTypes(prevType: number, type: number, stack: string): boolean {
    if (type === prevType) {
        return true;
    } else if (type === TYPE_NUMBER) {
        return prevType !== TYPE_SPECIAL;
    } else if (type === TYPE_LOWERCASE && prevType === TYPE_UPPERCASE) {
        return stack.length === 1; // for camelCase
    }
    return false;
}
