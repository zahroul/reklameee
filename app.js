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

  searchBillboard(billboardsList, keyword) {
    const searchResults = [];

    billboardsList.forEach((billboard) => {
      if (this.compareString(billboard.location, keyword)) searchResults.push(billboard);
    });

    return searchResults;
  },

  compareString(location, keyword) {
    let keywordCharIndex = 0;

    for (let i = 0; i < location.length; i += 1) {
      if (keywordCharIndex < keyword.length) {
        if (location.charAt(i).toLowerCase() !== keyword.charAt(keywordCharIndex).toLowerCase()) {
          keywordCharIndex = 0;
        } else {
          keywordCharIndex += 1;
        }

        if (keyword.charAt(keywordCharIndex) === undefined) break;
      }
    }

    return keywordCharIndex === keyword.length;
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

    details.querySelector('button').addEventListener('click', event => event.target.parentNode.remove());
    template.parentNode.appendChild(details);
  },
};

document.querySelector('input').addEventListener('change', (event) => {
  const keyword = event.target.value.trim();

  app.getBillboardsList()
    .then(response => app.searchBillboard(response.billboardsList, keyword))
    .then(searchResults => app.fillBillboardsList(searchResults));
});
