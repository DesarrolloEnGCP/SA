// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

module.exports.createBucket = async function() {
   const bucketName = 'bucket-name-paso';
  // Creates the new bucket
  await storage.createBucket(bucketName);
  console.log(`Bucket ${bucketName} created.`);
}

module.exports.listaBucket = async function() {
    try {
        // Makes an authenticated API request.
        const results = await storage.getBuckets();

        const [buckets] = results;

        console.log('Buckets:');
        buckets.forEach(bucket => {
            console.log(bucket.name);
        });
    } catch (err) {
        console.error('ERROR:', err);
    }
}

module.exports.listaArchivos = async function() {
    console.log("project: " + process.env.project);
    try {
        const bucket = storage.bucket('bucket-' + process.env.project);

        bucket.getFiles(function(err, files) {
            //console.log(err);
            //console.log(files);
            if (!err) {
                // files is an array of File objects.
                files.forEach(element => {
                    console.log(element.name);
                });
            } else {
                console.log("error: " + err);
            }
        });
    } catch (err) {
        console.error('ERROR:', err);
    }
}
