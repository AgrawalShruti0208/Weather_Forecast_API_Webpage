// DOM ELEMENT REFERENCE FOR PERFORMING JS OPERATIONS
    const dropdown = document.querySelector(".dropdown-content");
   

    // USER INTERACTIVE DOM ELEMENTS
        const cityInput = document.querySelector(".searchInput");
        const searchBtn = document.querySelector(".searchBtn");
        const locationBtn = document.querySelector("locationBtn");

    // DOM ELEMENT REFERENCE FOR PUTTING HTML INSIDE THIS TWO DISPLAY SECTIONS
        const weatherDisplay = document.querySelector(".weatherDisplay");
        const currentData = document.querySelector(".currentData");
        const dataCards = document.querySelector(".dataCards");

    
    // MY API KEY FOR MAKING API REQUESTS
        const API_KEY = "bfa6697d5b3f4ad188143fbd133c0b05";

//creating today's date because current weather api has sent date in an undesirable format
    let temp = new Date();
    let tempMonth = temp.getMonth()+1;
    let tempDate = temp.getDate();
    const currentDate = temp.getFullYear() +"-"+[[tempMonth<10]?["0"+tempMonth]:[tempMonth]]+"-"+[[tempDate<10]?["0"+tempDate]:[tempDate]];

//cityNames global variable to store records
    let cityNames;

// calling getArray() function to get array stored inside localStorage
    getArray();


// function getArray() to get array stored in localStorage if present, otherwise storing empty array
    function getArray(){

        let localStorageString = localStorage.getItem("cityNames");

        // if localStorage has data: convert string to array and adding it to drop-down list
            if(localStorageString){ 
                
                cityNames = JSON.parse(localStorageString);
                console.log("Retrieved array from localStorage",cityNames); 
                addCityToList(cityNames);
            
            }else{ //else, storing empty array inside cityNames and setting up an empty array inside localStorage
           
            cityNames = [];  
            setArray();
        }
        
    }
    
   
// Adding header styling when page is being scrolled
    const header = document.querySelector("header");

      window.addEventListener("scroll",()=>{
        if(window.scrollY >0){
          header.classList.add("style_header");
        }else{
          header.classList.remove("style_header");
        }
    })
    


//displayWeatherInfo(cityName,array,index) - to create html for display div's and insert them
/*
    *[if(index==0),create html for current weather data and insert html in current weather div],
    *[else,create html for 5-day weather data and insert html in 5-day forecast div]

*/
    const displayWeatherInfo=(cityName,data,index) =>{
        let html = "";
        cityInput.value=""; //clearing input
        

        if(index==0){ //Displaying information of current weather
            
            

            //creating html for the display section with extracted data
            html = `<h2 class="px-4 pt-4">${cityName} (${currentDate})</h2>
                    <div class="display w-[100%] flex gap-2 max-[768px]:gap-5 iPhone:gap-0">
                        <div class="details w-[60%] pl-4">
                            <h4 class="mt-2">Temperature: ${data.main.temp} °C</h4>
                            <h4>Wind: ${data.wind.speed} M/S</h4>
                            <h4>Humidity: ${data.main.humidity}%</h4>
                        </div>
                        <div class="currentImg pr-[2px] flex flex-col">
                            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" class="c_icon bg-white bg-opacity-45 rounded-full shadow-inner shadow-white hover:scale-[1.2]" alt="weather icon">
                            <h2 class="c_text pt-2">${data.weather[0].description}</h2>
                        </div>
                    </div>`;
            
            currentData.innerHTML = html;

            
        }else{ //Displaying Information of 5 Days Forecast
            
            //Creating Weather cards with extracted information from data
            html = `<li class="card bg-black bg-opacity-60  iPhone:bg-opacity-[0.7] ipadMini:opacity-[1]">
                            <h2 class="font-bold">${data.dt_txt.split(" ")[0]}</h2>
                            <div class="daysImg flex py-2">
                                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" class="w-[45%] bg-white bg-opacity-45 rounded-full shadow-inner shadow-white hover:scale-[1.2]" alt="weather icon">
                                <h4 class="pt-1 px-2 w-[65%] font-semibold">${data.weather[0].description}</h4>
                            </div>
                            <h4><b>Temp:</b> ${data.main.temp} °C</h4>
                            <h4><b>Wind:</b> ${data.wind.speed} M/S</h4>
                            <h4><b>Humidity:</b> ${data.main.humidity}%</h4>
                    </li>`;
                
                dataCards.innerHTML += html;
        }
    }

let n = 0;

