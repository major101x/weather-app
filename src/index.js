import "./styles.css";

/* Fetches and handles the weather data from the api */
async function getWeatherData(query) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?unitGroup=us&elements=datetime%2CdatetimeEpoch%2Cname%2Caddress%2CresolvedAddress%2Ctemp%2Cconditions%2Cdescription%2Cicon%2Csource&key=F8HDGC62FAZ5FJLNM6W6U8CD5&contentType=json`,
    );

    const jsonData = await response.json();

    console.log(jsonData);

    // Return only needed data
    return {
      datetime: jsonData.currentConditions.datetime.slice(0, 5),
      icon: jsonData.currentConditions.icon,
      temp: jsonData.currentConditions.temp,
      conditions: jsonData.currentConditions.conditions,
      resolvedAddress: jsonData.resolvedAddress,
      description: jsonData.description,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("data not found");
    } else {
      console.error("An error occurred. Please try again later");
    }
  }
}

/* Fetch weather data and store it */
function initializePage(initialQuery) {
  // Select all necessary elements
  const form = document.querySelector("form");
  const locationInput = document.querySelector("#location");
  const temperatureBtn = document.querySelector(".temperature-btn");
  const weatherCard = document.querySelector(".weather-card");
  const dateTimeDiv = document.querySelector(".date-time");
  const weatherIconImg = document.querySelector(".conditions img");
  const temperatureDiv = document.querySelector(".temperature");
  const conditionDiv = document.querySelector(".condition");
  const locationDiv = document.querySelector(".location");
  const descriptionDiv = document.querySelector(".description");
  const loadingDiv = document.querySelector(".loading");
  const errorDiv = document.querySelector(".error");

  /* Fetches intial data on page load and handles errors */
  function fetchOnPageLoad(initialQuery) {
    loadingDiv.style.display = "flex";
    getWeatherData(initialQuery)
      .then(function (data) {
        updateWeather(data);
      })
      .catch(function () {
        errorDiv.style.display = "flex";
        errorDiv.textContent = "Data not found";
      })
      .finally(function () {
        loadingDiv.style.display = "none";
      });
  }

  /* appends weather data from API to DOM  */
  function updateWeather({
    datetime,
    icon,
    temp,
    conditions,
    resolvedAddress,
    description,
  }) {
    errorDiv.style.display = "none";
    loadingDiv.style.display = "none";
    weatherCard.style.display = "flex";

    /* Dynamically imports images using webpack dynamic modules */
    import(
      /* webpackMode: "eager" */ `./assets/images/weather-icons/${icon}.svg`
    ).then(function (img) {
      weatherIconImg.src = img.default;
    });

    /* Appends data */
    dateTimeDiv.textContent = datetime;
    temperatureDiv.innerHTML = `${temp}&deg;F`;
    conditionDiv.textContent = conditions;
    locationDiv.textContent = resolvedAddress;
    descriptionDiv.textContent = description;
  }

  function convertTemperature() {
    /* separates the digits from the unit */
    const temperature = parseFloat(temperatureDiv.textContent.slice(0, -2), 10);
    const degree = temperatureDiv.textContent.slice(-2);

    /* convert to Celsius if value is in Fahrenheit and vice versa and updates temperature element */
    if (degree.slice(-1) === "F") {
      const temperatureToCelsius = (((temperature - 32) * 5) / 9).toFixed(1);
      temperatureBtn.innerHTML = "&deg;C";
      temperatureDiv.innerHTML = `${temperatureToCelsius.toString()}&deg;C`;
    } else {
      const temperatureToFahrenheit = ((temperature * 9) / 5 + 32).toFixed(1);
      temperatureBtn.innerHTML = "&deg;F";
      temperatureDiv.innerHTML = `${temperatureToFahrenheit.toString()}&deg;F`;
    }
  }

  /* Handles the calling of the API and passes errors to the frontend */
  async function handleSubmit() {
    const query = locationInput.value; // Sets query variable to input value

    if (query) {
      errorDiv.style.display = "none";
      weatherCard.style.display = "none";
      loadingDiv.style.display = "flex";

      const weatherData = await getWeatherData(query); // gets the data from the API
      loadingDiv.style.display = "none";

      if (weatherData) {
        updateWeather(weatherData);
      } else {
        errorDiv.style.display = "flex";
        errorDiv.textContent = "Data not found";
      }
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevents page refresh
    handleSubmit();
  });

  temperatureBtn.addEventListener("click", () => {
    convertTemperature(); // Converts the temperature
  });

  fetchOnPageLoad(initialQuery); // Fetches data on page load
}

initializePage("Lagos"); // Initializes the webpage
// console.log(weatherData);
