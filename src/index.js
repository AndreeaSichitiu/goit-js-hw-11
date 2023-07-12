'use strict';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/api';
// import { createMarkup } from './js/gallery_markup';
import './styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { smoothScroll } from './js/smooth_scroll';

const refs = {
  submitForm: document.querySelector('form#search-form'),
  gallery: document.querySelector('div.gallery'),
  loadMoreBtn: document.querySelector('button.load-more'),
  header: document.getElementById('myHeader'),
};

const perPage = 40;
let page = 1;
let searchPhoto = '';

refs.loadMoreBtn.classList.replace('load-more', 'loader');
refs.loadMoreBtn.innerHTML = null;
refs.loadMoreBtn.classList.add('is-hidden');

// Submit function
function onSubmitForm(event) {
  event.preventDefault();

  refs.gallery.innerHTML = '';
  page = 1;
  const { searchQuery } = event.currentTarget.elements;
  searchPhoto = searchQuery.value.trim().toLowerCase().split(' ').join('+');

  if (searchPhoto === '') {
    Notify.info('Enter your request, please!', {
      position: 'center-center',
    });
    return;
  }

  fetchImages(searchPhoto, page, perPage)
    .then(data => {
      const searchResults = data.hits;
      if (data.totalHits === 0) {
        // clearAll();
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          {
            position: 'center-center',
          }
        );
      } else {
        Notify.info(`Hooray! We found ${data.totalHits} images.`);
        createMarkup(searchResults);
        lightbox.refresh();
      }
      if (data.totalHits > perPage) {
        refs.loadMoreBtn.classList.remove('is-hidden');
        window.addEventListener('scroll', loadMorePage);
      }
      smoothScroll();
    })
    .catch(onError);

  event.currentTarget.reset();
}

refs.submitForm.addEventListener('submit', onSubmitForm);

// Create markup function for gallery
function createMarkup(searchResults) {
  const photosArray = searchResults.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return `<div class="photo-card">
        <div class="photo-wrap">
            <a class="photo-link" href="${largeImageURL}">
                <img class="photo" src="${webformatURL}" alt="${tags}" width="300" loading="lazy" />
            </a>
        </div>
        <div class="info">
            <p class="info-item">
            <b><span class = "info-info">Likes:</span> ${likes}</b>
            </p>
            <p class="info-item">
            <b><span class = "info-info">Views:</span> ${views}</b>
            </p>
            <p class="info-item">
            <b><span class = "info-info">Comments:</span> ${comments}</b>
            </p>
            <p class="info-item">
            <b><span class = "info-info">Downloads:</span> ${downloads}</b>
            </p>
        </div>
        </div>`;
    }
  );
  refs.gallery.insertAdjacentHTML('beforeend', photosArray.join(''));
}

// Load more function with infinite scroll
function onClickLoadMore() {
  page += 1;
  fetchImages(searchPhoto, page, perPage)
    .then(data => {
      const searchResults = data.hits;
      const numberOfPage = Math.ceil(data.totalHits / perPage);

      createMarkup(searchResults);
      if (page === numberOfPage) {
        refs.loadMoreBtn.classList.add('is-hidden');
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );

        window.removeEventListener('scroll', loadMorePage);
      }
      lightbox.refresh();
      smoothScroll();
    })
    .catch(onError);
}

// Functions for infinite scroll
function loadMorePage() {
  if (endOfPage()) {
    onClickLoadMore();
  }
}

function endOfPage() {
  return (
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight
  );
}

// // Function for clear all
// function clearAll() {
//   perPage = 0;
//   gallery.innerHTML = ' ';
//   refs.loadMoreBtn.classList.add('is-hidden');
// }

// Function for error
function onError() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    {
      position: 'center-center',
    }
  );
}

// Lightbox
let lightbox = new SimpleLightbox('.photo-wrap a');

// Function for fixed header
window.onscroll = function () {
  stickyHeader();
};

const sticky = refs.header.offsetTop;
function stickyHeader() {
  if (window.scrollY > sticky) {
    refs.header.classList.add('sticky');
  } else {
    refs.header.classList.remove('sticky');
  }
}
