class StringHelper
{
    static explode(input, explodeBy)
    {
        return input.split(explodeBy).filter(part => part !== '');
    }

    static explodeMulti(input, explodeByList)
    {
        let parts = [];
        let indices = [-1];

        for ( let i = 0; i < input.length; i ++ )
        {
            if ( explodeByList.includes(input[i]) ) indices.push(i);
        }

        indices.push(input.length - 1);

        for ( let i = 1; i < indices.length; i ++ )
        {
            parts.push(input.substr(indices[i - 1] + 1, indices[i] - indices[i - 1] - 1));
        }

        return parts.filter(part => part !== '');
    }

    static reverseString(input)
    {
        return input.split("").reverse().join("");
    }

    static normalizeString(input)
    {
        while ( input.length > 0 && input[0] == ' ' ) input = input.substr(1);
        input = this.reverseString(input);

        while ( input.length > 0 && input[0] == ' ' ) input = input.substr(1);
        input = this.reverseString(input);

        input = input.replaceAll(/ {2,}/g, ' ');

        return input;
    }

    static toPascalCase(input, separateBy = ' ')
    {
        let parts = this.explode(input, separateBy);

        parts = parts.map(part => part[0].toUpperCase() + part.substr(1).toLowerCase());

        return parts.join('');
    }

    static toSnakeCase(input, separateBy = ' ')
    {
        let parts = this.explode(input, separateBy);

        parts = parts.map(part => part.toLowerCase());

        return parts.join('_');
    }

    static toCamelCase(input, separateBy = ' ')
    {
        let parts = this.explode(input, separateBy);

        parts = parts.map(part => part[0].toUpperCase() + part.substr(1).toLowerCase());

        parts[0] = parts[0].toLowerCase();

        return parts.join('');
    }

    static toKebabCase(input, separateBy = ' ')
    {
        let parts = this.explode(input, separateBy);

        parts = parts.map(part => part.toLowerCase());

        return parts.join('-');
    }

    static trimWhitespace(input)
    {
        return input.replace(/\s+/g, ' ').trim();
    }
  
    static toLowerCase(input)
    {
        return input.toLowerCase();
    }
  
    static removePunctuation(input)
    {
        return input.replace(/[^\p{L}\p{N}\s]/gu, '');
    }
  
    static removeDiacritics(input)
    {
        return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
}

module.exports = StringHelper;