export interface NamingConventionProcessor {
    from: (input: string) => {
        parsedInput: string;
        regex: RegExp;
    };
    to: (letter: string) => string;
    postProcess?: (result: string) => string;
}
declare const conventions: {
    [convention: string]: NamingConventionProcessor;
};
export declare type NamingConvention = keyof typeof conventions;
export declare const NamingConventions: {
    camelCase: string;
    pascalCase: string;
    snakeCase: string;
    kebabCase: string;
    convert(input: string): {
        /**
         * Prepare provided input to be converted from given convention
         */
        from(convention: NamingConvention): {
            to: (targetConvention: NamingConvention) => string;
        };
        /**
         * Parse provided input and convert it to desired convention
         */
        to(targetConvention: NamingConvention): string;
    };
    /**
     * @param {string} conventionName
     * @param {NamingConventionProcessor} processor
     */
    addConvention(conventionName: string, processor: NamingConventionProcessor): void;
};
export default NamingConventions;
