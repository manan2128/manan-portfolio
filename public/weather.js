import {condition, locationLabel, findCities, getWeather} from './weather-data.js';
const form = document.querySelector('#weather-form');
const input = document.querySelector('#weather-city');
const status = document.querySelector('#weather-status');
const choices = document.querySelector('#weather-choices');
const result = document.querySelector('#weather-result');
let active;
function start(message) {
  active?.abort();
  active = new AbortController();
  result.hidden = true;
  status.textContent = message;
  return active;
}
function report(error, request) {
  if (request !== active || error.name === 'AbortError') return;
  status.textContent = !navigator.onLine ? 'You are offline. Reconnect, then search again.' : error.name === 'TimeoutError' ? 'The weather request timed out. Please try again.' : error instanceof TypeError ? 'Could not connect to the weather service. Please try again.' : error.message;
}
async function showWeather(place) {
  const request = start('Loading weather for ' + locationLabel(place) + '…');
  try {
    const data = await getWeather(place, AbortSignal.any([request.signal, AbortSignal.timeout(15000)]));
    if (request !== active) return;
    const current = data.current;
    const value = (number, unit) => Number.isFinite(number) ? Math.round(number) + unit : 'Unavailable';
    document.querySelector('#weather-location').textContent = locationLabel(place);
    document.querySelector('#weather-temperature').textContent = value(current.temperature_2m, '°C');
    document.querySelector('#weather-condition').textContent = condition(current.weather_code);
    document.querySelector('#weather-feels').textContent = value(current.apparent_temperature, '°C');
    document.querySelector('#weather-humidity').textContent = value(current.relative_humidity_2m, '%');
    document.querySelector('#weather-wind').textContent = value(current.wind_speed_10m, ' km/h');
    document.querySelector('#weather-time').textContent = 'Weather time: ' + current.time.replace('T', ' at ') + ' (' + data.timezone + '). Model-based current conditions.';
    result.hidden = false;
    status.textContent = 'Weather loaded for ' + locationLabel(place) + '.';
  } catch (error) { report(error, request); }
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  const request = start('Finding cities…');
  choices.replaceChildren();
  try {
    const places = await findCities(input.value, AbortSignal.any([request.signal, AbortSignal.timeout(12000)]));
    if (request !== active) return;
    if (!places.length) { status.textContent = 'No cities found. Check the spelling or try a nearby city.'; return; }
    if (places.length > 1) {
      const hint = document.createElement('p'); hint.textContent = 'Matching places — select a different location if needed:'; choices.append(hint);
      for (const place of places) {
        const button = document.createElement('button'); button.type = 'button'; button.textContent = locationLabel(place);
        button.addEventListener('click', () => showWeather(place)); choices.append(button);
      }
    }
    await showWeather(places[0]);
  } catch (error) { report(error, request); }
});
