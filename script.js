const userLocation = document.getElementById("userLocation"),
  converter = document.getElementById("converter"),
  weatherIcon = document.querySelector(".weatherIcon"),
  temperature = document.querySelector(".temperature"),
  feelsLike = document.querySelector(".feelsLike"),
  description = document.querySelector(".description"),
  date = document.querySelector(".date"),
  city = document.querySelector(".city"),
  HValue = document.getElementById("HValue"),
  WValue = document.getElementById("WValue"),
  SRValue = document.getElementById("SRValue"),
  SSValue = document.getElementById("SSValue"),
  CValue = document.getElementById("CValue"),
  UVValue = document.getElementById("UVValue"),
  PValue = document.getElementById("PValue"),
  Forecast = document.querySelector(".Forecast");
WEATHER_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=e011ff584ef01a8b6ea237a7a9d5fde6&q=`;
WEATHER_DATA_ENDPOINT = `https://api.openweathermap.org/data/3.0/onecall?appid=e011ff584ef01a8b6ea237a7a9d5fde6&exclude=minutely&units=metric&`;
function findUserLocation() {
  Forecast.innerHTML = "";
  fetch(WEATHER_API_ENDPOINT + userLocation.value)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod != "" && data.cod != 200) {
        alert(data.message);
        return;
      }
      console.log(data);
      city.innerHTML = data.name + ", " + data.sys.country;
      weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;
      fetch(
        `${WEATHER_DATA_ENDPOINT}lon=${data.coord.lon}&lat=${data.coord.lat}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          temperature.innerHTML = TempConverter(data.current.temp);
          feelsLike.innerHTML = "Feels like " + data.current.feels_like;
          description.innerHTML =
            `<i class="fa-brands fa-cloudversify"></i> ` +
            data.current.weather[0].description;
          const options = {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          };
          date.innerHTML = getLongFormateDateTime(
            data.current.dt,
            data.timezone_offset,
            options
          );
          HValue.innerHTML =
            Math.round(data.current.humidity) + `<span>%</span>`;
          WValue.innerHTML =
            Math.round(data.current.wind_speed) + `<span> m/s</span>`;
          const options1 = {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          };
          SRValue.innerHTML = getLongFormateDateTime(
            data.current.sunrise,
            data.timezone_offset,
            options1
          );
          SSValue.innerHTML = getLongFormateDateTime(
            data.current.sunset,
            data.timezone_offset,
            options1
          );
          CValue.innerHTML = data.current.clouds + `<span>%</span>`;
          UVValue.innerHTML = data.current.uvi;
          PValue.innerHTML = data.current.humidity + `<span>hPa</span>`;
          data.daily.forEach((weather) => {
            let div = document.createElement("div");
            const options = {
              weekday: "long",
              month: "long",
              day: "numeric",
            };
            let daily = getLongFormateDateTime(weather.dt, 0, options).split(
              " at "
            );
            div.innerHTML = daily[0];
            div.innerHTML += `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" />`;
            div.innerHTML += `<p class="forecast-desc">${weather.weather[0].description}</p>`;
            div.innerHTML += `<span><span>${TempConverter(
              weather.temp.min
            )}</span>&nbsp;<span>${TempConverter(
              weather.temp.max
            )}</span></span>`;
            Forecast.append(div);
          });
        });
    });
}
function formatUnixTime(dtValue, offSet, options = {}) {
  const date = new Date((dtValue + offSet) * 1000);
  return date.toLocaleTimeString([], { timeZone: "UTC", ...options });
}
function getLongFormateDateTime(dtValue, offSet, options) {
  return formatUnixTime(dtValue, offSet, options);
}
function TempConverter(temp) {
  let tempValue = Math.round(temp);
  let message = "";
  if (converter.value == "°C") {
    message = tempValue + "<span>" + "\xB0C</span>";
  } else {
    let ctof = (tempValue * 9) / 5 + 32;
    message = ctof + "<span>" + "\xB0F</span>";
  }
  return message;
}
