// Upload a file to S3

import useLambda from "./lambda.js";

async function uploadImage(filename, base64) {
    try {
        const data = {
            imageName: filename,
            imageB64: base64
        }
        const response = await useLambda('uploadtos3', data);
        return response.url;
    } catch (error) {
        throw error;
    }
}

export default uploadImage;