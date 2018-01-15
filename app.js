const app = {
  getBillboardsList() {
    return new Promise((resolve) => {
      const request = new XMLHttpRequest();

      request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) resolve(JSON.parse(request.response));
        }
      };

      request.open('GET', 'reklame-data.json');
      request.send();
    });
  },

  fillBillboardsList(billboardsList) {
    const list = document.querySelector('ul');

    billboardsList.forEach((billboard) => {
      list.appendChild(this.createBillboardsListItem(billboard));
    });
  },

  createBillboardsListItem(billboard) {
    const item = document.getElementById('billboards-list-item').content.cloneNode(true);
    const button = item.querySelector('button');

    button.textContent = billboard.location;
    button.addEventListener('click', () => this.createBillboardDetails());

    return item;
  },

  createBillboardDetails() {
    const template = document.getElementById('billboard-details');
    const details = template.content.cloneNode(true);

    template.parentNode.appendChild(details);
  },
};

const billboardItem = document.querySelector('figure');

billboardItem.querySelector('button').addEventListener('click', () => {
  billboardItem.setAttribute('hidden', '');
});
