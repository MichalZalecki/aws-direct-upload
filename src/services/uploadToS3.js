function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function uploadFile(file, signedRequest, url) {
  return fetch(signedRequest, { method: "PUT", body: file })
    .then(checkStatus)
    .then(() => ({ url }));
}

function getSignedRequest(file, dir) {
  const fileName = dir ? `${dir}/${file.name}` : file.name;

  return fetch(`/sign-s3?file-name=${fileName}&file-type=${file.type}`)
    .then(checkStatus)
    .then(response => response.json());
}

function uploadToS3(file, dir) {
  return getSignedRequest(file, dir)
    .then(({ signedRequest, url }) => uploadFile(file, signedRequest, url));
}

export default uploadToS3;
