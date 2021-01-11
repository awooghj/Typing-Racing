import React from 'react'

// you can create this in different CSS file, but we just
// create it in the actual component
const typedCorrectlyStyle = {
    "backgroundColor": "#34eb77"
}

const getTypedWords = (words, player)=>{
    // words is in array, so we pass index 0, which is our
    // starting point and we want to go up until where the 
    // player currently is 
    // player.currentWordIndex is going up until 1 less
    // than where the player is currently
    let typedWords = words.slice(0, player.currentWordIndex)
    typedWords = typedWords.join(" ")

    // return some JSX
    // add a space after {typedWords} so that {typedWords}
    // won't be mushed with {words[player.currentWordIndex]}
    return <span style = {typedCorrectlyStyle}>{typedWords} </span>
}

// here the only thing I did was I wanted the text
// to be underlined
const currentStyle = {
    "textDecoration": "underline"
}

const getCurrentWord = (words, player)=>{

    // here is simple. what we want to do is output
    // our words so within our words array, we already
    // know where the player is currently at, so we
    // can just access it by saying player.currentWordIndex
    return <span style = {currentStyle}> {words[player.currentWordIndex]}</span>
}


const getWordsToBeTyped = (words, player)=>{

    // this time, instead of starting at index 0, we want
    // to go one above where the player is currently at
    // and go until the end
    let wordsToBeTyped = words.slice(player.currentWordIndex + 1, words.length)
    wordsToBeTyped = wordsToBeTyped.join(" ")

    // we can create a style here but now I don't create one
    // we add a space before {typedWords}. if you don't add
    // a space, then the current word and the words to be 
    // typed will be mixed together
    return <span> {wordsToBeTyped}</span>
}

const DisplayWords = ({words, player})=>{
    // what we are gonna do is to split the sentence
    // we get into three parts
    // the first part is the words we need to type out
    // the second part is the current word that we are on
    // the third part the words left we need to type out
    // the reason to split it into three parts is
    // because we need to apply different CSS styles 
    // to each of them

    // first let us return some JSX
    // we are gonna use react fragment
    // we will create three helper functions

    // first one is 'getTypeWords', this is goning to
    // be all the words that the user has typed out

    return(
        <>
        {/* so we got all the words that we typed out, 
        we got the current words we are typing out */}
            {getTypedWords(words, player)}
            {getCurrentWord(words, player)}

        {/* now we need to do the words that we need to
        type out */}
            {getWordsToBeTyped(words, player)}
        </>
    )
}

export default DisplayWords