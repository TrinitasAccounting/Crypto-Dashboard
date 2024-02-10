


//Setting global variables that I can access to filter from_____
let currentWatchlistCoinsArray = [];
let currentSelectedAsset = [];
let currentSelectedAssetFullCoin = [];
let currentSelectedAssetSharesOwned = null;
// let currentlyDisplayedSharesOwnedAsset = 0;
let currentDisplayedTradingVolumeAsset = null;



// function commas(str) {
//     return str.replace(/.(?=(?:.{3})+$)/g, '$&,');
// }




//Wallet Amount - Get Request
fetch('http://localhost:3000/wallet')
    .then(res => res.json())
    .then(data => data.forEach((walletdb) => {

        //Adding the wallet value amount
        const walletAmountValue = document.querySelector('.wallet-amount');
        walletAmountValue.textContent = `$ ${walletdb.wallet_amount}`

        currentWalletAmount = walletdb.wallet_amount;
        // console.log(currentWalletAmount);

    })
    )


//Deposit/Withdraw Form - Event Listeners_________________________________________________________________________________
//________________________________________________________________________________________________________________________

const depositWithdrawSubmitForm = document.querySelector('.main-deposit-form');
const depositWithdrawInputBox = document.querySelector('.amount-input-box');

//ADD AN EVENT LISTENER TO THIS BOX OR SUBMIT BUTTON______________________________________________________________________

depositWithdrawSubmitForm.addEventListener('submit', (event) => {
    event.preventDefault();

    //Calculating dollar value to add/subtract and rounding it to 2 decimal points
    const inputAmount = depositWithdrawInputBox.value;
    const amountToAddToTheWalletDeposit = Number(inputAmount) + Number(currentWalletAmount);
    const amountToAddToTheWalletDepositRounded = amountToAddToTheWalletDeposit.toFixed(2);
    const amountToAddToTheWalletWithdraw = Number(currentWalletAmount) - Number(inputAmount);
    const amountToAddToTheWalletWithdrawRounded = amountToAddToTheWalletWithdraw.toFixed(2);

    //Using Radio Buttons to determine if the amount is added or subtracted from the currentWalletAmount_____
    const radioButtonDeposit = document.querySelector('#deposit');
    const radioButtonWithdraw = document.querySelector('#withdraw');

    if (radioButtonDeposit.checked) {
        changeTheWalletAmount(amountToAddToTheWalletDepositRounded)
    }
    else if (radioButtonWithdraw.checked) {
        changeTheWalletAmount(amountToAddToTheWalletWithdrawRounded)
    }
    else {
        alert('Transaction was not processed.\nPlease select "Deposit" or "Withdraw"')
    };


})




// Adding or Removing from wallet usign PATCH request
function changeTheWalletAmount(dollarAmount) {
    fetch('http://localhost:3000/wallet/1', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'applciation/json'
        },
        body: JSON.stringify({
            "wallet_amount": dollarAmount
        }
        )
    })
};









