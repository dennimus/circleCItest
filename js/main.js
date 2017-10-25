
//wait until DOM is loaded
window.addEventListener("load", init);

/**
 * Initialize the application (after DOM ready)
 */
function init() {

}

var deckID = null;
var value = 'ACE';
var playerCards = [];
var dealerCards = [];
var hitme = 0;
var dealme = 0;
var dealerScore = 0;
var playerScore = 0;
var scoreplayer = localStorage.getItem("scoreplayer");
if (scoreplayer == null){
    var scoreplayer = 1000;
} 


document.getElementById("score").innerHTML = scoreplayer;
document.getElementById("deck").addEventListener("click", generateDeck);
document.getElementById("hit").addEventListener("click", hitCard);
document.getElementById("uitslag").addEventListener("click", uitslag);

function generateDeck(){
    $.getJSON("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
        .done(function(resultData){
            deckID = resultData.deck_id;
            console.log(resultData);
            drawDealer();
            drawCards();


        })
        .fail(function(){
            console.log("failed");
        }); 
}
function drawCards(){
    $.getJSON("https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=2")
        .done(function(resultData){
            console.log(resultData);
            displayCards(resultData.cards);
            checkValues(playerCards);
            console.log(playerCards);
           
        })
        .fail(function(){
            console.log("failed");
        }); 
}

function drawDealer(){
    $.getJSON("https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=2")
    .done(function(resultData){
        console.log(resultData);
        displayDealer(resultData.cards);
        checkValues(dealerCards);
        console.log(dealerCards);
    })
    .fail(function(){
        console.log("failed");
    }); 
}

function hitCard(){
    $.getJSON("https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=1")
        .done(function(resultData){
            console.log(resultData);
            displayCards(resultData.cards);
            checkValues(playerCards);
            console.log(playerCards);
            score();
            
        })
        .fail(function(){
            console.log("failed");
        }); 
}
function hitDealer(){
    $.getJSON("https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=1")
        .done(function(resultData){
            console.log(resultData);
            displayDealer(resultData.cards);
            checkValues(dealerCards);
            console.log(dealerCards);
        })
        .fail(function(){
            console.log("failed");
        }); 
}


function displayCards(cards){
    var j = cards.length;
    for( var i = 0; i<j; i++){
        playerCards[hitme] = cards[i].value;
        var newCard = document.createElement("img"); 
        newCard.setAttribute("src", cards[i].image);
        newCard.setAttribute("height","300px");
        document.getElementById("cards").appendChild(newCard);
        hitme++;
    }
}
function displayDealer(cards){
    var j = cards.length;
    for( var i = 0; i<j; i++){
        dealerCards[dealme] = cards[i].value;
        if (dealme==0){
            var newCard = document.createElement("img"); 
            newCard.setAttribute("src", "../image/cardback.png");
            newCard.setAttribute("height","250px");
            newCard.setAttribute("width","200px");
            document.getElementById("dealer").appendChild(newCard);
            dealme++;
        } else {
            var newCard = document.createElement("img"); 
            newCard.setAttribute("src", cards[i].image);
            newCard.setAttribute("height","250px");
            document.getElementById("dealer").appendChild(newCard);
            dealme++;
        }
    }
}
function checkValues(array){
    var k = array.length;
    for(var i = 0; i<k; i++){
        if  (array[i] == 'KING'|| array[i] == 'QUEEN'|| array[i] == 'JACK'){
            array[i] = 10;
            console.log(array[i]);
        } else  if (array[i] == 'ACE'){
            document.getElementById("one").addEventListener("click", function one(){
                for (var i = 0; i < array.length; i++)
                if (array[i] == 'ACE')
                    array[i] = 1;
            console.log(array[i]);
            console.log(array);
            });
            document.getElementById("eleven").addEventListener("click", function eleven(){
                for (var i = 0; i < array.length; i++)
                if (array[i] == 'ACE')
                    array[i] = 11;

            console.log(array[i]);
            console.log(playerCards);
            });

        } else  if (dealerCards[i] == 'ACE'){
            if (array.length = 2){
                dealerCards[i]=11;
            } else {
                dealerCards[i]=1;
            }

        } else {
            array[i] = array[i];
            console.log(array[i]);
        }
    }
}
function score(){
    var length = playerCards.length;
    for(var i=0; i<length;i++){
        playerScore = playerScore + parseInt(playerCards[i]);
    } 
    var dealLength = dealerCards.length;
    for(var i=0; i<dealLength;i++){
        dealerScore = dealerScore + parseInt(dealerCards[i]);
    } 
    if (dealerScore <17){
        hitDealer();
    }
    console.log(playerScore);
    console.log(dealerScore);
}

function uitslag(){
    playerScore = 0;
    dealerScore = 0;


    score();
    console.log(playerScore);
    console.log(dealerScore);
    if((playerScore == 21 && playerScore != dealerScore)||(playerScore>dealerScore && playerScore<22)||(dealerScore>22 && playerScore<22)){
        window.alert("You won!");
        scoreplayer -= -100;
        console.log(scoreplayer);
        
    }
    else if (playerScore > 21 || (playerScore < dealerScore)&& dealerScore < 22){
        window.alert("You lost!");
        scoreplayer -=100;
        console.log(scoreplayer);
        
    } 
    else if (playerScore==dealerScore){
        window.alert("Draw!");
        console.log(scoreplayer);
        
    }
    localStorage.setItem("scoreplayer",scoreplayer);

    endgame();

}
function endgame(){
    location.reload();
}
