"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DAO = __importStar(require("./../DAO/index"));
const Models = __importStar(require("./../models/index"));
const index_1 = require("../middlewares/index");
const Brand_list_1 = require("../../Brand_list");
const create_admin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check admin exist or not
        let query = { email: "admin@gmail.com" };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Admin, query, projection, options);
        if (fetch_data.length == 0) {
            let default_password = 'qwerty';
            let password = yield index_1.helpers.bcrypt_password(default_password);
            let save_data = {
                name: "super admin",
                image: null,
                email: "admin@gmail.com",
                password: password,
                roles: [],
                super_admin: true,
                created_at: +new Date()
            };
            yield DAO.save_data(Models.Admin, save_data);
        }
    }
    catch (err) {
        throw err;
    }
});
const create_admin_seller = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check seller exist or not
        let query = { email: "admin@gmail.com" };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Sellers, query, projection, options);
        if (fetch_data.length == 0) {
            let default_password = 'qwerty';
            let password = yield index_1.helpers.bcrypt_password(default_password);
            let save_data = {
                name: "super admin",
                email: "admin@gmail.com",
                password: password,
                created_at: +new Date()
            };
            yield DAO.save_data(Models.Sellers, save_data);
        }
    }
    catch (err) {
        throw err;
    }
});
const add_all_brands = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield DAO.remove_many(Models.Brands, {});
        let options = { multi: true };
        yield DAO.save_data(Models.Brands, Brand_list_1.brands);
    }
    catch (err) {
        throw err;
    }
});
const response_messages = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data_to_push = [
            {
                type: "ERROR",
                message_type: "UNAUTHORIZED",
                status_code: 401,
                msg_in_english: "You are not authorized to perform this action.",
                msg_in_arabic: "لست مخولاً بتنفيذ هذا الإجراء.",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "EMAIL_ALREADY_EXISTS",
                status_code: 400,
                msg_in_english: "This email address already exists. Please try again.",
                msg_in_arabic: "عنوان البريد الإلكتروني هذا موجود بالفعل. حاول مرة اخرى.",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "ACCOUNT_DELETED",
                status_code: 400,
                msg_in_english: "Sorry this account is temporary deleted by admin.",
                msg_in_arabic: "عذرا هذا الحساب تم حذفه مؤقتا من قبل المشرف.",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "ACCOUNT_BLOCKED",
                status_code: 400,
                msg_in_english: 'Sorry this account is temporary blocked please contact with "E-commerce fashion"',
                msg_in_arabic: "عذرا ، تم حظر هذا الحساب مؤقتا من قبل المشرف.",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "ACCOUNT_DEACTIVATED",
                status_code: 400,
                msg_in_english: "Sorry this account is temporary deactivated.",
                msg_in_arabic: "عذرا هذا الحساب معطل مؤقتا.",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "INCORRECT_PASSWORD",
                status_code: 400,
                msg_in_english: "The password you entered is incorrect. Please try again.",
                msg_in_arabic: "كلمة المرور التي أدخلتها غير صحيحة. حاول مرة اخرى.",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "NO_DATA_FOUND",
                status_code: 400,
                msg_in_english: "No data found.",
                msg_in_arabic: "لاتوجد بيانات.",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "INVALID_OBJECT_ID",
                status_code: 400,
                msg_in_english: "Sorry this is not a valid object _id.",
                msg_in_arabic: "عذرا ، هذا ليس كائن صالح _id.",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "CANNOT_CHANGE_PASSWORD",
                status_code: 401,
                msg_in_english: "You cann't change your own password.",
                msg_in_arabic: "لست مخولاً بتنفيذ هذا الإجراء.",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "CANNOT_ADD_THIS_COUPON_TO_HOMEPAGE",
                status_code: 400,
                msg_in_english: "Sorry this coupon cannot add to homepage.",
                msg_in_arabic: "آسف هذه القسيمة لا يمكن أن تضيف إلى الصفحة الرئيسية.",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "DELIVERY_NOT_AVAILABLE",
                status_code: 400,
                msg_in_english: "Delivery not available to this address",
                msg_in_arabic: "التسليم غير متوفر لهذا العنوان.",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "ALREADY_ADDED_VARIANTS",
                status_code: 400,
                msg_in_english: "Already added",
                msg_in_arabic: "تم الاضافة مسبقا.",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "PHONE_NO_ALREADY_EXISTS",
                status_code: 400,
                msg_in_english: "This phone number already exists Please try again.",
                msg_in_arabic: "رقم الهاتف هذا موجود بالفعل يرجى المحاولة مرة أخرى.",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "WRONG_OTP",
                status_code: 400,
                msg_in_english: "The OTP entered is incorrect. Please enter correct OTP or try regenerating the OTP",
                msg_in_arabic: "كلمة المرور التي تم إدخالها غير صحيحة. الرجاء إدخال OTP الصحيح أو محاولة إعادة إنشاء OTP",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "WRONG_UNIQUE_CODE",
                status_code: 400,
                msg_in_english: "This is not a valid wrong unique code",
                msg_in_arabic: "كلمة المرور التي تم إدخالها غير صحيحة. الرجاء إدخال OTP الصحيح أو محاولة إعادة إنشاء OTP",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "OTP_NOT_VERIFIED",
                status_code: 400,
                msg_in_english: "OTP not verified",
                msg_in_arabic: "كلمة المرور التي تم إدخالها غير صحيحة. الرجاء إدخال OTP الصحيح أو محاولة إعادة إنشاء OTP",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "LOGIN_VIA_GOOGLE",
                status_code: 400,
                msg_in_english: "This email address already exists. Please try again with gmail login",
                msg_in_arabic: "عنوان البريد الإلكتروني هذا موجود بالفعل. يرجى المحاولة مرة أخرى مع تسجيل الدخول إلى gmail",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "LOGIN_VIA_FACEBOOK",
                status_code: 400,
                msg_in_english: "This email address already exists. Please try again with facebook login",
                msg_in_arabic: "عنوان البريد الإلكتروني هذا موجود بالفعل. يرجى المحاولة مرة أخرى مع تسجيل الدخول إلى الفيسبوك",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "LOGIN_VIA_APPLE",
                status_code: 400,
                msg_in_english: "This email address already exists. Please try again with apple login",
                msg_in_arabic: "عنوان البريد الإلكتروني هذا موجود بالفعل. يرجى المحاولة مرة أخرى مع تسجيل الدخول مع أبل",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "LOGIN_VIA_EMAIL_PASSWORD",
                status_code: 400,
                msg_in_english: "This email address already exists. Please try again with email and password",
                msg_in_arabic: "عنوان البريد الإلكتروني هذا موجود بالفعل. يرجى المحاولة مرة أخرى باستخدام البريد الإلكتروني وكلمة المرور",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "EMAIL_NOT_REGISTERED",
                status_code: 400,
                msg_in_english: "This email id is not registered with us",
                msg_in_arabic: "عنوان البريد الإلكتروني المقدم غير مسجل لدينا",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "PHONE_NO_NOT_REGISTERED",
                status_code: 400,
                msg_in_english: "The phone no provided is not registered with us",
                msg_in_arabic: "عنوان البريد الإلكتروني المقدم غير مسجل لدينا",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "OLD_PASSWORD_MISMATCH",
                status_code: 400,
                msg_in_english: "Sorry old password is incorrect please try again",
                msg_in_arabic: "آسف كلمة المرور القديمة غير صحيحة يرجى المحاولة مرة أخرى",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "BACKUP_UPLOAD_FAILED",
                status_code: 400,
                msg_in_english: "Sorry db backup upload failed",
                msg_in_arabic: "عذرا فشل تحميل نسخة احتياطية ديسيبل",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "INSUFFICIENT_PERMISSIONS",
                status_code: 400,
                msg_in_english: "Sorry you are not having sufficient permission to perform this action",
                msg_in_arabic: "آسف ليس لديك الإذن الكافي لتنفيذ هذا الإجراء",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "BANNER_ADD_ERROR",
                status_code: 400,
                msg_in_english: "Sorry you can not add more than 6 banners",
                msg_in_arabic: "آسف ليس لديك الإذن الكافي لتنفيذ هذا الإجراء",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "SOMETHING_WENT_WRONG",
                status_code: 400,
                msg_in_english: "Sorry this is not a valid type",
                msg_in_arabic: "لم يتم العثور على عرض في NFT هذا",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "TOP_DEALS_ADD_ERROR",
                status_code: 400,
                msg_in_english: "Sorry you can not add more than 3 top deals",
                msg_in_arabic: "آسف ليس لديك الإذن الكافي لتنفيذ هذا الإجراء",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "STYLE_FOR_ERROR",
                status_code: 400,
                msg_in_english: "Sorry you can not add more than 3 style for sections",
                msg_in_arabic: "آسف ليس لديك الإذن الكافي لتنفيذ هذا الإجراء",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "STYLE_FOR_CATEGORIES_ERROR",
                status_code: 400,
                msg_in_english: "Sorry you can not add more than 4 style for categories sections",
                msg_in_arabic: "آسف ليس لديك الإذن الكافي لتنفيذ هذا الإجراء",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "CART_ERROR",
                status_code: 400,
                msg_in_english: "Item already added in cart",
                msg_in_arabic: "آسف ليس لديك الإذن الكافي لتنفيذ هذا الإجراء",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "COUPON_ALREADY_USED",
                status_code: 400,
                msg_in_english: "This coupon is already used",
                msg_in_arabic: "آسف ليس لديك الإذن الكافي لتنفيذ هذا الإجراء",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "YOU_CANNO_PLACE_THIS_ORDER",
                status_code: 400,
                msg_in_english: "You cannot place the order, please check your order items",
                msg_in_arabic: "لا يمكنك تقديم الطلب ، يرجى التحقق من عناصر طلبك",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "THIS_COUPON_IS_NOT_APPLICABLE",
                status_code: 400,
                msg_in_english: "This coupon is not applicable on this product.",
                msg_in_arabic: "هذه القسيمة لا تنطبق على هذا المنتج.",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "COUPON_NOT_AVAILABLE",
                status_code: 400,
                msg_in_english: "This coupon is not available",
                msg_in_arabic: "آسف ليس لديك الإذن الكافي لتنفيذ هذا الإجراء",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "CHECK_COUPON_AMOUNT",
                status_code: 400,
                msg_in_english: "Please enter amount less than or equals 100",
                msg_in_arabic: "آسف ليس لديك الإذن الكافي لتنفيذ هذا الإجراء",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "INVALID_COUPON",
                status_code: 400,
                msg_in_english: "Invalid coupon",
                msg_in_arabic: "قسيمة غير صالحة",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "INAVLID_CARD_ID",
                status_code: 400,
                msg_in_english: "This is not a valid card id.",
                msg_in_arabic: "الرجاء إدخال مبلغ أقل من أو يساوي 100",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "ORDER_CREATION_FAILED",
                status_code: 400,
                msg_in_english: "Something went wrong while creating order",
                msg_in_arabic: "آسف ليس لديك الإذن الكافي لتنفيذ هذا الإجراء",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "ITEM_ALREAY_EXISTS",
                status_code: 400,
                msg_in_english: "Item already in cart",
                msg_in_arabic: "آسف ليس لديك الإذن الكافي لتنفيذ هذا الإجراء",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "INSUFFICIENT_QUANTITY",
                status_code: 400,
                msg_in_english: "Insufficient quantity",
                msg_in_arabic: "آسف ليس لديك الإذن الكافي لتنفيذ هذا الإجراء",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "FAQ_ALREADY_LIKED",
                status_code: 400,
                msg_in_english: "You already liked this FAQ",
                msg_in_arabic: "آسف ليس لديك الإذن الكافي لتنفيذ هذا الإجراء",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "FAQ_ALREADY_DISLIKED",
                status_code: 400,
                msg_in_english: "You already disliked this FAQ",
                msg_in_arabic: "آسف ليس لديك الإذن الكافي لتنفيذ هذا الإجراء",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "ORDER_ALREADY_CANCELLED",
                status_code: 400,
                msg_in_english: "You already cancelled this order",
                msg_in_arabic: "آسف ليس لديك الإذن الكافي لتنفيذ هذا الإجراء",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "REVIEW_ALREADY_ADDED",
                status_code: 400,
                msg_in_english: "You already added a review",
                msg_in_arabic: "آسف ليس لديك الإذن الكافي لتنفيذ هذا الإجراء",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "ACCOUNT_LOCKED",
                status_code: 401,
                msg_in_english: "Your account has been locked for 15 mins",
                msg_in_arabic: "لست مخولاً بتنفيذ هذا الإجراء.",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "CATEGORY_EXIST",
                status_code: 400,
                msg_in_english: "Category name already exist",
                msg_in_arabic: "اسم الفئة موجود بالفعل",
                created_at: +new Date(),
            },
            {
                type: "ERROR",
                message_type: "BRAND_EXIST",
                status_code: 400,
                msg_in_english: "Brand name already exist",
                msg_in_arabic: "اسم العلامة التجارية موجود بالفعل",
                created_at: +new Date(),
            },
        ];
        return data_to_push;
    }
    catch (err) {
        throw err;
    }
});
// const bootstrap_res_msgs = async () => {
//     try {
//         let query = {}
//         let projection = { __v: 0 }
//         let options = { lean: true }
//         let fetch_data: any = await DAO.get_data(Models.ResMessages, query, projection, options);
//         if (fetch_data.length) {
//             let data_to_push = await response_messages()
//             let filter_data = lodash.xorBy(fetch_data, data_to_push, 'message_type')
//             if (filter_data.length > 0) {
//                 let options = { multi: true }
//                 await DAO.insert_many(Models.ResMessages, filter_data, options);
//             }
//         }
//         else {
//             let data_to_push = await response_messages()
//             let options = { multi: true }
//             await DAO.insert_many(Models.ResMessages, data_to_push, options);
//         }
//     }
//     catch (err) {
//         throw err;
//     }
// }
const bootstrap_res_msgs = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield DAO.remove_many(Models.ResMessages, {});
        let data_to_push = yield response_messages();
        let options = { multi: true };
        yield DAO.insert_many(Models.ResMessages, data_to_push, options);
    }
    catch (err) {
        throw err;
    }
});
const bootstrap_homepage_sections = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {};
        let projection = { __v: 0 };
        let options = { lean: true };
        let retrive_sections = yield DAO.get_data(Models.HomePageSections, query, projection, options);
        if (retrive_sections.length == 0) {
            let data_to_save = {
                top_banners: true,
                middle_banners: true,
                bottom_banners: true,
                deal_of_the_day: true,
                top_deals: true,
                fashion_deals: true,
                style_for_categories: true,
                featured_categories: true,
                shop_with_us: true,
                best_on_ecom: true,
                updated_at: +new Date(),
                created_at: +new Date()
            };
            yield DAO.save_data(Models.HomePageSections, data_to_save);
        }
    }
    catch (err) {
        throw err;
    }
});
const bootstrap_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield create_admin();
        yield bootstrap_res_msgs();
        yield bootstrap_homepage_sections();
        yield create_admin_seller();
        yield add_all_brands();
    }
    catch (err) {
        throw err;
    }
});
exports.default = bootstrap_data;
