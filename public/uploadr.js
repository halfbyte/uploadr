/* eslint-env browser */
'use strict'

const dropTarget = document.getElementById('drop-target')
const form = document.getElementById('form')
const file = document.getElementById('file')
const filename = document.getElementById('filename')
const fileExtension = document.getElementById('file-extension')
const image = document.getElementById('preview-image')
const fileUrl = document.getElementById('file-url')
const result = document.getElementById('result')
const copyToClipboard = document.getElementById('copy-to-clipboard')
const done = document.getElementById('done')

console.log(result)


var droppedFile

dropTarget.addEventListener('dragover', function (e) {
  e.preventDefault()
})

dropTarget.addEventListener('dragenter', function (e) {
  e.preventDefault()
  dropTarget.className += " drop-target__over"
})

function removeDropHighlight() {
  dropTarget.className = dropTarget.className.replace(/ drop-target__over/, '').trim()
}

dropTarget.addEventListener('dragleave', function(e) {
  e.preventDefault()
  removeDropHighlight()
})

dropTarget.addEventListener('drop', function (e) {
  e.preventDefault()
  insertFilename(e.dataTransfer.files[0])
  previewImage(e.dataTransfer.files[0])
  removeDropHighlight()
  droppedFile = e.dataTransfer.files[0]
})


file.addEventListener('input', function (e) {
  if (e.target.files[0] && isImage(e.target.files[0].type)) {
    insertFilename(e.target.files[0])
    previewImage(e.target.files[0])
  }
})


form.addEventListener('submit', function (e) {
  e.preventDefault()
  uploadForm(e.target).then(function (response) {
    showResult(response)
    reset()
  }).catch(function(error) {
    alert("Error uploading" + error)
  })
})

copyToClipboard.addEventListener('click', function(e) {
  copyResultToClipboard()
})

done.addEventListener('click', function(e) {
  showForm()
})

function copyResultToClipboard() {
  fileUrl.select()
  document.execCommand('copy')
}

function showForm() {
  result.style.display = 'none'
  dropTarget.style.display = 'block'
}

function showResult(url) {
  console.log('showResult', url, result)

  result.style.display = 'block'
  dropTarget.style.display = 'none'
  fileUrl.value = url
}

function isImage (mime) {
  return mime === 'image/jpeg' || mime === 'image/png' || mime === 'image/gif'
}

function uploadForm (form) {
  return new Promise(function (resolve, reject) {
    var data = new FormData(form)
    console.log(data.has('file'), "---" + data.get('file').name)

    if ((data.get('file').name == null || data.get('file').name === '') && droppedFile != null) {
      console.log("dropped", droppedFile)
      data.set('file', droppedFile)
    }

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/file', true)
    xhr.addEventListener('load', function (e) {
      // file upload is complete
      resolve(xhr.responseText)
    })
    xhr.addEventListener('error', function (e) {
      // file upload is complete
      reject(xhr, e)
    })
    xhr.send(data)
  })
}

function previewImage (file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader()
    reader.onload = function (e) {
      image.src = e.target.result
      resolve()
    }
    reader.onerror = function (e) {
      console.log(e)
      reject(e.error)
    }
    reader.readAsDataURL(file)
  })
}

function insertFilename (file) {
  const nameField = document.getElementById('filename')
  const extField = document.getElementById('file-extension')
  nameField.value = nameWithoutExt(file.name)
  extField.value = ext(file.name)
}

function ext (filename) {
  return (filename.match(/\.((jpe?g|gif|png))$/)[1] || '').toLowerCase()
}

function nameWithoutExt (filename) {
  return filename.replace(/\.(jpe?g|gif|png)$/i, '')
}

function reset() {
  console.log("RESET")
  file.value = ''
  filename.value = ''
  fileExtension.value = ''
  image.src = '/drop-here.png'
}
