function debounce(func, timeout = 1200) {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

function removeIframe() {
  document.getElementsByClassName('html-document')[0].remove()
  document.querySelector(".iframeFile button").remove()
  document.querySelector(".iframeFile").style.display = "none";
}

function createBarra(messageText, base64, isError = false) {
  const barra = document.createElement("div");
  const text = document.createElement("div");
  barra.appendChild(text);

  barra.classList.add("barra");

  if (isError) {
    barra.classList.add("barra-error");
  }

  barra.addEventListener('click', () => {
    loadFile(base64)
  })

  text.classList.add("text");

  barra.querySelector(".text").innerHTML = messageText;

  document.querySelector('.lista-file').append(barra)
}

function b64DecodeUnicode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

function loadFile(data) {
  const html = document.createElement("div");
  const search = document.querySelector('#search-file').value;

  html.innerHTML = b64DecodeUnicode(data);
  html.classList.add("html-document");

  const button = document.createElement("button");
  button.addEventListener('click', () => {
    removeIframe()
  })
  button.innerHTML = 'x'

  document.querySelector('.iframeFile').append(html)
  document.querySelector('.iframeFile').append(button)

  document.querySelectorAll('img').forEach((el) => el.remove())


  document.querySelector(".iframeFile").style.display = "flex";

  const instance = new Mark(html);
  instance.mark(search)
}

function searchFile() {
  document.querySelector('.lista-file').innerHTML = ""
  const search = document.querySelector('#search-file').value;
  const request = new XMLHttpRequest();

  request.addEventListener('load', function (e) {

    if (request.response.length < 1) {
      const messageText = `Não foi encontrado nenhum documento que contenha a palavra <strong>${search}</strong> `;
      return createBarra(messageText, null, true)
    }

    for (const { nameFile, base64 } of request.response) {
      const messageText = `<span class="a-file">${nameFile}</span>`;
      createBarra(messageText, base64)
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