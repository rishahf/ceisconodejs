import { createSchema, Type, typedModel } from 'ts-mongoose';
import {  Products , Sellers} from "./index";
const type = [ "FIXED", "PERCENTAGE" ]
const sub_type = [ "ONE_TIME", "FIXED_VALUE_TIME", "UNLIMITED_TIME" ]
const applicable_for = ["ALL","LIMITED"]
const added_by = [ "ADMIN", "SELLER"]
const language = ["ENGLISH", "ARABIC"];

const CouponSchema = createSchema({
    name            : Type.string({ default : null }),
    for_homepage    : Type.boolean({ default : false}),
    code            : Type.string({ default : null }),
    description     : Type.string({ default : null }),
    type            : Type.string({ default : "FIXED", enum : type }),
    sub_type        : Type.string({ default : "ONE_TIME", enum : sub_type }),
    start_date      : Type.string({ default : null }),
    end_date        : Type.string({ default : null }),
    price           : Type.number({ default : 0 }),
    percentage      : Type.number({ default : 0 }),
    max_discount    : Type.number({ default : 0 }),
    is_available    : Type.boolean({ default : true}),
    is_deleted      : Type.boolean({ default : false}),
    applicable_for  : Type.string({ default : "ALL", enum : applicable_for }),
    product_ids      : Type.array().of(Type.ref(Type.objectId({ default: null })).to('products', <any>Products)),
    added_by        : Type.string({ default : "ADMIN", enum : added_by }),
    seller_id       : Type.ref(Type.objectId({ default: null })).to('sellers', <any>Sellers),
    language            : Type.string({default: "ENGLISH", enum:language}),
    updated_at      : Type.string({ default : +new Date() }),
    created_at      : Type.string({ default : +new Date() })
})
const Coupons = typedModel('coupons', CouponSchema)
export default Coupons
