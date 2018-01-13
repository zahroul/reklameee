const app = {
  getBillboardsList() {
    const request = new XMLHttpRequest();

    request.onreadystatechange = () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) JSON.parse(request.response);
      }
    };

    request.open('GET', 'reklame-data.json');
    request.send();
  },
};

const billboardItem = document.querySelector('figure');

document.querySelector('button').addEventListener('click', () => {
  billboardItem.removeAttribute('hidden');
});

billboardItem.querySelector('button').addEventListener('click', () => {
  billboardItem.setAttribute('hidden', '');
});
