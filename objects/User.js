/**
 * User Object
 *
 * All user based functionality.
 */

module.exports = {

    /**
     * Get user league profile
     */
    profile(receivedMessage, args) {
        const user = require('../Schema/Users')
        let query = {_name: receivedMessage.author.username}
        user.findOne(query, function(err, res){
            console.log(res)
        })
    },

    /**
     * Shows recent matches
     */
    recent() {

    },

    /**
     * Returns currently registered Deck name
     */
    currentDeck(receivedMessage, args, callback) {
        /**
         * TODO: Update alias to deck
         */
        const user = require('../Schema/Users')
        const alias = require('../Schema/Alias')

        let findQuery = {_name: receivedMessage.author.username.toString()}
        let projection = {"_currentDeck": 1}

        user.findOne(findQuery, function(err, res){
            if (res) {
                let findQuery = {_name: res._currentDeck.toString()}
                alias.findOne(findQuery, function(err, res){
                    if (res) {
                        callback(res._name)
                    }
                    else {
                        callback("Error: 2")
                    }
                })
            }
            else {
                callback("Error: 1")
            }
        })
    },
    /**
     * Sets the users current Deck
     */
    useDeck(receivedMessage, args, callback){
        /**
         * TODO: Basic checking against the alias DB is being made, but more work needs to be done
         * TODO: Update alias to deck
         * EX: typing is $use gitrog will not set your deck but $use Gitrog will. 
         * Case sensitivity work needs to be done
         */
        const user = require('../Schema/Users')
        const alias = require('../Schema/Alias')
        

        let argsWithCommas = args.toString()
        let argsWithSpaces = argsWithCommas.replace(/,/g, ' ');

        let findQuery = {_name: argsWithSpaces}
        let updateQuery = {_name: receivedMessage.author.username}
        let toSave = {$set: {_currentDeck: argsWithSpaces}}

        // console.log("DEBUG: \nargs as entered: " + args + '\n' + "args with commas to string: " + argsWithCommas
        // + '\n' + "args with spaces to string " + argsWithSpaces)
        alias.findOne(findQuery, function(err, res){
            if (res){
                user.updateOne(updateQuery, toSave, function(err, res){
                    if (res){
                        callback(argsWithSpaces)
                    }
                    else{
                        callback("Error")
                    }
                })
            }
            else{
                callback("Error")
            }
        })
    }
}