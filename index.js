

// console.log('Test Test Test');

//Creating the Unordered List for the coins
// const mainCryptoDashboard = document.getElementById('crypto-dashboard');
// const newULElement = document.createElement('li');
// mainCryptoDashboard.appendChild(newULElement);

const mainULElement = document.querySelector('.cards');

fetch('http://localhost:3000/crypto')
    .then(res => res.json())
    .then(data => data.forEach((coin) => {

        //creating the list element
        const newLiElement = document.createElement('li');
        newLiElement.className = 'card';
        mainULElement.appendChild(newLiElement);

        //Creating the Div element
        const newDivElement = document.createElement('div');
        newLiElement.appendChild(newDivElement);

        //Creating all of the elements to add into this Div above
        const cryptoNameElement = document.createElement('h3');
        const cryptoLogoElement = document.createElement('h3');
        const cryptoPriceElement = document.createElement('h3');
        const cryptoVolumeElement = document.createElement('h3');
        const priceWordingElement = document.createElement('h3');
        const volumeWordingElement = document.createElement('h3');

        cryptoNameElement.textContent = coin.name;
        cryptoPriceElement.textContent = coin.current_price;
        cryptoLogoElement.textContent = 'PLACEHOLDER TEXT';
        cryptoVolumeElement.textContent = coin.total_volume;

        newDivElement.appendChild(cryptoNameElement);
        newDivElement.appendChild(cryptoLogoElement);
        newDivElement.appendChild(cryptoPriceElement);
        newDivElement.appendChild(cryptoVolumeElement);







    }))

