doctype html
html
  head
    title= title
  body
    .container
      h1 Send us photos of you enjoying cal.js

      form(method='post', enctype='multipart/form-data')
        input(type='file', name='image', accept="image/*")
        input(type='submit', value='Share your photo!')

