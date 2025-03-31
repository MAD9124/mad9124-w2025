const { Storage } = require('@google-cloud/storage');

const { BadRequestError } = require('../middleware/errors');

const storage = new Storage({
  keyFilename: process.env.GOOGLE_STORAGE_SECRET_PATH,
});

const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET_NAME);

const uploadMany = async (files = []) =>
  Promise.all(
    files.map(({ originalname, buffer }) => {
      // Prefix the filename with the current timestamp in milliseconds to allow duplicate file names to be saved.
      const filename = `${Date.now()}-${originalname}`;
      const blob = bucket.file(filename);
      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      // write streams emit different events depending on the status of the file.
      // we will want to handle the `error` and `finish` events
      // since we don't know how long the file upload will take,
      // we will create a Promise, and either `resovle` the promise
      // with the uploaded image url if it is successful,`
      // or `reject` the promise with an error`
      // if we receive an `error` event from the WriteStream.
      const url = new Promise((resolve, reject) => {
        // we define our event handlers first
        blobStream.on('error', (err) => {
          reject(new BadRequestError(err.message));
        });
        blobStream.on('finish', async () => {
          // this is the format of the public url created in Cloud Storage
          resolve(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
        });

        // then start the upload, and allow the event handlers created above to run
        // when the upload is complete / errors out
        blobStream.end(buffer);
      });
      return url;
    })
  );

module.exports = {
  uploadMany,
};
