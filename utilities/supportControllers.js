const { unlink } = require('node:fs');
const path = require('node:path');
const { promisify } = require('node:util');
const sharp = require('sharp');

exports.uploadAdminImage = async (file, userid) => {
  const id = crypto.randomUUID().split('-').join('').slice(0, 10);
  const filename = `${id}-${userid}.jpg`;

  await sharp(file.buffer)
    .toFormat('jpg')
    .jpeg({ quality: 100 })
    .toFile(path.join(__dirname, `../public/images/admins/${filename}`));

  return filename;
};

exports.deleteAdminImage = async (filename) => {
  await promisify(unlink)(path.join(__dirname, `../public/images/admins/${filename}`));

  return true;
};
