import API from '../api-services/asyncFetchCountries';
import _debounce from 'lodash.debounce';
import countriesListTpl from '../templates/countries-list.hbs';
import countryCardTpl from '../templates/country-card.hbs';
import * as PNotify from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const inputRef = document.querySelector('#country-input');
const countryContainerRef = document.querySelector('#country-container');

const renderCountries = async countries => {
  try {
    const markupList = countriesListTpl(countries);
    const markupCountryCard = countryCardTpl(countries);

    if (countries.length > 10 || inputRef.value === '') {
      countryContainerRef.innerHTML = '';
      PNotify.info({
        title: 'Too many matches found',
        text: 'Please enter a more specific query!',
        delay: 2000,
      });
    } else if (countries.length <= 10 && countries.length > 1) {
      countryContainerRef.innerHTML = markupList;
    } else if (countries.length === 1) {
      countryContainerRef.innerHTML = markupCountryCard;
    }
  } catch (error) {
    console.log(error);
    error = PNotify.error({
      title: 'Enter correct country name',
      delay: 2000,
    });
    countryContainerRef.innerHTML = '';
  }
};

const onInputChange = async e => {
  let searchQuery = e.target.value;
  if (searchQuery != '') {
    const countries = await API.fetchCountries(searchQuery);
    renderCountries(countries);
  }
};

inputRef.addEventListener('input', _debounce(onInputChange, 500));
