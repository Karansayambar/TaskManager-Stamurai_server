const bcrypt = require("bcrypt");
const userSchema = require("../schemas/userSchema");
const { promise } = require("bcrypt/promises");
const ObjectId = require("mongodb").ObjectId;

class User {
  constructor({ username, email, password, role }) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  registerUser() {
    return new Promise(async (resolve, reject) => {
      try {
        const userExist = await userSchema.findOne({
          $or: [{ email: this.email }, { username: this.username }],
        });

        if (userExist) {
          if (userExist.email === this.email)
            return reject("Email Already Exists");
          if (userExist.username === this.username)
            return reject("Username Already Exists");
        }

        const bcryptPassword = await bcrypt.hash(
          this.password,
          parseInt(process.env.SALT)
        );
        console.log(" i am here 1");
        const user = new userSchema({
          username: this.username,
          email: this.email,
          password: bcryptPassword,
          role: this.role,
        });
        console.log("user", user);
        const userDB = await user.save();
        resolve(userDB);
      } catch (error) {
        reject(error);
      }
    });
  }

  static findUserWithKey({ key }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDB = await userSchema
          .findOne({
            $or: [
              ObjectId.isValid(key) ? { _id: key } : { email: key },
              { username: key },
            ],
          })
          .select("+password");

        if (!userDB) {
          return reject(new Error("User Not Found, Please Register First"));
        }
        resolve(userDB);
      } catch (error) {
        reject(error);
      }
    });
  }

  static deleteUserWithKey({ key }) {
    return new promise(async (resolve, reject) => {
      try {
        const userDB = await userSchema
          .findOneAndDelete({
            $or: [
              ObjectId.isValid(key) ? { _id: key } : { email: key },
              { userId: key },
            ],
          })
          .select("+password");
        if (!userDB) {
          return reject(new Error("User Not Found, Please Register First"));
        }
        resolve(userDB);
      } catch (error) {
        resolve(error);
      }
    });
  }
}

module.exports = User;
