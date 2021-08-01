let drop_ = document.querySelector('.area-upload #upload-file');

drop_.addEventListener('dragenter', function () {
  document.querySelector('.area-upload .label - upload').classList.add('highlight');
});

drop_.addEventListener('dragleave', function () {
  document.querySelector('.area-upload .label - upload').classList.remove('highlight');
});

drop_.addEventListener('drop', function () {
  document.querySelector('.area-upload .label - upload').classList.remove('highlight');
});

document.querySelector('#upload-file').addEventListener('change', function () {
  const files = this.files;

  for (let i = 0; i < files.length; i++) {
    const info = validarArquivo(files[i]);

    const barra = document.createElement("div");
    const fill = document.createElement("div");
    const text = document.createElement("div");
    barra.appendChild(fill);
    barra.appendChild(text);

    barra.classList.add("barra");
    fill.classList.add("fill");
    text.classList.add("text");

    if (info.error == undefined) {
      text.innerHTML = info.success;
      enviarArquivo(i, barra); //Enviar
    } else {
      text.innerHTML = info.error;
      barra.classList.add("error");
    }

    document.querySelector('.lista-uploads').appendChild(barra);
  };
});

function validarArquivo(file) {
  const mime_types = ['.docx'];

  if (mime_types.includes(file.name)) {
    return { "error": "O arquivo " + file.name + " não permitido" };
  }

  return { "success": "Enviando: " + file.name };
}

function clearBarra(barra) {
  setTimeout(() => {
    barra.remove()
  }, 3000)
}

function enviarArquivo(indice, barra) {
  const data = new FormData();
  const request = new XMLHttpRequest();

  const file = document.querySelector('#upload-file').files[indice]

  data.append('file', file);

  request.addEventListener('load', function (e) {
    if (request.response.success) {
      barra.querySelector(".text").innerHTML = "<i> Finalizado </i>";
      barra.classList.add("complete");
      clearBarra(barra)

    } else {
      barra.querySelector(".text").innerHTML = "Erro ao enviar: " + request.response.name;
      barra.classList.add("error");
    }
  });

  request.upload.addEventListener('progress', function (e) {
    const percent_complete = (e.loaded / e.total) * 100;

    barra.querySelector(".fill").style.minWidth = percent_complete + "%";
  });

  request.responseType = 'json';
  request.open('post', '/api/upload');
  request.send(data);
}