//Main Fetch to get all Asset Data___________________________________________________________________________________________
//___________________________________________________________________________________________________________________________

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

                //Delete button click listener to DELETE request and to remove from global array. 
                watchlistItemDeleteBtn.addEventListener('click', () => {
                    //restricts removal of an asset from the watchlist if outstanding shares are still owned
                    if (watchlistCoin.shares_owned === 0) {
                        deleteFromTheWatchlist(watchlistCoin)
                    }
                    else {
                        alert('Due to financial regulations, any asset in which you own shares.\nThese owned assets cannot be removed from the watchlist.\nPlease sell all shares and try again!')
                    }
                })


                //Appending headers to the div element_________________
                watchlistDivElement.appendChild(watchlistLogoElement);
                watchlistDivElement.appendChild(watchlistNameElement);
                watchlistDivElement.appendChild(watchlistPriceElement);
                watchlistDivElement.appendChild(watchlistItemDeleteBtn);
                watchlistDivElement.appendChild(watchlistPriceHardCodedElement);
                watchlistDivElement.appendChild(watchlistItemDeleteBtn);


                //Adding the coin to the watchlist array______________________________________****
                currentWatchlistCoinsArray.push(watchlistCoin.id);





                //Adding a click event listener to the Selected Asset item, that adds to the Selected Item in the top right
                watchlistDivElement.addEventListener('click', () => {

                    if (currentSelectedAsset.includes(watchlistCoin.id)) {   //changed from watchlistCoin.name

                    }
                    else if (currentSelectedAsset.length > 0) {
                        //need to remove the currently selected and add the new one
                        const mainSelectedAssetDiv2 = document.querySelector('.selected-asset-container');
                        mainSelectedAssetDiv2.innerHTML = '';

                        selectingAnAssetToView(watchlistCoin);
                    }
                    else {
                        //need to just add the newly selected item
                        selectingAnAssetToView(watchlistCoin);
                    }
                })





                //creating the Sell All Hover button_______________________________________________-
                const sellAllSharesButtonOnHover = document.createElement('button');
                sellAllSharesButtonOnHover.className = 'sell-all-button-not-hovering';
                sellAllSharesButtonOnHover.textContent = 'Sell All Shares';

                //adding the event listener to the button
                sellAllSharesButtonOnHover.addEventListener('click', () => {

                    //PATCH to shares_owned for current coin SELL ALL
                    fetch(`http://localhost:3000/watchlist/${watchlistCoin.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            shares_owned: 0
                        })
                    })

                    //PATCH to wallet ammount (adding the shares owned * share price value to the currentWallet Amount)

                    const dollarAmountChangeOnSellAll = Number(currentWalletAmount) + (Number(watchlistCoin.current_price) * Number(watchlistCoin.shares_owned));
                    changeTheWalletAmount(Number(dollarAmountChangeOnSellAll.toFixed(2)));

                    //Adding that Sell All will also delete it from the watchlist
                    deleteFromTheWatchlist(watchlistCoin)

                })



                watchlistDivElement.appendChild(sellAllSharesButtonOnHover);

                //Event Listener for hovering to show sell all shares (changes the className and CSS: display: 'none' changes) 
                watchlistDivElement.addEventListener('mouseover', () => {
                    // console.log(watchlistCoin.shares_owned);
                    if (watchlistCoin.shares_owned > 0) {
                        sellAllSharesButtonOnHover.className = 'sell-all-button-hovering';


                    }
                })

                //Event listener for when mouse stops hovering over the element
                watchlistDivElement.addEventListener('mouseout', () => {
                    sellAllSharesButtonOnHover.className = 'sell-all-button-not-hovering';
                })




            };
        }))
};

rerenderWatchlistData();






//POST Function__________________________________________________________________________________________________________
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


//DELETE Request Function ________________________________________________________________________________________________
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








//Selecting an Asset Function (Top Right of Screen)______________________________________________________________________
//_______________________________________________________________________________________________________________________

// let test = null;

function selectingAnAssetToView(coin) {


    //Finding the top selected Div to attach to 
    const mainSelectedAssetDiv = document.querySelector('.selected-asset-container');

    //creating and appending the new headers
    const newSelectedAssetName = document.createElement('h2');
    newSelectedAssetName.textContent = coin.name;
    newSelectedAssetName.className = 'selected-asset-name';
    const newSelectedAssetLogo = document.createElement('img')
    newSelectedAssetLogo.src = coin.image;
    newSelectedAssetLogo.className = 'selected-asset-logo';
    mainSelectedAssetDiv.appendChild(newSelectedAssetLogo);
    mainSelectedAssetDiv.appendChild(newSelectedAssetName);

    if (currentSelectedAsset.length === 0) {
        //Removing the other place holder header in the HTML file ******after the first is removed it is finding a null header that its trying to remove
        const temporarySelectedAssetHeader = document.querySelector('.no-selected-asset');
        temporarySelectedAssetHeader.remove();
    }
    else {

    }

    currentSelectedAsset = coin.id;
    currentSelectedAssetFullCoin = coin;
    currentSelectedAssetSharesOwned = coin.shares_owned;
    currentDisplayedTradingVolumeAsset = coin.total_volume;


    //this is giving the BUY and SELL shares buttons there functionality because the currentSelectedAsset is losing its value everytime due to rerending
    buyingSellingSharesOfSelectedAsset(currentSelectedAsset, coin);//************************************************************************** */



    //displaying the shares value by calling this function to change the textContent
    displaySelectedAssetSharesOwned(currentSelectedAssetSharesOwned);
    //displaying the trading volume for the selected asset 
    displaySelectedAssetVolume(currentDisplayedTradingVolumeAsset);
};









//Shares Owned Fetch GET Request __________________________________________________________________________________________
//_________________________________________________________________________________________________________________________


//changing the textContent of the shares owned header 
function displaySelectedAssetSharesOwned(coinShares) {

    const sharesOwnedHeaderElement = document.querySelector('.shares-owned-header');
    sharesOwnedHeaderElement.textContent = coinShares.toFixed(6);

}
//changing the textContent of the trading volume header
function displaySelectedAssetVolume(coinVolume) {
    const tradingVolumeHeaderElement = document.querySelector('.trading-volume-display');
    tradingVolumeHeaderElement.textContent = coinVolume;
}










//Buy and Sell Buttons functional event listeners______________________________________________________________________
//_____________________________________________________________________________________________________________________


//Hoping that I can put this into a function and access it inside of where I defined the currentSelectedAsset value because it rerenders everytime that is called

function buyingSellingSharesOfSelectedAsset(currentSelectAsset, coin) {
    //grabbing the input box
    const inputBuySellShares = document.querySelector('.input-buysell');

    //grabbing the form itself
    const inputBuySellSharesForm = document.querySelector('.input-buy-sell-form');

    //grabbing the Buy/Sell buttons
    const buySharesButton = document.querySelector('.button-buy');
    const sellSharesButton = document.querySelector('.button-sell');

    //adding event listener to the BUY button
    inputBuySellSharesForm.addEventListener('submit', (event) => {
        event.preventDefault();

        //input box with the actual value
        const inputBuySellSharesValue = inputBuySellShares.value;
        // console.log(inputBuySellSharesValue);


        //Calculating the share to dollar amount conversion rate for BUY BUY
        const newSharesBoughtToDollarsSpentRatio = Number(inputBuySellSharesValue) / Number(coin.current_price);
        console.log(currentSelectAsset.current_price);

        const newSharesOwnedTotalValueForBuy = Number(newSharesBoughtToDollarsSpentRatio) + Number(currentSelectedAssetSharesOwned);

        //Calculating the share to dollar amount conversion rate for SELL SELL
        const newSharesOwnedTotalValueForSell = Number(currentSelectedAssetSharesOwned) - Number(newSharesBoughtToDollarsSpentRatio);


        //if it was the BUY or Sell button that was clicked, && if there is no watchlist asset selected then do nothing
        if (currentSelectedAsset.length === 0) {
            alert('Please select a Crypto Asset to BUY or SELL');
        }
        else if (event.submitter.className === 'button-buy') {

            //limiting someone from buying more shares than they have dollars in their wallet
            if (Number(inputBuySellSharesValue) > currentWalletAmount) {
                alert('no can do poor man');
            }
            else {

                //PATCH to shares_owned for current coin BUY
                fetch(`http://localhost:3000/watchlist/${currentSelectedAsset}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        shares_owned: newSharesOwnedTotalValueForBuy
                    })
                    // .then(res => res.json())
                    // .then(data => console.log(data))
                })

                //PATCH to wallet ammount using already defined function
                const dollarAmountChange = Number((inputBuySellSharesValue * -1)) + Number(currentWalletAmount);
                changeTheWalletAmount(Number(dollarAmountChange.toFixed(2)));


            }

        }
        else if (event.submitter.className === 'button-sell') {

            //limiting selling more shares than one owns currently
            if (Number(newSharesBoughtToDollarsSpentRatio) > Number(currentSelectedAssetSharesOwned)) {
                alert('No can do poor man');
            }
            else {


                //PATCH to shares_owned for current coin SELL
                fetch(`http://localhost:3000/watchlist/${currentSelectedAsset}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        shares_owned: newSharesOwnedTotalValueForSell
                    })
                })

                //PATCH to wallet ammount using already defined function
                const dollarAmountChange = Number(currentWalletAmount) + Number(inputBuySellSharesValue);
                changeTheWalletAmount(Number(dollarAmountChange.toFixed(2)));

            }

        }


    })
};










