document.addEventListener("DOMContentLoaded", function () {
    // Quill editor
    const quill = new Quill('#editor', {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link']
        ]
      },
      theme: 'snow',
      placeholder: 'Adicione uma descrição do local (opcional)...'
    });

    const descricaoInput = document.getElementById("descricao");
    const form = document.querySelector('form');

    form.addEventListener('submit', function () {
      descricaoInput.value = quill.root.innerHTML;
    });

    // Preview da imagem
    const imageInput = document.getElementById('foto');
    const imageDrop = document.getElementById('image-drop');
    const imagePreview = document.getElementById('image-preview');
    const imageText = document.getElementById('image-text');

    imageDrop.addEventListener('click', () => imageInput.click());

    imageInput.addEventListener('change', () => {
      const file = imageInput.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        imageText.style.display = 'none';
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    });
  });