const fs = require('fs');
const errors = require('../core/errors');
const sharp = require('sharp');

const createStorageFolders = async (path) => {
  let localPath = '';
  const folders = path.split("/");
  await folders.map(folder => {
    localPath += folder + '/';
    if (!fs.existsSync(localPath)){
      fs.mkdirSync(localPath);
    }
  });
};

/**
 * @param {object} file
 * @return {object}
 */
const getFileData = async (file) => {
  const extensionParts = file.mimetype.split("/");
  const extension = extensionParts[extensionParts.length - 1];

  const fileData = {
    ...file,
    extension,
  };

  delete fileData.mv;
  delete fileData.data;
  return fileData;
};

/**
 * @param {object} file
 * @param {object} isAvatar
 * @param {boolean} path
 * @return {object}
 */
const uploadFile = async function (file, path, isAvatar = false ) {
  await createStorageFolders(path);
  const fileData = await getFileData(file);
  let uploadPath = `${path}/${file.name}`;

  if(isAvatar){
    fileData.name = `origin.${fileData.extension}`;
    uploadPath = `${path}/${fileData.name}`;
  }

  fileData.uploadPath = uploadPath;
  const response = await new Promise((resolve, reject) => {
    file.mv(uploadPath, function(err) {
      if(err){
        reject(err);
      }
      resolve();
    });
  }).then(() => {
    return {
      result: true,
      data: fileData,
    };
  }).catch(error => {
    return {
      result: false,
      error,
    };
  });

  if(response.result === false){
    throw new errors.file({message: response.error});
  }

  if(isAvatar){
    sharp(file.data)
      .resize(200, 200,{
        kernel: sharp.kernel.nearest,
        position: 'center',
        withoutEnlargement: true
      }).toFile(`${path}/small.${fileData.extension}`);
  }
  return fileData;
};

/**
 * @param {object} fileName
 * @param {string} path
 * @return {object}
 */
const deleteFile = async function (fileName, path ) {
  return fs.unlinkSync(`${path}/${fileName}`);
};


module.exports = ({
  uploadFile,
  deleteFile,
});
