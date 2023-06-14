
import { createSchema, Type, typedModel } from 'ts-mongoose';
const social_type = [null, "GOOGLE", "FACEBOOK", "APPLE"]
const account_status = ["ACTIVATED", "DEACTIVATED"]
const deactivation_reason = [
    null,
    "1. Finding difficulty while using the service",
    "2. Not happy with the services",
    "3. Deactivating for temporary",
    "4. For other Reason"
]

const language = [ "ENGLISH", "ARABIC" ]

const UserSchema = createSchema({
    social_type         : Type.string({ default: null, enum: social_type }),
    social_token        : Type.string({ default: null }),
    profile_pic         : Type.string({ default: null }),
    name                : Type.string({ default: null }),
    email               : Type.string({ default: null }),
    country_code        : Type.string({ default: null }),
    phone_no            : Type.number({ default: 0 }),
    password            : Type.string({ default: null }),
    otp                 : Type.number({ default: 0 }),
    phone_otp           : Type.number({ default: 0 }),

    unique_code         : Type.string({ default: null }),
    fp_otp              : Type.number({ default: 0 }),
    fp_otp_verified     : Type.boolean({ default: false }),
    wrong_pwd_count     : Type.number({ default: 0 }),
    locked_till         : Type.string({ default : null}),

    customer_id         : Type.string({ default : null}),
    payment_id          : Type.string({default : null}),
    description         : Type.string({default : null}),
    admin_verified      : Type.boolean({ default : false }),
    email_verified      : Type.boolean({ default : false }),
    phone_verified      : Type.boolean({ default : false }),
    about               : Type.string({ default : null }),
    account_status      : Type.string({ default : "ACTIVATED", account_status : account_status }),
    deactivation_reason : Type.string({default : null,  enum: deactivation_reason}),
    is_blocked          : Type.boolean({ default : false }),
    is_deleted          : Type.boolean({ default : false }),
    language            : Type.string({default: "ENGLISH", enum:language}),
    created_at          : Type.string({ default : +new Date() })
})

const Users = typedModel('users', UserSchema);
export default Users