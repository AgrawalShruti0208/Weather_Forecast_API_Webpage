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

//creating today's date because api has sent date in a undesirable format
    let temp = new Date();
    let tempMonth = temp.getMonth()+1;
    let tempDate = temp.getDate();
    const currentDate = temp.getFullYear() +"-"+[[tempMonth<10]?["0"+tempMonth]:[tempMonth]]+"-"+[[tempDate<10]?["0"+tempDate]:[tempDate]];

//displayWeatherInfo(cityName,array,index) - to create html for display div's and insert them
    const displayWeatherInfo=(cityName,data,index) =>{
        let html = "";
        cityInput.value=""; //clearing input
        

        if(index==0){ //Displaying information of current weather
            
            

            //creating html for the display section with extracted data
            html = `<div class="details w-[70%] mt-4 pl-4 pt-3">
                        <h2>${cityName} (${currentDate})</h2>
                        <h4 class="mt-2">Temperature: ${data.main.temp} °C</h4>
                        <h4>Wind: ${data.wind.speed} M/S</h4>
                        <h4>Humidity: ${data.main.humidity}%</h4>
                    </div>
                    <div class="currentImg w-[30%] pr-4 pt-5">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" class="bg-white bg-opacity-45 rounded-full shadow-inner shadow-white hover:scale-[1.2]" alt="weather icon">
                        <h2 class="pt-2">${data.weather[0].description}</h2>
                    </div>`;
            
            currentData.innerHTML = html;

            
        }else{ //Displaying Information of 5 Days Forecast
            
            //Creating Weather cards with extracted information from data
            html = `<li class="card bg-black bg-opacity-60">
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


//getWeatherInfo(CityName,lat,lon) - get weather info using passed parameters and displaying it
    const getWeatherInfo = (cityName,lat,lon)=>{
            currentData.innerHTML = "";
            dataCards.innerHTML = "";
            weatherDisplay.style.visibility = "visible";
            
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
                cityInput.value = "";
                alert("An error occurred while fetching the weather forecast!");
            });
    }

//getCityInfo()- Get Latitude and Longitude coordinates from city name using Direct Geocoding API tool
    const getCityInfo=()=>{
        
        //getting city name from input field and trimming all the white spaces
        const cityName = cityInput.value.trim();

        if(!cityName){
            return alert("Blank Input! Please enter a valid City Name.");
        }

        const geocodingAPIUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

        fetch(geocodingAPIUrl)
        .then(response => response.json())
        .then(data =>{

            // IF USER ENTERED INVALID CITY NAME AS INPUT
            if(!data.length){
                cityInput.value = "";
                return alert(`No coordinates found for ${cityName},Enter valid Input.`);
                
            }

            console.log("Data fetched for finding city coordinates from name\n",data,"\n_______________________________________");
            
            // extracting latitude and longitude of the city from data
            const {lat,lon,name} = data[0];
            
            //calling to fetch and display weather data with all required parameters
            getWeatherInfo(name,lat,lon);

        }).catch(() => {
            alert("An error occurred while getting coordinates of city, Please try again!");
        });
    }

//CLICK EVENT FOR SEARCH BUTTON
searchBtn.addEventListener("click",getCityInfo);
searchBtn.addEventListener("click",()=>{
    weatherDisplay.style.animation = "fade-in 3s ease-in-out forwards";
    
});



// displaying drop-down menu as soon as someone hovers mouse over input text field
    cityInput.addEventListener("mouseover",()=>{
        dropdown.style.display = "block";
    })

    

//closing drop-down after 4 secs of user moving mouse away from input text field
    cityInput.addEventListener("mouseout",()=>{
        setTimeout(()=>{
            dropdown.style.display = "none";
        },4000);  
    })








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
        
      ->getCityInfo()- Get Latitude and Longitude coordinates from city name using Direct Geocoding API tool
        {
            * Parameters : City name and apiid
            * getting City name for input text field
            * fetch data using API url and parameters
            * getting required parameters: latitude and longitude from data
            * calling displayWeatherInfo(CityName,lat,lon) function to get weather information using API and display it.
            * catch(error): displaying error if api request not fulfilled.
        }

      ->displayWeatherInfo(CityName,lat,lon) - get weather info using passed parameters and displaying it
        {
            *fetch weather information using API URL and parameters
            *Filter data as we require 6 weather data array: 0th index is current weather and 1-5th index,5 Days forecast and store it in a array
            *Clearing input and clearing html inside specific display div's sections
            *For each array and index getting innerHtml based on our required condition by calling createHtml(CityName,array,index)
            *[if(index=0),insert HTML in current weather div][else, insert html in 5-day forecast div]
            *catch(error)
        }
    
      ->createHtml(CityName,array,index) - to return  innerHtml of display divs based on index value 
       {
            *if(index=0): create innerHTML for current weather display section and get data from array AND return it
            *else: create innerHTML for 5-day forecast cards and get data from array AND return it
       }
      
      ->getUserLocation() - to get the current position of the device
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
                    *calling displayWeatherInfo(cityName,lat,lon) to display weather data of user's current location
                    *catch(error) if cannot find name of city
                 }
                
                (ii) function error(positionError): if failed to get location
                 {
                    *if (error == PERMISSION DENIED BY USER TO ACCESS THEIR LOCATION),send alert.
                    *else, location request error
                 }

             calling this method with above two callback functions: navigator.geolocation.getCurrentPosition(success, error);
        }
    
    PART 1: DISPLAYING WEATHER INFORMATION FROM CITY NAME USER ENTERED -"City name known, coordinates unknown"
        [Click Event on searchBtn] => [getCityInfo()] => [displayWeatherInfo(CityName,lat,lon)] 
    
    PART 2: DISPLAYING WEATHER INFORMATION USING USER'S CURRENT LOCATION- "Coordinates known, city name unknown"
        [Click Event on LocationBtn] => [getUserLocation()] => [displayWeatherInfo(CityName,lat,lon)]

*/ 