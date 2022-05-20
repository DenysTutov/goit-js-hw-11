export default function fetchSearch(keyWord) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '27524707-2a0c8c68731d19490670e3324';

  return fetch(
    `${BASE_URL}?key=${KEY}&q=${keyWord}&image_type=photo&orientation=horizontal&safesearch=true`,
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
