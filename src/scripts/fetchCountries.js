import countriesList from '../templates/countries-list.hbs';
import countryCard from '../templates/country-card.hbs';

import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { alert, error } from '@pnotify/core';

function fetchCountries(searchQuery) {
  return fetch(`https://restcountries.eu/rest/v2/name/${searchQuery}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        showError('Country not found.');
        throw new Error(response.statusText);
      }
    })
    .catch();
}

var debounce = require('lodash.debounce');

const refs = {
  userInput: document.querySelector('#js-input'),
  countryContainer: document.querySelector('#js-country-container'),
  countriesContainer: document.querySelector('#js-countries-container'),
  warning: document.querySelector('#js-warning'),
};

const getUserInput = () => {
  return refs.userInput.value;
};

const getData = () => {
  clearMarkup();
  const userInput = getUserInput();

  if (userInput.trim().length < 1) {
    return;
  }

  fetchCountries(userInput).then(renderMarkup).catch(console.log);
};

const renderMarkup = result => {
  const count = result.length;

  if (count === 1) {
    renderCountryMarkup(result);
  } else if (count <= 11) {
    renderCountrisMarkup(result);
  } else {
    showWarning();
  }
};

const renderCountryMarkup = array => {
  refs.countryContainer.innerHTML = countryCard(array[0]);
};

const renderCountrisMarkup = array => {
  const names = getCountiesNames(array);
  refs.countriesContainer.innerHTML = countriesList(names);
};

const clearMarkup = () => {
  refs.countryContainer.innerHTML = '';
  refs.countriesContainer.innerHTML = '';
};

const showError = msg => {
  new error({
    dir1: 'up',
    text: msg,
    delay: 2000,
  });
};

const showWarning = () => {
  showError('To many matches found. Please enter a more specific query');
};

const getCountiesNames = array => {
  return array.map(({ name }) => name);
};

getData();
refs.userInput.addEventListener('input', debounce(getData, 1000));
