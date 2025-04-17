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
      datetime: jsonData.currentConditions.datetime,
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
const weatherData = await getWeatherData("niger");

console.log(weatherData);
