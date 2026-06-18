const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxc68wix3qo-dMiUOPaHSVaSVKF-zu4XjFj8NXVlpBsxam4co0v4ZayA84W60kcLEw5sQ/exec';

fetch(SCRIPT_URL)
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(err => console.error(err));
