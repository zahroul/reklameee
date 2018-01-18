const app = {
  loadingIndicator: document.getElementById('loading-indicator'),
  billboardsList: document.querySelector('ul'),

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
      if (this.compareString(billboard.location.hint, keyword)) searchResults.push(billboard);
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
    billboardsList.forEach((billboard) => {
      this.billboardsList.appendChild(this.createBillboardsListItem(billboard));
    });
  },

  emptyBillboardsList() {
    for (let i = 1; i < this.billboardsList.children.length; i += 1) {
      this.billboardsList.children[i].remove();
    }
  },

  createBillboardsListItem(billboard) {
    const item = document.getElementById('billboards-list-item').content.cloneNode(true);
    const button = item.querySelector('button');

    button.textContent = billboard.location.hint;
    button.addEventListener('click', () => this.createBillboardDetails(billboard));

    return item;
  },

  createBillboardDetails(billboard) {
    const template = document.getElementById('billboard-details');
    const details = template.content.cloneNode(true);

    details.querySelector('img').setAttribute('src', billboard.photo);
    details.querySelector('img').setAttribute('alt', billboard.location.hint);

    this.createBillboardMetadataItem(details, 'Ukuran', billboard.size);
    this.createBillboardMetadataItem(details, 'Lokasi', `${billboard.location.hint} (<a href="${billboard.location.preview}">Tinjau di Google Street View</a>)`);
    this.createBillboardMetadataItem(details, 'Keterangan', billboard.additionalInfo);
    this.createBillboardMetadataItem(details, 'Kontak', `${billboard.contact.name} <a href="tel:${billboard.contact.phone}">${billboard.contact.phone}</a>`);

    details.querySelector('button').addEventListener('click', event => event.target.parentNode.remove());
    template.parentNode.appendChild(details);
  },

  createBillboardMetadataItem(container, key, value) {
    const template = container.getElementById('metadata-item');
    const itemKey = template.content.cloneNode(true);

    itemKey.querySelector('dt').textContent = key;
    template.parentNode.appendChild(itemKey);

    if (typeof value === 'object' && value.length !== undefined) {
      for (let i = 0; i < value.length; i += 1) {
        template.parentNode.appendChild(this.createBillboardMetadataItemValue(container, value[i]));
      }
    } else {
      template.parentNode.appendChild(this.createBillboardMetadataItemValue(container, value));
    }
  },

  createBillboardMetadataItemValue(container, value) {
    const itemValue = container.getElementById('metadata-item-value').content.cloneNode(true);

    itemValue.querySelector('dd').innerHTML = value;

    return itemValue;
  },

  createSearchAlert(keyword) {
    const template = document.getElementById('search-alert');
    const alert = template.content.cloneNode(true);

    alert.querySelector('p').textContent += `${keyword}.`;
    template.parentNode.appendChild(alert);
  },

  displaySearchResults(searchResults, keyword) {
    this.loadingIndicator.setAttribute('hidden', '');

    if (searchResults.length === 0) {
      this.createSearchAlert(keyword);
    } else {
      this.fillBillboardsList(searchResults);
    }
  },
};

const dialog = document.querySelector('[role="dialog"]');

document.querySelector('input').addEventListener('change', (event) => {
  const keyword = event.target.value.trim();
  const alert = document.querySelector('[role="alert"]');

  if (keyword === '') return false;

  window.location.hash = 'search-results';

  if (document.body.contains(alert)) alert.remove();

  if (app.billboardsList.children.length > 1) app.emptyBillboardsList();

  app.loadingIndicator.removeAttribute('hidden');

  return app.getBillboardsList()
    .then(response => app.searchBillboard(response.billboardsList, keyword))
    .then(searchResults => app.displaySearchResults(searchResults, keyword));
});

document.getElementById('post-billboard').addEventListener('click', () => {
  dialog.removeAttribute('hidden');
});

dialog.querySelector('button').addEventListener('click', () => {
  dialog.setAttribute('hidden', '');
});
