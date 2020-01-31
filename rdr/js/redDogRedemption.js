// initialize needed variables
let card1, card2, card3, lock1, lock2, multiplier1, multiplier2, symbol1, symbol2, balance = 5.0, stake = 1.0, sounds = "On", username = "";

// initialize an array for card data
const images = [];

// document ready
$(() => {
    
    // get card data with ajax
    $.ajax({
        url: "json/redDogRedemption.json",
        cache: false,
        dataType: "json"
    }).done(data => {
        console.log("successful");
        sortData(data);
    }).fail(() => {
        console.log("unsuccessful");
    });
    
    // if deck is clicked
    $("#deck").click(() => {
        if (!lock1) {
            // disable lock1
            lock1 = !lock1;
            // deal and reveal card1
            $("#card1").animate({
                left: "300px"
            }, 500).attr("src", getRandomCard("card1"));
            // deal card2a
            $("#card2a").animate({
                left: "540px"
            }, 500);
            // deal and reveal card2b
            $("#card2b").animate({
                left: "540px"
            }, 500).attr("src", getRandomCard("card2"));
            // deal and reveal card3
            $("#card3").animate({
                left: "780px"
            }, 500).attr("src", getRandomCard("card3"));
            // check if the dealt cards equal draw
            if (card1+1 == card3 || card3+1 == card1) {
                // disable lock2
                lock2 = !lock2;
                // reveal draw-text
                $("#resultText").text("Draw!").fadeIn(500, clearCards);
                // enable lock1 and lock2
                setTimeout("lock1 = false", 3000);
                setTimeout("lock2 = false", 3000);
            }
            else {
                // deduct stake from balance
                balance = balance-stake;
                $("#balanceButton").text(balance.toFixed(2));
            }
            // calculate multipliers based on the dealed cards
            calcMultipliers();
            // save user data to local storage
            if (username != "") {
                setUserData();
            }
        }
    });
    
    // if yes-button is clicked
    $("#yesButton").click(e => {
        // check if the button is allowed to be clicked
        if (lock1 && !lock2) {
            getResult(e.target.id);
        }
    });
    
    // if no-button is clicked
    $("#noButton").click(e => {
        // check if the button is allowed to be clicked
        if (lock1 && !lock2) {
            getResult(e.target.id);
        }
    });
    
    // if stake-button is clicked
    $("#stakeButton").click(() => {
        // check if the button is allowed to be clicked
        if (!lock1) {
            if (stake < 5 && stake < balance && stake+1 < balance && stake+1 <= 5) {
                $("#stakeButton").text((stake += 1.00).toFixed(2));
            }
            else if (stake > 5 || stake+1 > 5 && balance > 5 && stake+1 < 6) {
                stake = 5.0;
                $("#stakeButton").text(stake.toFixed(2));
            }
            else if (balance < stake || stake < balance && stake+1 > balance && stake+1 <= 5 || stake+1 == balance || stake == balance && balance < 1) {
                stake = balance;
                $("#stakeButton").text(stake.toFixed(2));
            }
            else {
                stake = 1.0;
                $("#stakeButton").text(stake.toFixed(2));
            }
        }
    });
    
    // if play again-button is clicked
    $("#playAgainButton").click(() => playAgain());
    
    // if sounds-button is clicked
    $("#sounds").click(() => {
        // check if sounds are on or off
        sounds = sounds == "On" ? "Off" : "On";
        // change image file path
        $("#sounds").attr("src", `images/sounds${sounds}.png`);
    });

    // if form submit-button is clicked
    $("#submit").click(e => {
        // prevent default behavior
        e.preventDefault();
        // check if the button is allowed to be clicked
        if (!lock1) {
            setUsername();
        }
    });
});

// sort card data
const sortData = data => {
    // iterate through card data
    $.each(data.cards, (index, card) => {
        // store card data in an array
        images.push(card.image);
    })
}

// get random item from given array
const getRandomItem = arr => arr[Math.floor(Math.random()*arr.length)];

// get random number between 1 and given number
const getRandomNumber = num => Math.floor((Math.random()*num)+1);