//getWeatherInfo(CityName,lat,lon) - get weather info using passed parameters and displaying it
    /*->
        {
            *fetch current weather information using current weather API URL and parameters
                **if resolved, then calling displayWeatherInfo(cityName,data,0);..0 for index
            *fetch 5-Day weather information using weather API URL and parameters,if resolved, 
                **if resolved,Filter data as we require 5 weather data array: 5 Days forecast and store it in a array
                **Filtered record is sent to displayWeatherInfo(cityName,filteredRecord,array.length);,..array.length for index
            *catch(error)
        }
    */

    const getWeatherInfo = (cityName,lat,lon)=>{

            // do-while 
        do {   
            
            // clearing all the data inside both the display sections
                currentData.innerHTML = "";
                dataCards.innerHTML = "";
            
            
            //API for collecting current weather data having 1 Array
                const currentWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
            
            
            
            //fetching current weather data and displaying it
                fetch(currentWeatherAPI)
                .then(response => response.json())
                .then(data => {
                    console.log("current weather data fetched from API\n",data,"\n_______________________________________");
                    displayWeatherInfo(cityName,data,0);

                })
                .catch(()=>{
                    cityInput.value = "";
                    alert("An error occurred while fetching the weather forecast!");
                });

            //API for collecting weather data of 5 days within every 3 hours 
                const weatherDataAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

                fetch(weatherDataAPI)
                .then(response => response.json())
                .then(data => {
                    
                    console.log("Weather data for 5-Days fetched from API\n",data,"\n_______________________________________");
                    
                    //Have to filter data to get unique records for 5 days forecast and then display it
                        
                        //empty array to store only unique dates encountered
                        const uniqueDate = [];

                        // empty array to store unique records
                        const fiveDaysData = [];
                        
                        
                        //using foreach method on list array of data
                        data.list.forEach(record => {
                            /*for each record,
                                *extracting recordDate by splitting it using "whitespace" as separator and retreiving first part
                                *then this recordDate should not be inside uniqueDate array AND should not be equal to currentDate
                                    **if it passes both conditions, add recordDate to uniqueDate and record to fiveDaysData
                                    **call displayWeatherInfo with parameters: cityName,record and fiveDaysData array's length as index
                            */
                            const recordDate = record.dt_txt.split(" ")[0];
                            
                            if (!uniqueDate.includes(recordDate)&&(recordDate != currentDate)) {
                                    // // return uniqueDate.push(recordDate);
                                    uniqueDate.push(recordDate);
                                    fiveDaysData.push(record);
                                    displayWeatherInfo(cityName,record,fiveDaysData.length);
                                    
                            }
                                
                            
                        });
                        
                        console.log("Weather data filtered to get 5 days forecast records:\n",fiveDaysData,"\n_______________________________________");
  
                    
                })
                .catch(()=>{
                    // handling api fail to fetch error
                    cityInput.value = "";
                    alert("An error occurred while fetching the weather forecast!");
                });

            n = 1;

        } while (n==0);
    }

//getCityInfo()
    /*->getCityInfo()- Get Latitude and Longitude coordinates from city name using Direct Geocoding API tool
    {
        * Parameters required to fetch data : City name and apiid
        * getting City name from input text field
        * fetch data using API url and parameters
        * calling createCityList() array to add city to localStorage array and drop-down menu
        * getting required parameters: latitude and longitude from data
        * calling getWeatherInfo(CityName,lat,lon) function to get weather information using API and display it.
        * catch(error): displaying error if api request not fulfilled.
    }*/

    const getCityInfo=()=>{

        // adding animation to weatherDisplay section to appear on screen when user clicks button
        weatherDisplay.style.animation = "fade-in 3s ease-in-out forwards";
        
        
        //getting city name from input field and trimming all the white spaces
        const cityName = cityInput.value.trim();

        // if cityName is empty, return with alert to the user
        if(!cityName){
            return alert("Blank Input! Please enter a valid City Name.");
        }

        // API TO GET COORDINATES FROM CITY NAME
        const geocodingAPIUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

        // fetching data from the API
        fetch(geocodingAPIUrl)
        .then(response => response.json())
        .then(data =>{

            // IF USER ENTERED INVALID CITY NAME AS INPUT
            if(!data.length){
                cityInput.value = "";
                return alert(`No coordinates found for ${cityName},Enter valid Input.`);
                
            }
            // calling createCityList() array to add city to localStorage array and drop-down menu
            createCityList();
            console.log("Data fetched for finding city coordinates from name\n",data,"\n_______________________________________");
            
            // extracting latitude and longitude of the city from data
            const {lat,lon,name} = data[0];
            
            //calling to fetch and display weather data with all required parameters
            getWeatherInfo(name,lat,lon);

        }).catch(() => {
            // Handling API Fail
            alert("An error occurred while getting coordinates of city, Please try again!");
        });
    }

