"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.something_went_wrong = exports.inavlid_token = exports.otp_not_verified = exports.invalid_otp = exports.phone_no_already_exists = exports.email_already_exists = exports.data_already_exists = exports.unauthorized = exports.invalid_password = exports.invalid_credentials = exports.no_data_found = exports.default_msg = void 0;
let default_msg = {
    status_code: 400,
    custom_msg: 'Bad Request',
    type: 'default_msg'
};
exports.default_msg = default_msg;
let no_data_found = {
    status_code: 400,
    custom_msg: 'No data found',
    type: 'no_data_found'
};
exports.no_data_found = no_data_found;
let invalid_credentials = {
    status_code: 400,
    custom_msg: 'Inavalid login details',
    type: 'invalid_credentials'
};
exports.invalid_credentials = invalid_credentials;
let invalid_password = {
    status_code: 400,
    custom_msg: 'password entered is incorrect.',
    type: 'invalid_password'
};
exports.invalid_password = invalid_password;
let unauthorized = {
    status_code: 400,
    custom_msg: 'You are not authorized to perform this action.',
    type: 'unauthorized'
};
exports.unauthorized = unauthorized;
let data_already_exists = {
    status_code: 400,
    custom_msg: 'This phone number or email address, alreday exists.',
    type: 'data_already_exists'
};
exports.data_already_exists = data_already_exists;
let email_already_exists = {
    status_code: 400,
    custom_msg: 'This email address alreday exists, Please try again.',
    type: 'email_already_exists'
};
exports.email_already_exists = email_already_exists;
let phone_no_already_exists = {
    status_code: 400,
    custom_msg: 'This phone number alreday exists Please try again.',
    type: 'phone_no_already_exists'
};
exports.phone_no_already_exists = phone_no_already_exists;
let invalid_otp = {
    status_code: 400,
    custom_msg: 'Invalid OTP',
    type: 'invalid_otp'
};
exports.invalid_otp = invalid_otp;
let otp_not_verified = {
    status_code: 400,
    custom_msg: 'OTP not verified',
    type: 'otp_not_verified'
};
exports.otp_not_verified = otp_not_verified;
let inavlid_token = {
    status_code: 400,
    custom_msg: 'inavlid token',
    type: 'inavlid_token'
};
exports.inavlid_token = inavlid_token;
let something_went_wrong = {
    status_code: 400,
    custom_msg: 'something went wrong',
    type: 'something_went_wrong'
};
exports.something_went_wrong = something_went_wrong;
