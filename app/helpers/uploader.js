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

  const upload = multer({
    storage: storagePasta,
    limits: { fileSize: tamanhoArq * 1024 * 1024 },
    fileFilter: fileFilter,
  });

  return (camposArquivos) => {
    return (req, res, next) => {
      req.session.erroMulter = null;

      let middlewareUpload;

      if (typeof camposArquivos === "string") {
        middlewareUpload = upload.single(camposArquivos);
      } else if (Array.isArray(camposArquivos)) {
        const campos = camposArquivos.map((nome) => ({
          name: nome,
          maxCount: 1,
        }));
        middlewareUpload = upload.fields(campos);
      } else {
        throw new Error("Parâmetro inválido: passe uma string ou array de strings.");
      }

      middlewareUpload(req, res, function (err) {
        if (err instanceof multer.MulterError || err) {
          req.session.erroMulter = {
            value: "",
            msg: err.message,
            path: camposArquivos,
          };
        }
        next();
      });
    };
  };
};
