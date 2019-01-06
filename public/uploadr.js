/* eslint-env browser */
'use strict'

const dropTarget = document.getElementById('drop-target')

var droppedFile

dropTarget.addEventListener('dragover', function (e) {
  e.preventDefault()
  console.log('DRAGOVER', e)
})

dropTarget.addEventListener('drop', function (e) {
  e.preventDefault()
  insertFilename(e.dataTransfer.files[0])
  previewImage(e.dataTransfer.files[0])
  droppedFile = e.dataTransfer.files[0]
})

const file = document.getElementById('file')

file.addEventListener('input', function (e) {
  const preset = document.getElementById('preset').value
  console.log(preset)
  if (e.target.files[0] && isImage(e.target.files[0].type)) {
    insertFilename(e.target.files[0])
    previewImage(e.target.files[0])
  }
})

const form = document.getElementById('form')
form.addEventListener('submit', function (e) {
  e.preventDefault()
  uploadForm(e.target).then(function () {

  })
})

function isImage (mime) {
  return mime === 'image/jpeg' || mime === 'image/png' || mime === 'image/gif'
}

function uploadForm (form) {
  return new Promise(function (resolve, reject) {
    var data = new FormData(form)
    console.log(data.has('file'), data.get('file'))

    if (data.get('file').name === '' && droppedFile != null) {
      data.set('file', droppedFile)
    }

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/file', true)
    xhr.addEventListener('load', function (e) {
      // file upload is complete
      resolve()
    })
    xhr.send(data)
  })
}

function previewImage (file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader()
    reader.onload = function (e) {
      document.getElementById('preview-image').src = e.target.result
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
