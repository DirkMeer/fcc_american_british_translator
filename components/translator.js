const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {

    useDictLeftRight(dictionary, translationInProgress){
        //loop over each word in the dictionary provided
        Object.keys(dictionary).forEach((key) => {
            //create regex with word boundaries and our variable key inside
            //note /b becomes //b to escape the backslash and 'g' for global flag
            //the 'i' is for case insensitive. Not perfect but the fcc example is the same
            let regex = new RegExp(`\\b${key}\\b`, 'gi')
            translationInProgress = translationInProgress.replace(
                regex, //we add the QQQQ as temporary markers to prevent double translation of the same words
                `<span class="highlight">QQQQ${dictionary[key]}QQQQ</span>`)
        })
        return translationInProgress
    }

    //reverse version for british words in the long dictionary
    useDictReverse(dictionary, translationInProgress){
        //loop over each word in the dictionary provided
        Object.keys(dictionary).forEach((key) => {
            //create regex with word boundaries and our variable key inside
            //note /b becomes //b to escape the backslash and 'g' for global flag
            //the 'i' is for case insensitive. Not perfect but the fcc example is the same
            let regex = new RegExp(`\\b${dictionary[key]}\\b`, 'gi')
            translationInProgress = translationInProgress.replace(
                regex, //we add the QQQQ as temporary markers to prevent double translation of the same words
                `<span class="highlight">QQQQ${key}QQQQ</span>`)
        })
        return translationInProgress
    }

    //one off version with double regex (cannot have dots . in the regex)
    useAmericanToBritishTitles(dictionary, translationInProgress){
        //loop over each word in the dictionary provided
        Object.keys(dictionary).forEach((key) => {
            //we create a safe key. The first regex looks for a dot (ironically has to be escaped by a \.)
            //the second regex replaces the . with a \. which again has to be escaped by a \ to make \\.
            let safeKey = key.replace(/\./, '\\.')
            //console.log(safeKey)
            //input the safe key and remove word boundary at the end! (or the dot will create a word boundary early)
            let regex = new RegExp(`\\b${safeKey}`, 'gi')
            translationInProgress = translationInProgress.replace(
                regex, //we add the QQQQ as temporary markers to prevent double translation of the same words
                `<span class="highlight">QQQQ${dictionary[key]}QQQQ</span>`)
        })
        return translationInProgress
    }

    //convert time notation A to B
    timeAmericanToBritish(translationInProgress) {
        let timeRegex = new RegExp(/\b([0-9]{1,2})\:([0-6][0-9])\b/g)
        translationInProgress = translationInProgress.replace(
            timeRegex,
            //note how we input regex capture groups without even using ${varname}
            `<span class="highlight">$1.$2</span>`
        )
        return translationInProgress
    }

    //convert time notation B to A
    timeBritishToAmerican(translationInProgress) {
        let timeRegex = new RegExp(/\b([0-9]{1,2})\.([0-6][0-9])\b/g)
        translationInProgress = translationInProgress.replace(
            timeRegex,
            //note how we input regex capture groups without even using ${varname}
            `<span class="highlight">$1:$2</span>`
        )
        return translationInProgress
    }


    translate(text, mode){
        let translationInProgress = text
        if(mode === 'american-to-british'){
            //translate our words from American to British
            translationInProgress = this.useDictLeftRight(americanToBritishSpelling, translationInProgress)
            //translate our titles from American to British
            translationInProgress = this.useAmericanToBritishTitles(americanToBritishTitles, translationInProgress)
            //translate our time notation from American to British
            translationInProgress = this.timeAmericanToBritish(translationInProgress)
            //translate our American only words
            translationInProgress = this.useDictLeftRight(americanOnly, translationInProgress)
        
        } else if(mode === 'british-to-american') {
            //translate our words from British to American
            translationInProgress = this.useDictReverse(americanToBritishSpelling, translationInProgress)
            //translate our titles from British to American
            translationInProgress = this.useDictReverse(americanToBritishTitles, translationInProgress)
            //translate our time notation from British to American
            translationInProgress = this.timeBritishToAmerican(translationInProgress)
            //translate our British only words
            translationInProgress = this.useDictLeftRight(britishOnly, translationInProgress)
        }

        //test if anything was translated at all//
        let translation
        if(text === translationInProgress) {
            translation = 'Everything looks good to me!'
        } else { //remove the temporary double-translation-prevention markers
            translation = translationInProgress.replaceAll('QQQQ', '')
            //Note we have to use replaceAll because replace would only work for 1 occurrence
        }

        let returnObject = {
            text: text,
            translation: translation
        }
        return returnObject
    }

}

module.exports = Translator;