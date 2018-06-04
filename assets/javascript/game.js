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
                var hangingStatus = [ "Game Start",
                                      "Head is Hanging",
                                      "Head and Torso",
                                      "Head, Torso, & One Arm",
                                      "Head, Torso, & Both Arms",
                                      "Head, Torso, Arms, and One Leg",
                                      "Head, Torso, Arms, and Legs",
                                      "Game Over" ];
                var theWords = ["ALPINE", "LUGE","BASKETBALL","SKING","SKATING","DOWNHILL","MEDAL","KOREA", "OLYMPIC" ];
                // Hangman variables
                var theWord =    "";
                var toDisplay =  "";
                var displayArray = ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'];
                var theLettersGuessed = "";                                      
                 // ...
                var winCount = 0;

                // Reset the Game;
                gameReset(); 

                // Pick a word
                theWord = pickAWord();

                //Intialize display
                $('#info-text').text("Press any key to go for gold!");
                $('#win-count').text(winCount);
                $('#guesses-left').text(playerGuessesRemaining);
                $('#letters-guessed').text(theLettersGuessed);
                $('#word-display').text(toDisplay);
                console.log( playerGuessesRemaining );
                toDisplay = '';                    
                for( i=0; i< theWord.length; i++)
                    toDisplay += displayArray[i] + " ";
                console.log( toDisplay );
                $('#word-display').text(toDisplay);
                // To resolve a display glitch of the gallows on intial startup of published site.
                $('img#gallows-image').attr('src', "assets/images/Hangman-001.png" );
                $('img#gallows-image').attr('alt', "Game Start");

                 // On Key Up Handler
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

                    // Log some data
                    console.log( playerKeypress );
                    console.log( playerGuess );
                    console.log( 'Guesses Left: ' + playerGuessesRemaining );
                    console.log( 'The Word: ' + theWord);
                    console.log( toDisplay);

                    if (playerGuessesRemaining > 0)
                    hangImage = "hangman-00" + (8-playerGuessesRemaining+1) + ".png";

                    // Update the Hangman Image based on number of guesses remaining
                    console.log('ImageFile: ' + hangImage);
                    $('img#gallows-image').attr('src', hangImagePath + hangImage );
                    $('img#gallows-image').attr('alt', hangingStatus[ (8-playerGuessesRemaining)]);

                    // Mark off the letter if it was not choosen allready
                    var letterValid = false;
                    for ( i=0;i<choosenLetters.length;i++)
                    {
                        if (( playerGuess == theLetters[i])
                        &&  (playerGuessesRemaining >0) && (!playerCompletedWord)) 
                        {
                            // If player chose a letter they already picked
                            if (choosenLetters[i] == true )
                                return;  // Then exit without doing anything
                            // Otherwise mark it as a new choice
                            letterValid=true;
                            choosenLetters[i] = true;
                            break;
                        }
                    }
                    if (event.keyCode == 13)
                        letterValid = true; // Enter is a vaildi choice
                    if (!letterValid)
                        return; // Exit without doing anything if letter choice was not valid (i.e 1-10 or special chars)

                    
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
                    $('figcaption#gallows-caption').text("");   // Clear this out on a valid reponse                                                                           
 

                    // See if the player has completed the word
                    if (letterMatch && playerGuessesRemaining > 0)
                    {
                        playerCompletedWord = true;  // Assume so until determined otherwise
                        // Determine if there are any un-gueesed letters by presence of underscores
                       for( i=0; i< theWord.length; i++)
                        {
                           if ( displayArray[i] == '_')
                              playerCompletedWord = false;
                        }
                        if (playerCompletedWord)
                        {
                            winCount++;
                            $('figcaption#gallows-caption').text("Victory!!!");
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
                        $('#info-text').text("Press Enter to continue!");
                    }

                    // Reset to a new work if player guessed all of the words and then pressed Enter  
                    if ( (playerCompletedWord || playerGuessesRemaining == 0) && event.keyCode == 13 ) // Keycode 13 is Enter
                    {
                       // Reset the Game;
                       gameReset(); 
                       // Pick another word
                       theWord = pickAWord();
                       $('#info-text').text("Press any key to go for gold!");  
                       $('figcaption#gallows-caption').text("");                                                                             
                    }

                    // Determine which Hangman image to display
                    if (playerGuessesRemaining > 0)
                        hangImage = "hangman-00" + (8-playerGuessesRemaining+1) + ".png";

                    // Update the Hangman Image based on number of guesses remaining
                    console.log('ImageFile: ' + hangImage);
                    $('img#gallows-image').attr('src', hangImagePath + hangImage );
                    $('img#gallows-image').attr('alt', hangingStatus[ (8-playerGuessesRemaining)]);
                   
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
                    toDisplay = '';                    
                    for( i=0; i< theWord.length; i++)
                        toDisplay += displayArray[i] + " ";
                    console.log( toDisplay );

                    // Output results to the Page for the user to see
                    $('#win-count').text(winCount);
                    $('#guesses-left').text(playerGuessesRemaining);
                    $('#letters-guessed').text(theLettersGuessed);
                    $('#word-display').text(toDisplay);
                 };

    function gameReset()
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
        displayArray = ['_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_','_'];
        theLettersGuessed = "";
         // Reset all letters to un-choosen
         for( i=0; i<choosenLetters.length; i++)
             choosenLetters[i]=false;
    }

    function pickAWord( ) {
        var randnum= Math.floor((Math.random()) * theWords.length + 1);
        console.log('index: ' + randnum);
        var selectedWord = theWords[randnum];
        console.log(theWord);
        for (i=0;i<selectedWord.length;i++)
            toDisplay += '_';
        return selectedWord;
    }
                        
}); 