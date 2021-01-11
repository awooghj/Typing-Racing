
// axios is a api that generate random sentences
const axios = require('axios')

const uri = 'http://api.quotable.io/random'


const getData =()=>{
    
    // what this part do is to return a promise, so we 're gonna
    // use axios to make a request to that URL
    return axios.get(uri).then(response => response.data.content.split(" "))
    // since we are only interested in the content, so we use .content
    // (response.data.content) return an actually quote and this is not
    // what we want, we want an array of words, not a full string
    // so we call (response.data.content.splite) method to 
}
module.exports = getData