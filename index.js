

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








    }))

