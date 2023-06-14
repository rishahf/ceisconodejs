import { createSchema, Type, typedModel } from "ts-mongoose";
const account_status = ["ACTIVATED", "DEACTIVATED"]
// const deactivation_reason = [
//     null,
//     "1. Finding difficulty while using the service",
//     "2. Not happy with the services",
//     "3. Deactivating for temporary",
//     "4. For other Reason"
// ]

const language = ["ENGLISH", "ARABIC"];


const SellerSchema = createSchema({
    name                : Type.string({ default: null }),
    email               : Type.string({ default: null }),
    password            : Type.string({ default: null }),
    country_code        : Type.string({ default: null }),
    phone_number        : Type.number({ default: null }),
    image               : Type.string({ default: null }),
    email_otp           : Type.number({ default: 0 }),
    email_verified      : Type.boolean({ default: false }),
    unique_code         : Type.string({ default: null }),
    fp_otp              : Type.number({ default: 0 }),
    fp_otp_verified     : Type.boolean({ default: false }),
    company             : Type.string({ default: null }),
    country             : Type.string({ default: null }),
    state               : Type.string({ default: null }),
    city                : Type.string({ default: null }),
    pin_code            : Type.string({ default: null }),
    apartment_number    : Type.string({ default: null }),
    full_address        : Type.string({ default: null }),
    shippo_address_id   : Type.string({ default: null }),
    account_status      : Type.string({ default: "ACTIVATED", account_status : account_status }),
    deactivation_reason : Type.string({default : null}),
    is_deleted          : Type.boolean({ default: false }),
    is_blocked          : Type.boolean({ default: false }),
    language            : Type.string({default: "ENGLISH", enum:language}),
    created_at          : Type.string({ default: +new Date() }),
});

const Sellers = typedModel("sellers", SellerSchema);
export default Sellers;
