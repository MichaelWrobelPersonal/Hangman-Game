$(document).ready(function() {                
                // Hangman Arrays
                var theLetters = ['A','B','C','D','E',
                                  'F','G','H','I','J',
                                  'K','L','M','N','O',
                                  'P','Q','R','S','T',
                                  'U','V','W','X','Y','Z',' ' ];
                var choosenLetters = [false,false,false,false,false,        // A-E
                                      false,false,false,false,false,        // F-J
                                      false,false,false,false,false,        // K-O
                                      false,false,false,false,false,        // P-T
                                      false,false,false,false,false,false]; // U-Z
                var hangingStatus = [ "Start of the Game",
                                      "Head is Hanging",
                                      "Head and Torso",
                                      "Head, Torso, & One Arm",
                                      "Head, Torso, & Both Arms",
                                      "Head, Torso, Arms, and One Leg",
                                      "Head, Torso, Arms, and Legs",
                                      "Game Over" ];
                var theWords = ["LUGE","BASKETBALL","SKING","ICE SKATING","DOWNHILL","GOLD MEDAL","KOREA", "OLYMPIC FLAME" ];
                var theWord =    "";
                var toDisplay =  "";
                var displayArray = ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'];
                var theLettersGuessed = "";                                      
                 // ...
                var winCount = 0;
                var playerKeypress = "";
                var playerGuessesRemaining = 8;
                var letterMatch = false;
                var playerCompletedWord = false;
                var hangImage = "hangman-001.png";
                var hangImagePath = "assets/images/";
                var i=0;
                // Pick a word
                var w= (Math.floor(Math.random()) * theWords.length);
                console.log('index: ' + w);
                theWord = theWords[w];
                console.log(theWord);
                for (i=0;i<theWords[w].length;i++)
                    toDisplay += '_';
                    
                $('#win-count').text(winCount);
                $('#guesses-left').text(playerGuessesRemaining);
                $('#letters-guessed').text(theLettersGuessed);
                $('#info-text').text("Press any key to get started!");
                $('#word-display').text(toDisplay);
                console.log( playerGuessesRemaining );
                toDisplay = 'The Word is: ';                    
                for( i=0; i< displayArray.length; i++)
                    toDisplay += displayArray[i] + " ";
                console.log( toDisplay );
                $('#word-display').text(toDisplay);
                 
                 document.onkeyup = function(event)
                 {
    
                    winCount = $('#win-count').text();
                    playerGuessesRemaining = $('#guesses-left').text();

                    console.log( 'Key Pressed.......');
                    playerKeypress = event.key;
                    playerGuess = playerKeypress.toUpperCase();

                    // Insure remaining guesses is within bounds
                    if (playerGuessesRemaining > 8)
                        playerGuessesRemaining = 8;
                    else if ( playerGuessesRemaining < 0 )
                        playerGuessesRemaining = 0;
                    else if ( playerGuessesRemaining == NaN )
                        playerGuessesRemaining = 8;

                    console.log( playerKeypress );
                    console.log( playerGuess );
                    console.log( 'Guesses Left: ' + playerGuessesRemaining );

                    // Mark off the letter if it was not choosen allready
                    for ( i=0;i<choosenLetters.length;i++)
                    {
                        if (( playerGuess == theLetters[i]) && playerGuessesRemaining >0)
                        {
                            // If player chose a letter they allready picked
                            if (choosenLetters[i] == true )
                                return;  // Then exit without doing anything
                            // Otherwise mark it as a new choice
                            choosenLetters[i] = true;
                            break;
                        }
                    }

                    // See if the choosen letter matches a letter in the word.
                    letterMatch = false;
                    for ( i=0;i<theWord.length;i++)
                    {
                        if ((playerGuess == theWord.charAt(i)) && playerGuessesRemaining > 0 )
                        {
                            letterMatch = true;
                            displayArray[i] = playerGuess;
                        }
                    }

                    // See if the player has completed the word
                    if (letterMatch && playerGuessesRemaining > 0)
                    {
                        playerCompletedWord = true;  // Assume so until determined otherwise
                        // Determine if there are any un-gueesed letters by presence of underscores
                       for( i=0; i< displayArray.length; i++)
                        {
                           if ( displayArray[i] == '_')
                              playerCompletedWord = false;
                        }
                        if (playerCompletedWord)
                        {
                            winCount++;
                            $('figcaption#gallows-caption').text("Victory!!!")
                            $('#info-text').text("Press Enter to Continue!");
                            console.log( 'Player Won' );
                        }
                        else
                            console.log( 'Keep guessing' );
                    }

                   // Reduce the number of gueeses if no match;
                   if (!letterMatch && !playerCompletedWord && playerGuessesRemaining > 0)
                       playerGuessesRemaining--;

                    if (playerGuessesRemaining == 0)
                    {
                        $('figcaption#gallows-caption').text("Defeat...")
                        $('#info-text').text("Press Enter to Continue!");
                    }

                    // Reset to a new work if player guessed all of the words and then pressed Enter  
                    if ( (playerCompletedWord || playerGuessesRemaining == 0) && event.keyCode == 13 ) // Keycode 13 is Enter
                    {
                        console.log( 'Game Reset')
                        // Reset everything (except number of wins)
                        playerKeypress = "";
                        playerGuessesRemaining = 8;
                        hangImage = "hangman-001.png";
                        hangImagePath = "assets/images/";
                        letterMatch = false;
                        playerCompletedWord = false;
                        i=0;
                       // Pick another word
                        var w= (Math.floor(Math.random()) * theWords.length);
                        console.log('index: ' + w);
                        theWord = theWords[w];
                        console.log(theWord);
                        for (i=0;i<theWords[w].length;i++)
                            toDisplay += '_';
                        displayArray = ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'];
                       theLettersGuessed = "";
                        // Reset all letters to un-choosen
                        for( i=0; i<choosenLetters.length; i++)
                            choosenLetters[i]=false;
                        $('#info-text').text("Press any key to get started!");                                                                               
                    }

                    // Determine which Hangman image to display
                    if (playerGuessesRemaining > 0)
                        hangImage = "hangman-00" + (8-playerGuessesRemaining+1) + ".png";

                    // Update the Hangman Image based on number of guesses remaining
                    console.log('ImageFile: ' + hangImage);
                    $('img#gallows-image').attr('src', hangImagePath + hangImage );
                    $('img#gallows-image').attr('alt', hangingStatus[ (8-playerGuessesRemaining)]);
                    $('figcaption#gallows-caption').text(hangingStatus[ (8-playerGuessesRemaining)]);
                    
                    // Display what letters where guessed
                    theLettersGuessed = "";
                    for( i=choosenLetters.length-1; i>=0 ;i--)
                    {
                        if (choosenLetters[i] == true)
                            theLettersGuessed += theLetters[i] + " ";
                    }

                    // Output result to the Console for debugging
                    console.log( 'Results so far.......' );
                    console.log( 'Matched: ' + (letterMatch ? "Yes" : 'No' ));
                    console.log( 'Wins: ' + winCount );
                    console.log( 'Guesses Left: ' + playerGuessesRemaining );
                    console.log( 'Letters Guessed: ' + theLettersGuessed);
                    toDisplay = 'The Word is: ';                    
                    for( i=0; i< displayArray.length; i++)
                        toDisplay += displayArray[i] + " ";
                    console.log( toDisplay );

                    // Output results to the Page for the user to see
                    $('#win-count').text(winCount);
                    $('#guesses-left').text(playerGuessesRemaining);
                    $('#letters-guessed').text(theLettersGuessed);
                    $('#word-display').text(toDisplay);
                 };
                        
}); 