const fileTypes = ["image/png", "image/jpg", "image/jpeg", "image/svg"];

function checkFileValidation(fileType) {
  console.log(fileType);
  return !fileTypes.includes(fileType);
}

export { checkFileValidation };
