"use strict"
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/api';
import { createMarkup } from './js/gallery_markup';
import './styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { smoothScroll } from './js/smooth_scroll';

searchForm = document.querySelector('.search-form');
gallery = document.querySelector('.gallery');
loadMoreBtn = document.querySelector('.load-more');

const perPage = 40;
let page = 1;
let searchPhoto = '';

loadMoreBtn.classList.replace('load-more', 'loader');
loadMoreBtn.innerHTML = null;
loadMoreBtn.classList.add('is-hidden');

searchForm.addEventListener('submit', submitForm);

function submitForm(event) {
  event.preventDefault();

  gallery.innerHTML = '';
  page = 1;
  const { searchQuery } = event.currentTarget.elements;
  searchPhoto = searchQuery.value.trim().toLowerCase().split(' ').join('+');

  if (searchPhoto === '') {
    Notify.info('Enter your request, please!', {
      position: 'center-center',
    });
    clearAll();
    return;
  }

  fetchImages(searchPhoto, page, perPage)
    .then(data => {
      const searchResults = data.hits;
      if (data.totalHits === 0) {
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
        loadMoreBtn.classList.remove('is-hidden');
        window.addEventListener('scroll', loadMorePage);
      }
      // smoothScroll();
    })
    .catch(onError);

   event.currentTarget.reset();
}

function onClickLoadMore() {
  page += 1;
  fetchImages(searchPhoto, page, perPage)
    .then(data => {
      const searchResults = data.hits;
      const numberOfPage = Math.ceil(data.totalHits / perPage);

      createMarkup(searchResults);
      if (page === numberOfPage) {
        loadMoreBtn.classList.add('is-hidden');
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

function clearAll() {
  perPage = 0;
  gallery.innerHTML = ' ';
  loadMoreBtn.classList.add('is-hidden');
}

function onError() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    {
      position: 'center-center',
    }
  );
}

let lightbox = new SimpleLightbox('.photo-wrap a', {
  captionsData: 'alt',
  captionDelay: 250,
});
