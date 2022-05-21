import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import ImageApiService from './js/fetchSearch.js';
import './sass/main.scss';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  endSearchInfo: document.querySelector('.end-search__info'),
};
const { form, gallery, loadMoreBtn, endSearchInfo } = refs;

const imageApiService = new ImageApiService();

// Добавяем листенеры
form.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', loadMore);

let shownImages = 0;

// Инициализация глобальной переменной SimpleLightbox
let lightbox = {};

function handleSearch(event) {
  event.preventDefault();
  resetGallery();
  imageApiService.resetPage();

  imageApiService.query = form.elements.searchQuery.value;

  imageApiService
    .fetchQuery()
    .then(data => {
      if (data.totalHits === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      }

      Notify.success(`Hooray! We found ${data.totalHits} images.`);

      loadMoreBtn.classList.remove('is-hidden');
      endSearchInfo.classList.add('is-hidden');
      shownImages = data.hits.length;

      appendCardsMurkup(data.hits);
      addLightbox();

      if (shownImages >= data.totalHits) {
        showEndSearchMessage();
      }
    })

    .catch(error => console.log(error));
}

function loadMore() {
  imageApiService
    .fetchQuery()
    .then(data => {
      appendCardsMurkup(data.hits);
      smoothRendering();

      lightbox.refresh();

      shownImages += data.hits.length;
      if (shownImages >= data.totalHits) {
        showEndSearchMessage();
      }
    })
    .catch(error => {
      console.log(error);
      showEndSearchMessage();
    });
}

function generateCardsMurkup(cardsArray) {
  return cardsArray
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<a href="${largeImageURL}" class="photo-card">
        <img src="${webformatURL}" alt="${tags}" class="photo-card__img" loading="lazy" />
        <div class="info">
          <p class="info-item"><b>Likes</b><br />${likes}</p>
          <p class="info-item"><b>Views</b><br />${views}</p>
          <p class="info-item"><b>Comments</b><br />${comments}</p>
          <p class="info-item"><b>Downloads</b><br />${downloads}</p>
        </div>
      </a>`;
    })
    .join('');
}

function resetGallery() {
  gallery.innerHTML = '';
}

function appendCardsMurkup(cards) {
  gallery.insertAdjacentHTML('beforeend', generateCardsMurkup(cards));
}

function addLightbox() {
  lightbox = new SimpleLightbox('.gallery a', {
    showCounter: false,
    captionsData: 'alt',
    captionDelay: 250,
  });
}

// Прокрутка страницы при Load more
function smoothRendering() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function showEndSearchMessage() {
  loadMoreBtn.classList.add('is-hidden');
  endSearchInfo.classList.remove('is-hidden');
}
