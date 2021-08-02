function debounce(func, timeout = 1200) {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
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

function loadFile(data) {
  const iframe = document.createElement("iframe");

  iframe.setAttribute("src", `data:application/pdf;base64, ${data}`);
  iframe.setAttribute("width", "100%");
  iframe.setAttribute("height", "100vh");
  iframe.setAttribute("id", "pdf-js-viewer");

  console.log(iframe.body)
  document.querySelector('.iframeFile').append(iframe)


}

function searchFile() {
  document.querySelector('.lista-file').innerHTML = ""
  const search = document.querySelector('#search-file').value;
  const request = new XMLHttpRequest();

  request.addEventListener('load', function (e) {

    if (request.response.length < 1) {
      const messageText = `Não foi encontrado nenhum documento que contenha a palavra <strong>${search}</strong>`;
      return createBarra(messageText, null, true)
    }

    for (const { nameFile, base64 } of request.response) {
      const messageText = `Arquivo: <span class="a-file" >${nameFile}</span>`;
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