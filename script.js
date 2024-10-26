// fetching everything
// function 1
let usertab=document.querySelector('.usertab');
let searchtab=document.querySelector('.searchtab');
let grant_location_container=document.querySelector('.grant-location-container');
let search_weather=document.querySelector('.search-weather');
let loading_container=document.querySelector('.loading-container');
let main_display=document.querySelector('.main-display');

// we need two things, first an API KEY 
// second we need to know which tab we are currently on
// so that we can know if the request is to go to the new tab
// or stay on the same
let API_key ="58394c4dba65b9090c5471cc85c8851c";
let current_tab=usertab; // default maan liya
current_tab.classList.add("current_class");
current_tab.classList.add("active");
getFromSessionStorage();
usertab.addEventListener("click",()=>{
    switchTab(usertab);
})

searchtab.addEventListener("click",()=>{
    switchTab(searchtab);
    main_display.setAttribute('hidden', true);
})
let three_displays=document.querySelector('.three_displays');
function switchTab(clickedTab){
    if(clickedTab!=current_tab){ // saraa kaam tb krenge jb dono diff hon
        current_tab.classList.remove('current_class');
        current_tab=clickedTab;
        current_tab.classList.add('current_class');

        if(!search_weather.classList.contains('active')){
            main_display.classList.remove('active');// baaki sab ko invisible mark krdia 
            three_displays.classList.remove('active');
            grant_location_container.classList.remove('active');
            search_weather.classList.add('active');
        }
        else{ // search wale pr the ab your walee screen pr jana hai
            search_weather.classList.remove('active');
            main_display.classList.remove('active');
            three_displays.classList.remove('active');
            getFromSessionStorage(); // function to get the coordinates from session storage, if we have them there

        }
        
    }

}
function getFromSessionStorage(){
    const localcoordinates=sessionStorage.getItem("user-coordinates"); // format-> string , not a js object
    if(!localcoordinates){
        grant_location_container.classList.add("active"); // agr local coordinates stored nhi hai, kya kroge ?
        // it means user has not allowed location access yet 
    }
    else{ // coordinates pde hain
        const coords=JSON.parse(localcoordinates); // converts to js object
        //This is useful when you retrieve data that has been serialized into a JSON string, such as data from APIs,
        // or data stored in sessionStorage or localStorage,
        // and you want to use it as a regular JavaScript object.
        fetchWeatherInfo(coords); // yeh function coordinates ka use krke API call krega 
        // and weather details leke aayega
    }
}
async function fetchWeatherInfo(coords){
    const {lat,lon}=coords;
    // now make api call with this data
    // loader dikhana pdega, signifying ke call jaa rhi hai
    // grant wala UI htao
    grant_location_container.classList.remove("active");
    // loader dikhao for call maaro
    loading_container.classList.add("active");
    // api call
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
        const data= await response.json();
        // once fetched, remove the loading icon
        loading_container.classList.remove('active');
        main_display.classList.add("active");
        three_displays.classList.add('active');
        // render the data on ui
        renderWeatherinfo(data); // data ko diff diff elements me display krayega 
    }
    catch(err){
        loading_container.classList.remove('active');
        const new_ele=document.createElement('p');
        new_ele.textContent="Could not fetch weather for these coordinates!";
        document.body.appendChild(new_ele);
    }
}
function renderWeatherinfo(data){
    // first fetch all the elements in which data is to be put
    let city_name=document.querySelector('.city_name');
    let flag=document.querySelector('.flag');
    let description=document.querySelector('.description');
    let weather_icon=document.querySelector('.weather_icon');
    let temperature=document.querySelector('.temperature');
    let windspeed=document.querySelector('.windspeed');
    let humidity=document.querySelector('.humidity');
    let clouds=document.querySelector('.clouds');
    // all fetched
    city_name.textContent =data?.name;
    flag.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`
    flag.style.height = '30px';
    flag.style.width = '30px';
    flag.style.visibility = 'visible';

    // description is inside weather
    // weather is an array having a single element
    description.textContent=data?.weather?.[0]?.description;
    
    weather_icon.src="http://openweathermap.org/img/w/" + data?.weather?.[0]?.icon + ".png"; // api se fetch krlia 
    temperature.textContent=data?.main?.temp+" F";
    // temperature.style.fontSize = '40px';  // Set font size to 40px
    temperature.style.fontWeight = 'bold';
    windspeed.textContent=data?.wind?.speed+" m/s";
    humidity.textContent=data?.main?.humidity+" %";
    clouds.textContent=data?.clouds?.all+" %";
}
let grant_btn=document.querySelector('.grant_access_button');
grant_btn.addEventListener("click",()=>{
    geoLocation();
})
function geoLocation(){
    if(navigator.geolocation){ //geolocation api is supported or not
        navigator.geolocation.getCurrentPosition(showPosition); // callback function
        // The Geolocation API internally handles the process of getting the user's location,
        // and when it successfully does so, it automatically calls the callback function (i.e., showPosition) 
        //with the location data (i.e., the position object) as an argument.
    }
    else{
        alert('No geolocation support available');
    }
    
}
function showPosition(position){
    const user_coordinates={ // object with key value pairs
        lat:position.coords.latitude,
        lon:position.coords.longitude
    }
    // sessionStorage: It's a web storage object that allows you to store key-value pairs in the 
    //browser for the duration of the session. Data stored here is cleared when the page session ends

    //sessionStorage only stores data as strings, so if you want to store something like an object or array,
    // you must convert it to a string using JSON.stringify()
    sessionStorage.setItem("user-coordinates",JSON.stringify(user_coordinates));
    fetchWeatherInfo(user_coordinates);
}
// search button work flow
// click -> city name input -> api call -> data, parse -> render 

let searchBtn=document.querySelector('.searchBtn');
searchBtn.addEventListener("click",handleSearch);
let inputSpace=document.querySelector('.inputSpace');
inputSpace.addEventListener("keydown",(event)=>{
    if(event.key=="Enter"){
        handleSearch();
    }
})
async function handleSearch(){
    loading_container.classList.add("active");
    main_display.classList.remove("active");
    three_displays.classList.remove('active');
    grant_location_container.classList.remove("active");
    let city=inputSpace.value;
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);
        const data= await response.json();
        // once fetched, remove the loading icon
        loading_container.classList.remove('active');
        main_display.classList.add("active");
        three_displays.classList.add('active');
        // render the data on ui
        renderWeatherinfo(data); // data ko diff diff elements me display krayega 
    }
    catch(err){
        loading_container.classList.remove('active');
        alert("Not a valid city name");
    }
}
