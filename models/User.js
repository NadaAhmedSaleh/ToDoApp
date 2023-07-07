import mongoose from "mongoose";
import messages from "../utils/messages.js";
import { regex } from "../utils/constants.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      validate: {
        validator: function isUsernameValid(v) {
          /**
           * the user name validation is:
           * - should start with an english alphabet in lower case
           * - can only include lower case english alphabet or english numbers (no allowed characters)
           * - word length can be [5,30]
           */
          return new RegExp(regex.USER_NAME).test(v);
        },
        message: (props) =>
          messages.general.invalidFieldErr(props.value, "username"),
      },
      required: [true, messages.general.missingFieldErr("Username")],
      index: true,
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: function isValidEmail(v) {
          /**
           * the user name validation is:
           * - it includes an "@" symbol
           * - it has a domain name with at least two letters (such as ".com" or ".org")
           * - it doesn't include any invalid characters (such as spaces or special characters other than  periods, underscores, percent signs, plus signs, or hyphens.)
           */
          return new RegExp(regex.EMAIL).test(v);
        },
        message: (props) =>
          messages.general.invalidFieldErr(props.value, "Email"),
      },
      required: [true, messages.general.missingFieldErr("Email")],
      index: true,
    },
    password: {
      type: String,
      required: [true, messages.general.missingFieldErr("Password")],
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: function isValidPhoneNumber(v) {
          /**
           * some of the phone numbers that matches this regex:
           * - +1 123-456-7890
           * - 1 (123) 456-7890
           * - 123.456.7890
           * - 44 1234567890
           */
          return new RegExp(regex.PHONE_NUMBER).test(v);
        },
        message: (props) =>
          messages.general.invalidFieldErr(props.value, "phone number"),
      },
    },
    tokenValidation: {
      // this is a random key that updated on logout and changing password to expire the old tokens
      type: String,
    },
  },
  { timestamps: true }
);

//------------------------------------------------------------------------------
const User = mongoose.model("User", userSchema);

export default User;
