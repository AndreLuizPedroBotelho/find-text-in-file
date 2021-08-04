function debounce(func, timeout = 1000) {
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
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

function loading(loading) {
  if (loading) {
    document.querySelector(".loader").style.visibility = "visible";
    document.querySelector(".loader").style.opacity = "1";
    return
  }

  document.querySelector(".loader").style.visibility = "hidden";
  document.querySelector(".loader").style.opacity = "0";

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

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


function searchFile() {
  document.querySelector('.lista-file').innerHTML = ""

  loading(true);

  const search = document.querySelector('#search-file').value;
  const request = new XMLHttpRequest();

  request.addEventListener('load', function (e) {
    loading(false);
    sleep(1000);

    if (request.response.length < 1) {
      const messageText = `Não foi encontrado nenhum documento que contenha a palavra <strong>${search}</strong> `;
      return createBarra(messageText, null, true)
    }

    for (const { nameFile, data } of request.response) {
      const messageText = `<span class="a-file">${nameFile}</span>`;
      createBarra(messageText, data)
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