// get random card
const getRandomCard = card => {
    // array of symbols
    const symbols = ["c", "d", "h", "s"];
    // get random symbol from the array
    let randomSymbol = getRandomItem(symbols);
    // get random number between 1 and 13
    let randomNumber = getRandomNumber(13);
    // set image file path
    let filePath = randomSymbol+randomNumber;
    // random card value for debugging
    console.log(filePath);
    // store random symbol and random number in variables
    if (card == "card1") {
        card1 = randomNumber;
        symbol1 = randomSymbol;
    }
    else if (card == "card2") {
        card2 = randomNumber;
        symbol2 = randomSymbol;
    }
    else if (card == "card3") {
        card3 = randomNumber;
    }
    // check if this is the first card dealt
    if (card == "card2" || card == "card3") {
        // set image file path of card1
        const filePathCard1 = symbol1+card1;
        // check if this is the third card dealt
        if (card == "card3") {
            // set image file path of card2
            const filePathCard2 = symbol2+card2;
            // check if the same card was dealt already
            while (filePath == filePathCard1 || filePath == filePathCard2) {
                // get new random symbol from the array
                randomSymbol = getRandomItem(symbols);
                // get new random number between 1 and 13
                randomNumber = getRandomNumber(13);
                // store new random number in a variable
                card3 = randomNumber;
                // set new image file path
                filePath = randomSymbol+randomNumber;
                // altered random card value for debugging
                console.log(`!${randomSymbol}${randomNumber}`);
            }
        }
        // check if the same card was dealt already
        while (filePath == filePathCard1) {
            // get new random symbol from the array
            randomSymbol = getRandomItem(symbols);
            // get new random number between 1 and 13
            randomNumber = getRandomNumber(13);
            // store new random symbol in a variable
            symbol2 = randomSymbol;
            // store new random number in a variable
            card2 = randomNumber;
            // set new image file path
            filePath = randomSymbol+randomNumber;
            // altered random card value for debugging
            console.log(`!${randomSymbol}${randomNumber}`);
        }
    }
    // check what is the image file path of the new card
    if (randomSymbol == "c") {
        filePath = images[randomNumber-1];
    }
    else if (randomSymbol == "d") {
        filePath = images[randomNumber+12];
    }
    else if (randomSymbol == "h") {
        filePath = images[randomNumber+25];
    }
    else if (randomSymbol == "s") {
        filePath = images[randomNumber+38];
    }
    // return image file path
    return filePath;
}

// player wins
const winResult = e => {
    if (e == "yesButton") {
        // reveal win-text
        $("#resultText").text("You won!").fadeIn(500);
        // add to balance
        balance = balance+(stake*multiplier1);
        $("#balanceButton").text(balance.toFixed(2));
    }
    else if (e == "noButton") {
        // reveal win-text
        $("#resultText").text("You won!").fadeIn(500);
        // add to balance
        balance = balance+(stake*multiplier2);
        $("#balanceButton").text(balance.toFixed(2));
    }
}

// player loses
const loseResult = () => {
    // reveal lose-text
    $("#resultText").text("You lost...").fadeIn(500);
    // check if balance is less than one
    if (balance < 1 || balance < stake) {
        stake = balance;
        $("#stakeButton").text(stake.toFixed(2));
    }
}

// evaluate results based on the button pressed
const getResult = e => {
    // disable lock2
    lock2 = !lock2;
    // hide card2a
    $("#card2a").fadeOut(500);
    // reveal card2b
    $("#card2b").fadeIn(500, clearCards);
    // check if the player won or lost
    if (card1 > card2 && card3 < card2 || card1 < card2 && card3 > card2 || card1 == card2 && card3 == card2) {
        if (e == "yesButton") {
            // player wins
            winResult(e);
        }
        else if (e == "noButton") {
            // player loses
            loseResult();
        }
    }
    else {
        if (e == "yesButton") {
            // player loses
            loseResult();
        }
        else if (e == "noButton"){
            // player wins
            winResult(e);
        }
    }
    // calculate new balance
    calcBalance();
    // save user data to local storage
    if (username != "") {
        setUserData();
    }
}

// get user data from local storage
const getUserData = () => JSON.parse(localStorage.getItem("userData"));

// set user data to local storage
const setUserData = () => {
    // compile user data
    const userData = [username, balance];
    // save to local storage
    localStorage.setItem("userData", JSON.stringify(userData));
}

// set username
const setUsername = () => {
    // get new username
    const newUsername = $("#username").val();
    // get user data from local storage
    const oldUserData = getUserData();
    // check if there was user data
    if (oldUserData != null) {
        // check if the user has existing save data
        if (oldUserData[0] == newUsername) {
            // set old username
            username = oldUserData[0];
            // set old balance
            balance = oldUserData[1];
            $("#balanceButton").text(balance.toFixed(2));
        }
        else {
            if (username != "") {
                // set new balance
                balance = 5.0;
                $("#balanceButton").text(balance.toFixed(2));
            }
            // set new username
            username = newUsername;
        }
    }
    else {
        // set new username
        username = newUsername;
    }
    // check if username has been given
    if (username != "") {
        // set username
        $("#userText").text(`Username: ${username}`);
        // clear input
        $("#username").val("");
        // save user data to local storage
        setUserData();
    }
}

