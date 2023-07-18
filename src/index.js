import Notiflix from 'notiflix';
import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_yHGv7HZ0xJ6i0soooxb0k7Z4N60t0TfUSx9W1EYE45GpnYrrg1nl8WYFfRTCoUtQ';

const select = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');
