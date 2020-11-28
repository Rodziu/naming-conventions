# JavaScript naming conventions conversion

JavaScript NamingConventions class which allows one to easily convert strings between namingConventions.

## Prerequisites

None :).

## Installation

```
yarn add naming-conventions
```

## Features

Four different naming conventions are available:

- camelCase
- PascalCase
- snake_case
- kebab-case

### Convert string from given convention to another

```javascript
NamingConventions.convert('someString')
    .from(NamingConventions.camelCase)
    .to(NamingConventions.kebabCase) // 'some-string'
```

### Convert a string with an unknown convention

You can omit the '.from' part in conversion. That causes the input string to be parsed and auto converted to desired target convention.
You should prefer to provide the input convention as this method is much more performant.

```javascript
NamingConventions.convert('someString')
    .to(NamingConventions.kebabCase) // 'some-string'
```

## Extending

You can add more conventions by using the NamingConventions.addConvention method.