// calculate multipliers based on the dealed cards
const calcMultipliers = () => {
    // initialize needed variables
    let result1 = 0, result2 = 0, result3 = 0, odds1 = 0, odds2 = 0;
    // calculate yes-button multiplier
    if (card1 > card3) {
        result1 = (card1-card3-1)*4;
    }
    else if (card1 == card3) {
        result1 = 2;
        result3 = 2;
    }
    else {
        result1 = (card3-card1-1)*4;
    }
    odds1 = result1/50;
    multiplier1 = 1.0/odds1;
    $("#yesMultiplierButton").text(multiplier1.toFixed(2));
    // calculate no-button multiplier
    result2 = 52-result1-result3;
    odds2 = result2/50;
    multiplier2 = 1.0/odds2;
    $("#noMultiplierButton").text(multiplier2.toFixed(2));
    // check if the dealt cards equal draw => no multipliers
    if (card1+1 == card3 || card3+1 == card1) {
        $("#yesMultiplierButton").text("-");
        $("#noMultiplierButton").text("-");
    }
}

// calculate new balance
const calcBalance = () => {
    // calculate balance
    if (balance <= 0) {
        balance = 0.0;
        stake = balance;
        // trigger gameOver and enable lock1 and lock2
        setTimeout("gameOver()", 3000);
        setTimeout("lock1 = false", 4500);
        setTimeout("lock2 = false", 4500);
    }
    else if (balance <= 1 || stake > balance) {
        stake = balance;
        // enable lock1 and lock2
        setTimeout("lock1 = false", 3000);
        setTimeout("lock2 = false", 3000);
    }
    else {
        // enable lock1 and lock2
        setTimeout("lock1 = false", 3000);
        setTimeout("lock2 = false", 3000);
    }
}

// clear cards from the table
const clearCards = () => {
    // return dealt cards to the deck
    $("#card1").delay(2000).animate({
        left: "50px"
    }, 500);
    $("#card2a").delay(2000).animate({
        left: "50px"
    }, 500).fadeIn(0);
    $("#card2b").delay(2000).animate({
        left: "50px"
    }, 500).fadeOut(0);
    $("#card3").delay(2000).animate({
        left: "50px"
    }, 500);
    // fade out the result-text
    $("#resultText").delay(2000).fadeOut(500);
}

// if balance == 0 => game over
const gameOver = () => {
    // return dealt cards to the deck
    $("#card1").animate({
        left: "50px"
    }, 500).fadeOut(0);
    $("#card2a").animate({
        left: "50px"
    }, 500).fadeOut(0);
    $("#card2b").animate({
        left: "50px"
    }, 500).fadeOut(0);
    $("#card3").animate({
        left: "50px"
    }, 500).fadeOut(0);
    // fade out the HUD
    $("#deck").delay(600).fadeOut(500);
    $("#yesButton").delay(600).fadeOut(500);
    $("#noButton").delay(600).fadeOut(500);
    $("#yesMultiplierText").delay(400).fadeOut(500);
    $("#yesMultiplierButton").delay(400).fadeOut(500);
    $("#noMultiplierText").delay(200).fadeOut(500);
    $("#noMultiplierButton").delay(200).fadeOut(500);
    $("#balanceText").delay(200).fadeOut(500);
    $("#balanceButton").delay(200).fadeOut(500);
    $("#stakeText").delay(400).fadeOut(500);
    $("#stakeButton").delay(400).fadeOut(500);
    // reveal game over-text and play again-button
    $("#resultText").text("Game over!").delay(800).fadeIn(500);
    $("#playAgainButton").delay(1000).fadeIn(500);
}

// play again after a game over
const playAgain = () => {
    // fade out game over-text and play again-button
    $("#resultText").fadeOut(500);
    $("#playAgainButton").fadeOut(500);
    // reveal the HUD
    $("#deck").delay(600).fadeIn(500);
    $("#card1").delay(600).fadeIn(500);
    $("#card2a").delay(600).fadeIn(500);
    $("#card3").delay(600).fadeIn(500);
    $("#yesButton").delay(600).fadeIn(500);
    $("#noButton").delay(600).fadeIn(500);
    $("#yesMultiplierText").delay(400).fadeIn(500);
    $("#yesMultiplierButton").delay(400).fadeIn(500);
    $("#noMultiplierText").delay(200).fadeIn(500);
    $("#noMultiplierButton").delay(200).fadeIn(500);
    $("#balanceText").delay(200).fadeIn(500);
    $("#balanceButton").delay(200).fadeIn(500);
    $("#stakeText").delay(400).fadeIn(500);
    $("#stakeButton").delay(400).fadeIn(500);
    // set default multipliers, balance and stake
    $("#yesMultiplierButton").text("-");
    $("#noMultiplierButton").text("-");
    balance = 5.0;
    $("#balanceButton").text(balance.toFixed(2));
    stake = 1.0;
    $("#stakeButton").text(stake.toFixed(2));
    // save user data to local storage
    if (username != "") {
        setUserData();
    }
    // enable lock1 and lock2
    setTimeout("lock1 = false", 800);
    setTimeout("lock2 = false", 800);
}