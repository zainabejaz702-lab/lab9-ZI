/******************************************************************************
 * Name: Zainab Ijaz
 * Course: CS 246
 * Lab: Lab 9 - Go, Fetch!
 * Date: 04/16/2026
 *
 * Description:
 * This program uses the Open-Meteo API to fetch current weather data for the
 * user's latitude and longitude. It retrieves temperature, cloud cover, and
 * wind speeds at 10m, 80m, 120m, and 180m, then prints categorized weather
 * results to the console.
 *
 * Notes / Bugs:
 * - Make sure LATITUDE and LONGITUDE are set to your current location.
 * - This program requires internet access to contact the Open-Meteo API.
 * - If the API is unavailable or the request fails, an error message is shown.
 ******************************************************************************/

// Store the current latitude and longitude.
// Replace these values with your actual current coordinates.
const LATITUDE = 43.0389;
const LONGITUDE = -87.9065;

/**
 * Returns a temperature label based on Fahrenheit.
 * @param {number} tempF - Temperature in degrees Fahrenheit
 * @returns {string} The temperature category
 */
function getTemperatureLabel(tempF) {
  if (tempF < 32) {
    return "Below freezing";
  } else if (tempF === 32) {
    return "Freezing";
  } else {
    return "Above freezing";
  }
}

/**
 * Returns a cloud cover label based on cloud percentage.
 * Clear: 0-5%
 * Few: 6-25%
 * Scattered: 26-50%
 * Broken: 51-87%
 * Overcast: 88-100%
 * @param {number} cloudCover - Cloud cover percentage
 * @returns {string} The cloud cover category
 */
function getCloudCoverLabel(cloudCover) {
  if (cloudCover >= 0 && cloudCover <= 5) {
    return "Clear";
  } else if (cloudCover <= 25) {
    return "Few";
  } else if (cloudCover <= 50) {
    return "Scattered";
  } else if (cloudCover <= 87) {
    return "Broken";
  } else {
    return "Overcast";
  }
}

/**
 * Returns a label describing wind behavior across heights.
 * @param {number[]} windSpeeds - Wind speeds from lowest to highest height
 * @returns {string} The wind behavior category
 */
function getWindBehaviorLabel(windSpeeds) {
  let increasing = true;
  let decreasing = true;

  // Compare each wind speed with the previous one.
  for (let i = 1; i < windSpeeds.length; i++) {
    if (windSpeeds[i] <= windSpeeds[i - 1]) {
      increasing = false;
    }

    if (windSpeeds[i] >= windSpeeds[i - 1]) {
      decreasing = false;
    }
  }

  // Determine which label best describes the pattern.
  if (increasing) {
    return "Windier higher";
  } else if (decreasing) {
    return "Windier lower";
  } else {
    return "Mixed wind behavior";
  }
}

/**
 * Fetches weather data from Open-Meteo and prints the required results.
 */
async function fetchWeatherData() {
  // Build the API URL using the required current weather fields.
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}` +
    `&longitude=${LONGITUDE}` +
    `&current=temperature_2m,cloud_cover,wind_speed_10m,wind_speed_80m,wind_speed_120m,wind_speed_180m` +
    `&temperature_unit=fahrenheit&wind_speed_unit=mph`;

  try {
    // Send the request to the API.
    const response = await fetch(url);

    // Stop if the server response is not successful.
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Convert the response to JSON.
    const data = await response.json();

    // Access the current weather data.
    const current = data.current;

    // Extract the required values.
    const temperature = current.temperature_2m;
    const cloudCover = current.cloud_cover;
    const wind10 = current.wind_speed_10m;
    const wind80 = current.wind_speed_80m;
    const wind120 = current.wind_speed_120m;
    const wind180 = current.wind_speed_180m;

    // Compute the required labels.
    const temperatureLabel = getTemperatureLabel(temperature);
    const cloudCoverLabel = getCloudCoverLabel(cloudCover);
    const windBehaviorLabel = getWindBehaviorLabel([wind10, wind80, wind120, wind180]);

    // Print the final formatted output.
    console.log(`Temperature: ${temperatureLabel}`);
    console.log(`Cloud Cover: ${cloudCoverLabel}`);
    console.log(`Wind Behavior: ${windBehaviorLabel}`);
  } catch (error) {
    // Print a message if something goes wrong.
    console.error("Error fetching weather data:", error.message);
  }
}

// Invoke the asynchronous weather function.
fetchWeatherData();