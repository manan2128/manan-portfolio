export function condition(code) {
  if (code === 0) return 'Clear sky';
  if ([1, 2].includes(code)) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if ([45, 48].includes(code)) return 'Fog';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if ([61, 63, 65, 66, 67].includes(code)) return 'Rain';
  if ([71, 73, 75, 77].includes(code)) return 'Snow';
  if ([80, 81, 82].includes(code)) return 'Rain showers';
  if ([85, 86].includes(code)) return 'Snow showers';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Conditions unavailable';
}
export const locationLabel = place => [...new Set([place.name, place.admin1, place.country].filter(Boolean))].join(', ');
async function getJson(url, signal) {
  const response = await fetch(url, {signal});
  if (!response.ok) throw new Error(response.status === 429 ? 'Weather service is busy. Please try again in a minute.' : 'Weather service is unavailable. Please try again shortly.');
  const data = await response.json();
  if (data.error) throw new Error('Weather service could not complete this request. Please try again.');
  return data;
}
export async function findCities(query, signal) {
  const name = query.trim();
  if (name.length < 2 || name.length > 100) throw new Error('Enter a city name between 2 and 100 characters.');
  const params = new URLSearchParams({name, count:'5', language:'en', format:'json'});
  const data = await getJson('https://geocoding-api.open-meteo.com/v1/search?' + params, signal);
  return (data.results || []).filter(p => Number.isFinite(p.latitude) && Number.isFinite(p.longitude));
}
export async function getWeather(place, signal) {
  const params = new URLSearchParams({latitude:place.latitude, longitude:place.longitude, current:'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m', timezone:'auto', temperature_unit:'celsius', wind_speed_unit:'kmh'});
  const data = await getJson('https://api.open-meteo.com/v1/forecast?' + params, signal);
  if (!data.current || !Number.isFinite(data.current.temperature_2m) || !data.current.time) throw new Error('No current weather is available for this location. Try another city.');
  return data;
}
