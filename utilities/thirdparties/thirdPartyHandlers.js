/* 
  ================== 
  THESE FUNCTION RESTRUCTURE THIRD PARY RESPONSE FOR OUR LOCAL FUNCTIONS
  This helps so that we dont modify our local code to suit a new third part 
  of the same function or when a third pary change their response data structure
*/

function mongoDbMultipleErrors(error) {
  const [first, ...others] = Object.entries(error.errors);
  const [key, value] = first;

  return { key, value, others };
}

exports.attatchLocalType = (error) => {
  if (error.kind === 'ObjectId') error.localType = 'objectId';
  if (error.code == 11000) error.localType = 'uniqueField';
  if (error.errors && !error.errors.length) {
    const { value } = mongoDbMultipleErrors(error);
    if (value?.kind === 'minlength') error.localType = 'minLength';
  }

  return error;
};

exports.mongoDbDuplicateError = (error) => {
  const [[key, value]] = Object.entries(error.keyValue);

  return { key, value };
};

exports.mongoDbObjectIdError = (error) => {
  return { value: error.value };
};

exports.mongoDbMinLengthError = (error) => {
  const { key, value } = mongoDbMultipleErrors(error);

  return { key, value: value.properties.minlength };
};
