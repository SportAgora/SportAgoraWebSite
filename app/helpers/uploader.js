const multer = require("multer");
const path = require("path");

const fileFilter = (req, file, callBack) => {
  const allowedExtensions = /jpeg|jpg|png|gif/;
  const extname = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedExtensions.test(file.mimetype);

  if (extname && mimetype) {
    return callBack(null, true);
  } else {
    callBack(new Error("Apenas arquivos de imagem são permitidos!"));
  }
};

module.exports = (caminho = null, tamanhoArq = 3) => {
  let upload;

  if (caminho == null) {
    const storage = multer.memoryStorage();
    upload = multer({
      storage: storage,
      limits: { fileSize: tamanhoArq * 1024 * 1024 },
      fileFilter: fileFilter,
    });
  } else {
    const storagePasta = multer.diskStorage({
      destination: (req, file, callBack) => {
        callBack(null, caminho);
      },
      filename: (req, file, callBack) => {
        callBack(
          null,
          file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
      },
    });

    upload = multer({
      storage: storagePasta,
      limits: { fileSize: tamanhoArq * 1024 * 1024 },
      fileFilter: fileFilter,
    });
  }

  return (req, res, next) => {
    req.session.erroMulter = null;

    upload.fields([
      { name: "fotoPerfil", maxCount: 1 },
      { name: "fotoBanner", maxCount: 1 },
    ])(req, res, function (err) {
      if (err instanceof multer.MulterError || err) {
        req.session.erroMulter = {
          value: "",
          msg: err.message,
          path: err.field || "imagem",
        };
      }

      next();
    });
  };
};
