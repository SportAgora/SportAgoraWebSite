let cropper;
let currentTarget;

function openCropper(file, target) {
    currentTarget = target;

    const reader = new FileReader();
    reader.onload = () => {
        const image = document.getElementById('cropper-image');
        image.src = reader.result;
        document.getElementById('cropper-modal').classList.remove('hidden');

        cropper = new Cropper(image, {
            aspectRatio: target === 'profile' ? 1 : 3,
            viewMode: 1
        });
    };
    reader.readAsDataURL(file);
}

document.getElementById('crop-confirm').addEventListener('click', () => {
    const canvas = cropper.getCroppedCanvas();
    if (currentTarget === 'profile') {
        document.getElementById('profile-img').src = canvas.toDataURL();
    } else {
        document.getElementById('banner').style.backgroundImage = `url(${canvas.toDataURL()})`;
    }
    closeCropper();
});

document.getElementById('crop-cancel').addEventListener('click', closeCropper);

function closeCropper() {
    cropper.destroy();
    document.getElementById('cropper-modal').classList.add('hidden');
}

document.getElementById('input-profile').addEventListener('change', function () {
    const file = this.files[0];
    if (file && file.type.startsWith('image/')) {
        openCropper(file, 'profile');
    }
});

document.getElementById('edit-banner').addEventListener('click', () => {
    document.getElementById('input-banner').click();
});

document.getElementById('input-banner').addEventListener('change', function () {
    const file = this.files[0];
    if (file && file.type.startsWith('image/')) {
        openCropper(file, 'banner');
    }
});

document.querySelectorAll('.form-switch').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.form').forEach(form => form.classList.remove('active'));
        document.getElementById('form-' + btn.dataset.target).classList.add('active');
    });
});

document.getElementById('cep').addEventListener('blur', function () {
    fetch(`https://viacep.com.br/ws/${this.value}/json/`)
        .then(res => res.json())
        .then(data => {
            if (!data.erro) {
                document.getElementById('rua').value = data.logradouro;
                document.getElementById('bairro').value = data.bairro;
                document.getElementById('cidade').value = data.localidade;
                document.getElementById('uf').value = data.uf;
            } else {
                alert('CEP não encontrado');
            }
        });
});
