/*
console.log('Hello Jee babbar');

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
 
function renderweatherInfo(data){
     let newPara = document.createElement('p');
       newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`
    
       document.body.appendChild(newPara);
}


 async function fetchshowweather(){
    try{
let city="goa";

const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      
        const data = await response.json();
            console.log("Weather data:-> " ,  data);

      
       renderweatherInfo(data)
}
catch(err){
    //handle the error

}
//https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric
 }

async function getcustomweatherDetails(){
    try{
    let latitude= 18.6333;
    let longitude = 18.3333;

    let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?
                            lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);

    let data = await result.json();
    console.log(data);
    }
    catch(err){
        console.log("error found" , err); 
    }

    }
*/
const userTab = document.querySelector("[data-userweather]");
const searchTab = document.querySelector("[data-searchweather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-conatiner");
const searchForm = document.querySelector("[data-searchform]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially variables needd???
let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
//ek kam or pending hai  

function switchTab(newTab){
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        
        if(!searchForm.classList.contains("active")){
            //kya search form wala container is visible if yes then make it visible 
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active")

        }
        else{
            //mai phle search wale tab pr tha ab your weather tab visible karna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab mai your weather  tb me aagya hu , toh weather bhi display karna padega ,so lets check local storage first
            // for cordinates , if we haved saved yhem theer .
            getfromsessionstorage();
        }

    }
}

userTab.addEventListener("click",() => {
    switchTab(userTab);

});

searchTab.addEventListener("click",() => {
     switchTab(searchTab);
});
//check if cordinates are already present in session storage 
function getfromsessionstorage(){
    const localcordinates=sessionStorage.getItem("user-cordinates");
    if(!localcordinates){
        //agr local cordinates nhi mile
        grantAccessContainer.classList.add("active");

    }
    else{
        const cordinates = JSON.parse(localcordinates);
        fetchuserweatherinfo(cordinates);
    }
}
async function fetchuserweatherinfo(coordinates){
    const{lat,lon} = coordinates;
    //make grant conatiner invisible
    grantAccessContainer.classList.remove("active");
    //make loader
    loadingScreen.classList.add("active");
    //api call
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderweatherinfo(data);

    }
    catch(err){
        loadingScreen.classList.remove("active");

    }
}

function renderinfo(weatherInfo){
    //firstly , we have to fetch the element 

    const cityname = document.querySelector("[data-city name]");
    const countryIcon= document.querySelector("[data-countryicon]");
    const desc  =document.querySelector("[data-weatherDesc]");
    const weatherIcon  =document.querySelector("[data-weatherIcon]");
    const temp  =document.querySelector("[data-temp]");
    const windspeed =document.querySelector("[data-windspeed]");
    const humidity  =document.querySelector("[data-humidity]");
    const cloudiness =document.querySelector("[data-clodiness]");  
     console.log(weatherInfo); 
    // fetch values from weatherinfo object an d put if ui elements 
    cityname.innerText = weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144*108/${weatherInfo?.sys?.country.tolowercase()}.png`;
    desc.innerText= weatherInfo?.weather?.[0]?.description;
    weatherIcon.src =`https://openweathermap.org/img/w/$ {weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}°C `;
    windspeed.innerText = weatherInfo?.wind?.speed;
    humidity.innerText = weatherInfo?.main?.humidity;
    cloudiness.innerText = weatherInfo?.clouds?.all;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else{

    }
}

function showposition(position){
    const usercoordinates={
        lat: position.coords.latitude,
        lon : position.coords.longitude,
    }
}
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e) => {
    e.preventDefault();
    let cityName = searchInput.ariaValueMax;

    if(cityName === "")
    return;
else
    fetchSearchweatherInfo(cityName);

})

async function fetchSearchweatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
         renderweatherinfo(data); 


    }
    catch(err){

    }
     
}

