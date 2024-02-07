


//Setting global variables that I can access to filter from_____
let currentWatchlistCoinsArray = [];






//Wallet Amount - Get Request
fetch('http://localhost:3000/wallet')
    .then(res => res.json())
    .then(data => data.forEach((walletdb) => {

        //Adding the wallet value amount
        const walletAmountValue = document.querySelector('.wallet-amount');
        walletAmountValue.textContent = `$ ${walletdb.wallet_amount}`


    })
    )



//Deposit/Withdraw Form - Event Listeners_________________________________________________________________________________

const depositWithdrawInputBox = document.querySelector('.amount-input-box');

// depositWithdrawInputBox.addEventListener('input', () => {
//     const newConfirmTransactionBtn = document.createElement('button');
//     newConfirmTransactionBtn.textContent = 'Confirm Transaction';

//     depositWithdrawInputBox.appendChild(newConfirmTransactionBtn);

// })



//ADD AN EVENT LISTENER TO THIS BOX OR SUBMIT BUTTON__________________________*******************************
//PATCH is definitely wrong****************

fetch('http://localhost:3000/wallet', {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'applciation/json'
    },
    body: JSON.stringify()
})















const mainULElement = document.querySelector('.cards');

fetch('http://localhost:3000/crypto')
    .then(res => res.json())
    .then(data => data.forEach((coin) => {



        //creating the list element________________________
        const newLiElement = document.createElement('li');
        newLiElement.className = 'card';
        mainULElement.appendChild(newLiElement);

        //Creating the Div element__________________________
        const newDivElement = document.createElement('div');
        newLiElement.appendChild(newDivElement);

        //Creating all of the elements to add into the Div above
        const cryptoNameElement = document.createElement('h3');
        const cryptoLogoElement = document.createElement('img');
        cryptoLogoElement.className = 'logo-list'
        const cryptoPriceElement = document.createElement('h3');
        cryptoPriceElement.className = 'card-price';
        const cryptoVolumeElement = document.createElement('h3');
        cryptoVolumeElement.className = 'card-volume';
        const priceWordingElement = document.createElement('h3');
        priceWordingElement.className = 'price-word-hardcode';
        const volumeWordingElement = document.createElement('h3');
        volumeWordingElement.className = 'volume-word-hardcode';

        cryptoNameElement.textContent = coin.name;
        cryptoPriceElement.textContent = coin.current_price;
        cryptoLogoElement.src = coin.image;
        cryptoVolumeElement.textContent = coin.total_volume;
        priceWordingElement.textContent = 'Price:';
        volumeWordingElement.textContent = 'Volume:'

        newDivElement.appendChild(cryptoNameElement);
        newDivElement.appendChild(cryptoLogoElement);
        newDivElement.appendChild(cryptoPriceElement);
        newDivElement.appendChild(cryptoVolumeElement);
        newDivElement.appendChild(priceWordingElement);
        newDivElement.appendChild(volumeWordingElement);





        //Creating the button element to add to watchlist______
        const btnElement = document.createElement('button');
        btnElement.textContent = 'Watchlist';
        btnElement.className = 'watchlist-button';

        newDivElement.appendChild(btnElement);

        //Button Event Listener for adding to the watchlist_____
        btnElement.addEventListener('click', () => {
            addingToTheWatchlistDB(coin)

            // rerenderWatchlistData()
        });


    }))





//Creating the watchlist POST and DELETE _______________________________________________________________________________
//______________________________________________________________________________________________________________________

//GET request for watchlist and rendering the watchlist
const watchlistUlElement = document.querySelector('.watchlist-cards');

function rerenderWatchlistData() {

    fetch('http://localhost:3000/watchlist')
        .then(res => res.json())
        .then(data => data.forEach((watchlistCoin) => {


            //Checking the global scope array to see if the 'id' is already included. If so do nothing, if not then rerender the watchlist immediately
            //variable is defined at the top of index.js
            if (currentWatchlistCoinsArray.includes(watchlistCoin.id)) {

            }
            else {
                //creating and attaching the <li> element to the div
                const newWatchlistLiElement = document.createElement('li');
                newWatchlistLiElement.className = 'watchlist-card';
                watchlistUlElement.appendChild(newWatchlistLiElement);

                //Creating the div to append to the list
                const watchlistDivElement = document.createElement('div');
                newWatchlistLiElement.appendChild(watchlistDivElement);

                //Creating the Header elements to attach to the div
                const watchlistLogoElement = document.createElement('img');
                watchlistLogoElement.className = 'watchlist-logo';
                watchlistLogoElement.src = watchlistCoin.image;
                const watchlistNameElement = document.createElement('h3');
                watchlistNameElement.className = 'watchlist-card-name';
                watchlistNameElement.textContent = watchlistCoin.name;
                const watchlistPriceElement = document.createElement('h3');
                watchlistPriceElement.className = 'watchlist-card-price';
                watchlistPriceElement.textContent = `${watchlistCoin.current_price}`;
                const watchlistPriceHardCodedElement = document.createElement('h5');
                watchlistPriceHardCodedElement.className = 'watchlist-price-hardcoded'
                watchlistPriceHardCodedElement.textContent = 'Price:';

                //Delete button for each watchlist item_______________________
                const watchlistItemDeleteBtn = document.createElement('button');
                watchlistItemDeleteBtn.textContent = 'X';
                watchlistItemDeleteBtn.className = 'watchlist-delete-button';
                //Delete button click listener to DELETE request and to remove from global array
                watchlistItemDeleteBtn.addEventListener('click', () => {
                    deleteFromTheWatchlist(watchlistCoin)
                })


                //Appending headers to the div element_________________
                watchlistDivElement.appendChild(watchlistLogoElement);
                watchlistDivElement.appendChild(watchlistNameElement);
                watchlistDivElement.appendChild(watchlistPriceElement);
                watchlistDivElement.appendChild(watchlistItemDeleteBtn);
                watchlistDivElement.appendChild(watchlistPriceHardCodedElement);


                //Adding the coin to the watchlist array______________________________________****
                currentWatchlistCoinsArray.push(watchlistCoin.id);
            };


        }))
};

rerenderWatchlistData();

console.log(currentWatchlistCoinsArray);



//POST Function
function addingToTheWatchlistDB(coinObj) {
    fetch('http://localhost:3000/watchlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application.json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "id": coinObj.id,
            "symbol": coinObj.symbol,
            "name": coinObj.name,
            "image": coinObj.image,
            "current_price": coinObj.current_price,
            "market_cap": coinObj.market_cap,
            "total_volume": coinObj.total_volume,
            "shares_owned": 0
        })
    })
        .then(res => res.json())
        .then(data => console.log(data))
};


//DELETE Request Function 
function deleteFromTheWatchlist(coinObj) {
    fetch(`http://localhost:3000/watchlist/${coinObj.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => console.log(data))
};



