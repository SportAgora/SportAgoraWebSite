
// Tabs com animação
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(`form-${tab.dataset.tab}`).classList.add('active');
  });
});

// CEP Auto-preenchimento
document.getElementById('cep').addEventListener('blur', () => {
  const cep = document.getElementById('cep').value.replace(/\D/g, '');
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('rua').value = data.logradouro;
      document.getElementById('bairro').value = data.bairro;
      document.getElementById('cidade').value = data.localidade;
      document.getElementById('uf').value = data.uf;
    });
});

// troca imagem

let cropper;
let currentTarget = ''; // 'banner' ou 'profile'

const modal = document.getElementById('cropperModal');
const cropperImage = document.getElementById('cropperImage');
const closeModal = document.querySelector('.close');
const confirmCrop = document.getElementById('confirmCrop');
const cancelCrop = document.getElementById('cancelCrop');

// Elementos dos inputs
const bannerInput = document.getElementById('bannerInput');
const profileInput = document.getElementById('profileInput');

const bannerImage = document.getElementById('bannerImage');
const profileImage = document.getElementById('profileImage');

const editBanner = document.getElementById('editBanner');
const editProfile = document.getElementById('editProfile');

// Ações de clicar nos ícones
editBanner.addEventListener('click', () => {
  currentTarget = 'banner';
  bannerInput.click();
});

editProfile.addEventListener('click', () => {
  currentTarget = 'profile';
  profileInput.click();
});

// Ações ao escolher arquivos
[bannerInput, profileInput].forEach(input => {
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        openCropper(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  });
});

// Função para abrir o cropper
function openCropper(imageSrc) {
  cropperImage.src = imageSrc;
  modal.style.display = 'block';

  if (cropper) {
    cropper.destroy();
  }

  cropper = new Cropper(cropperImage, {
    aspectRatio: currentTarget === 'banner' ? 16 / 9 : 1,
    viewMode: 1,
    dragMode: 'move',
    guides: true,
    movable: true,
    cropBoxResizable: true,
    background: false
  });
}

// Confirmar recorte
confirmCrop.addEventListener('click', () => {
  const canvas = cropper.getCroppedCanvas({
    width: currentTarget === 'banner' ? 1600 : 400,
    height: currentTarget === 'banner' ? 900 : 400
  });

  const croppedImage = canvas.toDataURL('image/png');

  if (currentTarget === 'banner') {
    bannerImage.src = croppedImage;
  } else if (currentTarget === 'profile') {
    profileImage.src = croppedImage;
  }

  closeModalFunction();
});

// Cancelar
cancelCrop.addEventListener('click', closeModalFunction);
closeModal.addEventListener('click', closeModalFunction);

function closeModalFunction() {
  modal.style.display = 'none';
  if (cropper) {
    cropper.destroy();
  }
  cropper = null;
  cropperImage.src = '';
}

// Tabs
const tabs = document.querySelectorAll('.tab');
const forms = document.querySelectorAll('.form');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));

    tab.classList.add('active');
    const selectedForm = document.getElementById(`form-${tab.dataset.tab}`);
    selectedForm.classList.add('active');
  });
});