describe('NamingConventions', () => {

    const strings = {
        camelCase: 'someStringInSomeCase',
        pascalCase: 'SomeStringInSomeCase',
        snakeCase: 'some_string_in_some_case',
        kebabCase: 'some-string-in-some-case'
    };

    Object.entries(strings).forEach(([convention, string]) => {
        describe(convention, () => {
            Object.entries(strings).forEach(([targetConvention, expected]) => {
                it(targetConvention, () => {
                    expect(NamingConventions.convert(string).from(convention).to(targetConvention)).toEqual(expected);
                });
            })
        })
    });

    describe('auto detect', () => {
        Object.entries(strings).forEach(([, string]) => {
            Object.entries(strings).forEach(([convention, expected]) => {
                it(convention + ' ' + string, () => {
                    expect(NamingConventions.convert(string).to(convention)).toEqual(expected);
                });
            })
        });

        const testStrings = [
            '',
            'a',
            'some-string',
            'someString',
            'some-mixed_conventions___StringSTRING',
            'StringWith124Numbers',
            'string-with%^specialCharacters#',
        ];

        function testWith(expected, callback) {
            return () => {
                testStrings.forEach((testString, idx) => {
                    it(testString, () => {
                        callback(testString, expected[idx]);
                    });
                });
            };
        }

        describe('toCamelCase', testWith([
            '', 'a', 'someString', 'someString', 'someMixedConventionsStringString', 'stringWith124Numbers', 'stringWithSpecialCharacters'
        ], (testString, expected) => {
            expect(NamingConventions.convert(testString).to(NamingConventions.camelCase)).toEqual(expected);
        }));

        describe('toPascalCase', testWith([
            '', 'A', 'SomeString', 'SomeString', 'SomeMixedConventionsStringString', 'StringWith124Numbers', 'StringWithSpecialCharacters'
        ], (testString, expected) => {
            expect(NamingConventions.convert(testString).to(NamingConventions.pascalCase)).toEqual(expected);
        }));

        describe('toSnakeCase', testWith([
            '', 'a', 'some_string', 'some_string', 'some_mixed_conventions_string_string', 'string_with124_numbers', 'string_with_special_characters'
        ], (testString, expected) => {
            expect(NamingConventions.convert(testString).to(NamingConventions.snakeCase)).toEqual(expected);
        }));

        describe('toKebabCase', testWith([
            '', 'a', 'some-string', 'some-string', 'some-mixed-conventions-string-string', 'string-with124-numbers', 'string-with-special-characters'
        ], (testString, expected) => {
            expect(NamingConventions.convert(testString).to(NamingConventions.kebabCase)).toEqual(expected);
        }));
    });
});
