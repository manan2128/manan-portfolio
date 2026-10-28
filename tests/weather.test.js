import test from 'node:test';
import assert from 'node:assert/strict';
import {condition, locationLabel, findCities, getWeather} from '../public/weather-data.js';

test('weather conditions and location labels include meaningful fallbacks', () => {
  assert.equal(condition(0), 'Clear sky');
  assert.equal(condition(95), 'Thunderstorm');
  assert.equal(condition(null), 'Conditions unavailable');
  assert.equal(locationLabel({name:'London',admin1:'England',country:'United Kingdom'}), 'London, England, United Kingdom');
});
test('city lookup validates input, encodes names and supports empty results', async t => {
  await assert.rejects(findCities(' '), /city name/);
  t.mock.method(globalThis, 'fetch', async url => {
    assert.equal(new URL(url).searchParams.get('name'), 'Paris, France');
    return {ok:true,json:async () => ({})};
  });
  assert.deepEqual(await findCities('Paris, France'), []);
});
test('weather requests preserve zero temperatures and request explicit units', async t => {
  t.mock.method(globalThis, 'fetch', async url => {
    assert.equal(new URL(url).searchParams.get('temperature_unit'), 'celsius');
    return {ok:true,json:async () => ({current:{temperature_2m:0,time:'2026-10-29T09:00'}})};
  });
  assert.equal((await getWeather({latitude:0,longitude:0})).current.temperature_2m, 0);
});
test('weather failures do not masquerade as valid readings', async t => {
  const mock = t.mock.method(globalThis, 'fetch', async () => ({ok:false,status:429}));
  await assert.rejects(getWeather({latitude:0,longitude:0}), /busy/);
  mock.mock.mockImplementation(async () => ({ok:true,json:async () => ({current:{temperature_2m:null}})}));
  await assert.rejects(getWeather({latitude:0,longitude:0}), /No current weather/);
});
