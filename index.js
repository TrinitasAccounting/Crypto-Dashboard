


//Setting global variables that I can access to filter from_____
let currentWatchlistCoinsArray = [];
let currentSelectedAsset = [];
let currentSelectedAssetSharesOwned = null;
let currentlyDisplayedSharesOwnedAsset = 0;




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

    const inputAmount = depositWithdrawInputBox.value;
    const amountToAddToTheWalletDeposit = Number(inputAmount) + Number(currentWalletAmount);
    const amountToAddToTheWalletWithdraw = Number(currentWalletAmount) - Number(inputAmount);

    //Using Radio Buttons to determine if the amount is added or subtracted from the currentWalletAmount_____
    const radioButtonDeposit = document.querySelector('#deposit');
    const radioButtonWithdraw = document.querySelector('#withdraw');

    if (!radioButtonDeposit.checked || !radioButtonWithdraw) {
        alert('Transaction was not processed.\nPlease select "Deposit" or "Withdraw"')
    }
    else if (radioButtonDeposit.checked) {
        changeTheWalletAmount(amountToAddToTheWalletDeposit)
    }
    else if (radioButtonWithdraw.checked) {
        changeTheWalletAmount(amountToAddToTheWalletWithdraw)
    }


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

                    if (currentSelectedAsset.includes(watchlistCoin.name)) {

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




            };
            //Making the # of Shares Owned Value populate
            // numberOfSharesOwned(watchlistCoin);


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



//Selecting an Asset Function____________________________________________________________________________________________
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

    currentSelectedAsset = coin.name;
    currentSelectedAssetSharesOwned = coin.shares_owned;

    displaySelectedAssetSharesOwned(currentSelectedAssetSharesOwned);

    // console.log(currentSelectedAssetSharesOwned);

    // function sharesOwnedDisplayingSelectedAsset() {

    // }

    // removeOldSharesOwnedHeaderElement();
    // numberOfSharesOwned(coin);


};





//Shares Owned Fetch GET Request __________________________________________________________________________________________
//_________________________________________________________________________________________________________________________

//Fetching and Populating the Shares Owned value when an item is clicked from the watchlist
// function numberOfSharesOwned(coinObj) {

//     fetch(`http://localhost:3000/watchlist`)
//         .then(res => res.json())
//         .then(data => data.forEach((coinObj) => {
//             if (currentSelectedAsset.includes(coinObj.name)) {
//             }
//         }))
// }


// function numberOfSharesOwned(coinObj) {

//     fetch(`http://localhost:3000/watchlist`)
//         .then(res => res.json())
//         .then(data => data.forEach(() => {

//         }))
//             }


//test function to do shares owned chart


function displaySelectedAssetSharesOwned(coinShares) {

    const sharesOwnedHeaderElement = document.querySelector('.shares-owned-header');
    sharesOwnedHeaderElement.textContent = coinShares;

}







//Setting an initial value for the shares owned
// function totalSharesOwned() {
// fetch('http://localhost:3000/watchlist')
//     .then(res => res.json())
//     .then(data => data.reduce((acc, coinObj) => {
//         acc = acc + Number(coinObj.shares_owned);
//         return acc;
//     }))


// }

console.log(currentSelectedAsset);












//This is the function that removes the previously attached header for the shares owned
// function removeOldSharesOwnedHeaderElement() {
//     const sharesOwnedOldHeader = document.querySelector('.header-shares-owned-value');
//     sharesOwnedOldHeader.remove();

// }
// removeOldSharesOwnedHeaderElement();


// function toAddTemporaryShares(coin) {
//     fetch('http://localhost:3000/crypto', {
//         method: 'PATCH',
//         headers: {
//             'COntent-Type': 'application/json',
//             'Accept': 'application/json'
//         },
//         body: JSON.stringify({
//             coin[shares_owned]: 0
//         })
//     })
//         .then(res => res.json())
//         .then(data => console.log(data))
// }


// toAddTemporaryShares()