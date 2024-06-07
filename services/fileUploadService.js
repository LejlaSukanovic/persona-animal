const { getStorageBucket } = require('../Database/firebaseInit');
const path = require('path');

const uploadImage = async (file, naziv) => {
    const bucket = getStorageBucket();
    const fileName = `${naziv}.jpg`;
    const filePath = `images/${fileName}`;
    const fileUpload = bucket.file(filePath);

    try {
        await fileUpload.save(file.buffer, {
            contentType: file.mimetype,
            public: true,
            metadata: {
                firebaseStorageDownloadTokens: 'public'
            }
        });
        const downloadURL = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
        return { success: true, url: downloadURL };
    } catch (error) {
        console.error('Error uploading image:', error);
        return { success: false, message: error.message };
    }
};

module.exports = { uploadImage };
