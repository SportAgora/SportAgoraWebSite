let cropper;
const cropperModal = document.getElementById('cropperModal');
const cropperImage = document.getElementById('cropperImage');
const closeModal = document.querySelector('.close');
const confirmCrop = document.getElementById('confirmCrop');
const cancelCrop = document.getElementById('cancelCrop');
 
const bannerInput = document.getElementById('bannerInput');
const profileInput = document.getElementById('profileInput');
 
const bannerImage = document.getElementById('bannerImage');
const profileImage = document.getElementById('profileImage');
 
const editBanner = document.getElementById('editBanner');
const editProfile = document.getElementById('editProfile');
 
let currentType = ''; // 'banner' ou 'profile'
 
// Ação ao clicar no banner
editBanner.addEventListener('click', () => {
    currentType = 'banner';
    bannerInput.click();
});
 
// Ação ao clicar na foto de perfil
editProfile.addEventListener('click', () => {
    currentType = 'profile';
    profileInput.click();
});
 
// Ao selecionar uma imagem
[bannerInput, profileInput].forEach(input => {
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                cropperImage.src = reader.result;
                openModal();
            };
            reader.readAsDataURL(file);
        }
    });
});
 
// Abrir modal de crop
function openModal() {
    cropperModal.style.display = 'flex';
 
    if (cropper) cropper.destroy();
 
    cropper = new Cropper(cropperImage, {
        aspectRatio: currentType === 'banner' ? 16 / 5 : 1,
        viewMode: 1,
        background: false,
        movable: true,
        zoomable: true,
        scalable: false,
        rotatable: false,
        dragMode: 'move',
        autoCropArea: 1
    });
}
 
// Fechar modal
function closeCropper() {
    cropper.destroy();
    cropper = null;
    cropperModal.style.display = 'none';
}
 
// Botão de confirmar crop
confirmCrop.addEventListener('click', () => {
    const canvas = cropper.getCroppedCanvas({
        width: currentType === 'banner' ? 1600 : 500,
        height: currentType === 'banner' ? 500 : 500,
        imageSmoothingQuality: 'high'
    });
 
    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
 
        if (currentType === 'banner') {
            bannerImage.src = url;
            const file = new File([blob], 'banner.png', { type: 'image/png' });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            bannerInput.files = dataTransfer.files;
        } else if (currentType === 'profile') {
            profileImage.src = url;
            const file = new File([blob], 'profile.png', { type: 'image/png' });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            profileInput.files = dataTransfer.files;
        }
        closeCropper();
    }, 'image/png');
});
 
// Cancelar crop
cancelCrop.addEventListener('click', closeCropper);
closeModal.addEventListener('click', closeCropper);
 
// Fechar modal clicando fora
window.addEventListener('click', (e) => {
    if (e.target === cropperModal) {
        closeCropper();
    }
});