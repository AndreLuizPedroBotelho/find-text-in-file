function debounce(func, timeout = 1200) {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

function createBarra(messageText, isError = false) {
  const barra = document.createElement("div");
  const text = document.createElement("div");
  barra.appendChild(text);

  barra.classList.add("barra");

  if (isError) {
    barra.classList.add("barra-error");
  }

  text.classList.add("text");

  barra.querySelector(".text").innerHTML = messageText;

  document.querySelector('.lista-file').append(barra)
}

function searchFile() {
  document.querySelector('.lista-file').innerHTML = ""
  const search = document.querySelector('#search-file').value;
  const request = new XMLHttpRequest();

  request.addEventListener('load', function (e) {

    if (request.response.length < 1) {
      const messageText = `Não foi encontrado nenhum documento que contenha a palavra <strong>${search}</strong>`;
      return createBarra(messageText, true)
    }

    for (const { url } of request.response) {
      const messageText = `File: <a href="${url}" target="_blank">${url}</a>`;
      createBarra(messageText)
    }
  });

  request.responseType = 'json';
  request.open('get', `/api?filter=${search}`);
  request.send();
}

const processChange = debounce(() => searchFile());

document.querySelector('#search-file').addEventListener('keypress', function () {
  processChange();
});