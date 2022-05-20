import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import fetchSearch from './js/fetchSearch';
import './sass/main.scss';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};
const { form, gallery } = refs;

form.addEventListener('submit', handleSearch);

function handleSearch(event) {
  event.preventDefault();
  resetGallery();

  const inputValue = form.elements.searchQuery.value;
  fetchSearch(inputValue)
    .then(data => {
      if (data.totalHits === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      }

      gallery.insertAdjacentHTML('beforeend', generateCardMurkup(data.hits));

      new SimpleLightbox('.gallery a', {
        showCounter: false,
        captionsData: 'alt',
        captionDelay: 250,
      });
    })
    .catch(error => console.log(error));
}

function generateCardMurkup(cardArray) {
  return cardArray
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