//getUserLocation() function to get user location coordinates and city name using reverse geocoding api
    /*->getUserLocation():
    {
        *The getCurrentPosition() method of the Geolocation interface is used to get the current position of the device.
        
            Syntax: navigator.geolocation.getCurrentPosition(success, error, options)
            Parameter Values:
            Parameter	Type	    Description
            success	 	Required.   A callback function that takes a Position object as its sole input parameter
            error	 	Optional.   A callback function that takes a PositionError object as its sole input parameter

            (i) function success(position): if successful to get position coordinates of user
            {
                *getting latitude,longitude values that are inside position.coords
                *getting city name from lat,lon parameters using reverse geocoding api tool from OpenWeather.com
                *calling getWeatherInfo(cityName,lat,lon) to get and display weather data of user's current location
                *catch(error) if cannot find name of city
            }
            
            (ii) function error(positionError): if failed to get location
            {
                *if (error == PERMISSION DENIED BY USER TO ACCESS THEIR LOCATION),send alert.
                *else, location request error
            }

        calling this method with above two callback functions: navigator.geolocation.getCurrentPosition(success, error);
    }*/

    const getUserLocation = () =>{

        //CLICK EVENT FOR LOCATION BUTTON
        weatherDisplay.style.animation = "fade-in 3s ease-in-out forwards";

        //callback function success, if getCurrentPosition() method gets successful
        function success(position){
            console.log("Position found through getCurrentPosition():\n",position,"\n_______________________________________");
            
            //got lan and lon coordinates from position object
            const {latitude,longitude} = position.coords;
           
            //getting City Name from coordinates using reverse geocoding API
            const reverseGeocodingAPI =`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

            // fetching data and processing it
            fetch(reverseGeocodingAPI)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched city name and other data from reverse geocoding API:\n",data,"\n_______________________________________");

                // extracting name of the city from fetched data
                const{name} = data[0];

                // calling getWeatherInfo() with parameters passed to get weather data from API and display it
                getWeatherInfo(name,latitude,longitude);

            }).catch(() => {
                // Handling API Fail
                alert("An error occurred while fetching the city name!Please Try again.");
            });
        }

        //callback function error, if getCurrentPosition() method fails
        function error(err){
            // alert if user denied permission for accessing location
            if (err.code === err.PERMISSION_DENIED) {
                alert("Location Request denied by User! Please reset location permission to access weather information.");
            } else { //alert for any other error
                alert("Error in fetching current location! Please reset location permission.");
            }
        }
        //getting current position coordinates of user using getCurrentPosition() method of navigator interface
        navigator.geolocation.getCurrentPosition(success,error);
    
    }

    

// displaying drop-down menu as soon as someone hovers mouse over input text field or click on it
    
    cityInput.addEventListener("mouseover",()=>{ //hovering mouse on it

        // if dropdown list has no text-content, then don't display it
        if(dropdown.length !=0)
            dropdown.style.display = "block";
    });

    cityInput.addEventListener("mousedown",()=>{ //clicking on input field to enter text
        if(dropdown.length !=0)
            dropdown.style.display = "block";
    });

    

//closing drop-down after user performs mouse click outside drop-down menu
    document.addEventListener("click",e =>{
        if(!dropdown.contains(e.target) && e.target != cityInput && e.target != searchBtn){
            dropdown.style.display = "none";
        }

    });

//function setArray() to store array consisting city names inside localStorage 
    function setArray(){

        
        // avoiding any empty element to be stored inside localStorage
        cityNames = cityNames.filter(function (el) {
            return el != "";
        });

        console.log("array passed to localStorage",cityNames);

        // convert array into string and store it in localStorage
        let string = JSON.stringify(cityNames); 
        localStorage.setItem("cityNames", string); 
    }

    
    
//function createCityList() to store valid city names entered by user inside an array     
  function createCityList(){

    //getting city name from input field
    let cityName = cityInput.value;
    
    //finding if city name already exist in array, if result index == -1 then only city name will be added to array
    let resultIndex = cityNames.findIndex(item => cityName.toLowerCase() === item.toLowerCase());
   
        if(resultIndex == -1){

            //if array length reaches 5 elements,then popping last element as we want  recent 5 city names history
            if(cityNames.length ==5){
                cityNames.pop();
            }
            
            //converting city name in a presentable manner
            cityName = cityName.charAt(0).toUpperCase() + cityName.substring(1).toLowerCase();

            //adding recent city name at first in array using unshift() method
            cityNames.unshift(cityName);
        }
       
        // calling setArray() function to set array in localStorage
        setArray();
       
        // calling addCityToList with created list as parameter to add array to drop-down list
        addCityToList(cityNames);
    }

// function addCityToList(array passed by either createList function or retrieved array from localStorage)
  function addCityToList(cityNames){
            
    // printing passed array to the console
    console.log("Recently searched valid city names: ",cityNames,"\n__________________________________");
    
    // if city names array's length is equal to 1 or less, set size of select box to 2
    if(cityNames.length <=1){
        dropdown.setAttribute("size", "2");
    
    }else{ //else set size of select box equal to length of cityNames array
       
        let length = ""+cityNames.length;
        dropdown.setAttribute("size", length);
    }

    // clearing drop-down menu
    let html = ``;
    dropdown.innerHTML = "";
    
    // adding each city name to drop-down by creating html 
    cityNames.forEach((city)=>{
        html = `<option>${city}</option>`;
        dropdown.innerHTML += html;
    })
        
        
    
  }

 

  //CHANGE EVENT FOR SELECTING CITY NAME FROM DROP-DOWN MENU
  dropdown.addEventListener("change",()=>{
    const cityName = dropdown.options[dropdown.selectedIndex].text;
    cityInput.value = cityName;
    getCityInfo();
    
  });

  


/* WEATHER API REQUESTS WORKFLOW: (notes for my understanding :)

    REQUIRED PARAMETERS FOR ANY API FETCH CALL IN OPENWEATHER.COM API:
        *Latitude [lat]	 "required"	
        *Longitude [lon]	"required"	
        *Your unique API key [appid]	"required"	 

    REQUIRED FUNCTIONS AND THEIR OPERATION:
       ->THREE API CALLS MADE:
            Geocoding API 
                *It is a simple tool that we have developed to ease the search for locations while working with geographic names and coordinates.
                *OpenWeather’s Geocoding API supports both the direct and reverse methods:

            1. DIRECT GEOCODING that converts the specified name of a location into the exact geographical coordinates;
            2. REVERSE GEOCODING that converts the geographical coordinates into the names of the location

            3. CURRENT WEATHER DATA API to access current weather data for any location on Earth using Latitude,Longitude and apiid



            WORK FLOW DIAGRAM:
                    ___________________________________________________________________________________________________________________                        
                    |    LocalStorage getItem => if data present, => convert data in array => Add to drop-down list AddToList(array)   |
                    |       [getArray()]     \                                                                                         |
                    |                         `->if not present, => assign array as empty =>set empty array in LocalStorage[setArray()]|           |
                    |__________________________________________________________________________________________________________________|
                                                                        ||
                                                                        ||
                                                                        ||
                                                                        \/
    ____________________________________________________________________________________________________________________________________________
    |PART 1: DISPLAYING WEATHER INFORMATION FROM CITY NAME USER ENTERED || PART 2: DISPLAYING WEATHER INFORMATION USING USER'S CURRENT LOCATION|
    |___________________________________________________________________||______________________________________________________________________|
                                    ||                                                                  ||                                                 
                                    ||                                                                  ||
                                    ||                                                                  ||
                                    \/                                                                  \/
              ______________________________________________                     _____________________________________________________                        
              | Called getCityInfo() on search Button click|                     | Called getUserLocation on Use Location Button click|
              |____________________________________________|                     |____________________________________________________| 
                        [called 2 functions] \                                                               /
                    ||                        \                                                             /
                    ||                         \                                                           /    
                    \/                          \                                                         /
_________________________________________        \    _____________________________________________      /                        
| Called createCityList() to create List |        `-> |    Called getWeatherInfo(name,lat,lon);    |  <-'
|________________________________________|            |____________________________________________|     
   ||                     ||                                                                  ||                                                 
   \/                     ||                                                                  ||
___________________       ||                                                                  ||
|called setArray()|       ||
|_________________|       \/                                                                  \/
    _________________________________                _____________________________________________________________________________________                        
    |Called addCityToList() to add  |                | Called =>displayWeatherInfo(cityName,data,0) for current Weather display           |
    |cityName array to dropdown list|                |        =>displayWeatherInfo(cityName,record,array.length) for 5-Day Weather display|
    |_______________________________|                |____________________________________________________________________________________| 
                          ||                                                                  ||                                                 
                          ||                                                                  ||
                          ||                                                                  ||
                          ||
                          \/                                                                  \/
    ________________________________________                       ______________________________________________                        
    |Added cityName array to dropdown list  |                     | Displayed current weather data and           |
    |AND Stored it in localStorage          |                     | 5-day forecast on any of the 2 buttons click.|
    |_______________________________________|                     |______________________________________________|  
    
    
        

*/ 