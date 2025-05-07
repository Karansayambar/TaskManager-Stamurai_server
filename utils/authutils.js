const isEmailRegEx = ({ key }) => {
  const isEmail =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
      key
    );

  return isEmail;
};

const userDataValidation = ({ email, username, password, role }) => {
  return new Promise((resolve, reject) => {
    if (!email || !username || !password || !role)
      return reject("Missing user data");

    if (typeof password !== "string")
      return reject("Password should be a string");
    if (typeof email !== "string") return reject("Email should be a string");

    if (username.length < 3 || username.length > 15) {
      return reject("Username should be between 3-15 characters");
    }

    if (!isEmailRegEx({ key: email }))
      return reject("Email format is incorrect");

    resolve(); // Resolve the promise only if all validations pass
  });
};

const userDataValidationForLogin = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    if (!email || !password) return reject("Missing email or password");

    if (typeof email !== "string") return reject("Email should be a string");
    if (typeof password !== "string")
      return reject("Password should be a string");

    if (!isEmailRegEx({ key: email }))
      return reject("Email format is incorrect");

    resolve(); // Resolve the promise only if all validations pass
  });
};

module.exports = { userDataValidation, userDataValidationForLogin };
