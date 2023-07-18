import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '38313802-233138be4ef65b6ec4f8e7621';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const searchInput = document.querySelector('input[name="searchQuery"]');
let currentPage = 1;
let currentSearchQuery = '';

async function fetchImages(query, page = 1) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: 40,
      },
    });
    const { data } = response;
    return data;
  } catch (error) {
    console.log('Error:', error);
    return null;
  }
}

function createImageCard(image) {
  const {
    webformatURL,
    largeImageURL,
    likes,
    views,
    comments,
    downloads,
    tags,
  } = image;
  const card = document.createElement('div');
  card.classList.add('photo-card');
  card.innerHTML = `
    <a href="${largeImageURL}" class="lightbox-link">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item"><b>Likes:</b> ${likes}</p>
      <p class="info-item"><b>Views:</b> ${views}</p>
      <p class="info-item"><b>Comments:</b> ${comments}</p>
      <p class="info-item"><b>Downloads:</b> ${downloads}</p>
    </div>
    </a>
  `;
  lightbox.refresh();
  return card;
}

function clearGallery() {
  gallery.innerHTML = '';
}

function showNoImagesMessage() {
  Notiflix.Notify.warning(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function showTotalImagesCount(totalHits) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function isEndOfResults(totalHits, page) {
  return totalHits <= page * 40;
}

function toggleLoadMoreButton(visible) {
  loadMoreBtn.style.display = visible ? 'block' : 'none';
}

function showEndOfResultsMessage() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}

function scrollToNextResults() {
  const cardHeight = gallery.firstElementChild.getBoundingClientRect().height;
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

async function searchImages(query) {
  currentSearchQuery = query;
  currentPage = 1;
  clearGallery();
  toggleLoadMoreButton(false);

  const data = await fetchImages(query);
  if (data && data.hits.length > 0) {
    const { hits, totalHits } = data;
    hits.forEach(image => {
      const card = createImageCard(image);
      gallery.appendChild(card);
    });
    toggleLoadMoreButton(true);
    showTotalImagesCount(totalHits);
  } else {
    showNoImagesMessage();
  }
}

async function loadMoreImages() {
  currentPage++;
  const data = await fetchImages(currentSearchQuery, currentPage);
  if (data && data.hits.length > 0) {
    const { hits, totalHits } = data;
    hits.forEach(image => {
      const card = createImageCard(image);
      gallery.appendChild(card);
    });
    if (isEndOfResults(totalHits, currentPage)) {
      toggleLoadMoreButton(false);
      showEndOfResultsMessage();
    }
    scrollToNextResults();
  } else {
    toggleLoadMoreButton(false);
    showNoImagesMessage();
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query !== '') {
    searchImages(query);
    searchInput.blur();
    searchInput.disabled = false;
  }
});

loadMoreBtn.addEventListener('click', () => {
  loadMoreImages();
});

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();
  const isFormValid = query !== '';
  form.querySelector('button').disabled = !isFormValid;
});

let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 100,
  captionsData: 'alt',
});
