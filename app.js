const billboardItem = document.querySelector('figure');

document.querySelector('button').addEventListener('click', () => {
  billboardItem.removeAttribute('hidden');
});

billboardItem.querySelector('button').addEventListener('click', () => {
  billboardItem.setAttribute('hidden', '');
});
