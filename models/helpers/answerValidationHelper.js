const StringHelper = require("./stringHelper");
const UtilityHelper = require("./utilityHelper");

class AnswerValidationHelper
{
    static validationStrategies;

    static normalizeInput(input)
    {
        if ( typeof input !== 'string' || !UtilityHelper.isset(input) ) return '';
        
        return [
            s => StringHelper.removePunctuation(s),
            s => StringHelper.removeDiacritics(s),
            s => StringHelper.toLowerCase(s),
            s => StringHelper.trimWhitespace(s)
        ].reduce((str, fn) => {
            try {
                return fn(str);
            } catch ( error ) {
                return str;
            }
        }, input);
    }

    static checkExactMatch(submitted, correct)
    {
        return submitted === correct;
    }

    static checkPartialMatch(submitted, correct)
    {
        return submitted.includes(correct) || correct.includes(submitted);
    }

    static checkNumeric(submitted, correct, options = { tolerance: 0 })
    {
        const subNum = Number(submitted);
        const corrNum = Number(correct);
        return !Number.isNaN(subNum) && !Number.isNaN(corrNum) && Math.abs(subNum - corrNum) <= ( options.tolerance || 0 );
    }

    static checkRegex(submitted, pattern)
    {
        try {
            return new RegExp(pattern, 'i').test(submitted);
        } catch ( error ) {
            return false;
        }
    }

    static checkSimilarity(submitted, correct, threshold = 0.9)
    {
        const similarity = this.calculateSimilarity(submitted, correct);
        return similarity >= threshold;
    }

    static checkListMatch(submitted, correctList)
    {
        return correctList.some(correct => 
            this.checkSimilarity(submitted, correct, 0.85)
        );
    }

    static calculateSimilarity(a, b)
    {
        if ( !a || !b ) return 0;
        
        const tokenize = str => new Set(str.split(/\s+/).filter(Boolean));
        const setA = tokenize(a);
        const setB = tokenize(b);
        const intersection = new Set([...setA].filter(x => setB.has(x)));
        return ( 2 * intersection.size ) / ( setA.size + setB.size );
    }

    static {
        this.validationStrategies = {
            exact: this.checkExactMatch,
            partial: this.checkPartialMatch,
            numeric: this.checkNumeric,
            regex: this.checkRegex,
            similarity: this.checkSimilarity,
            list: this.checkListMatch
        };
    }

    static validate(submittedAnswer, correctAnswer, validationStrategy = 'exact', options = {})
    {
        const cleanSubmitted = this.normalizeInput(String(submittedAnswer));
        const cleanCorrect = this.normalizeInput(String(correctAnswer));
        const validator = this.validationStrategies[validationStrategy] || this.checkExactMatch;
        
        if ( validationStrategy === 'list' )
        {
            const correctList = cleanCorrect.split(/[,;]/).map(s => s.trim());
            return validator(cleanSubmitted, correctList);
        }
        
        return validator(cleanSubmitted, cleanCorrect, options);
    }
}

module.exports = AnswerValidationHelper;