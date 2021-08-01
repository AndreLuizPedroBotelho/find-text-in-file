let drop_ = document.querySelector('.area-upload #upload-file');

drop_.addEventListener('dragenter', function () {
  document.querySelector('.area-upload .label-upload').classList.add('highlight');
});

drop_.addEventListener('dragleave', function () {
  document.querySelector('.area-upload .label-uploade').classList.remove('highlight');
});

drop_.addEventListener('drop', function () {
  document.querySelector('.area-upload .label-upload').classList.remove('highlight');
});

document.querySelector('#upload-file').addEventListener('change', function () {
  const files = this.files;

  for (let i = 0; i < files.length; i++) {
    const info = validarArquivo(files[i]);

    if (info.error !== undefined) {
      Swal.fire({
        title: 'Error!',
        text: info.error,
        icon: 'error',
        confirmButtonText: 'Cool'
      })
      return
    }

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
      enviarArquivo(i, barra);
    }

    document.querySelector('.lista-uploads').appendChild(barra);
  };
});

function validarArquivo(file) {
  const mime_types = ['.docx'];

  if (!file.name.includes(mime_types)) {
    return { "error": "O arquivo " + file.name + " não é permitido" };
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
      clearBarra(barra)
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Erro ao enviar aquivo',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
      clearBarra(barra)
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

