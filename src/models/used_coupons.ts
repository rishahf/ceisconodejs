import { createSchema, Type, typedModel } from 'ts-mongoose';
import { models } from "mongoose";

const UsedCouponsSchema = createSchema({
    user_id: Type.ref(Type.objectId({ default: null })).to('users', <any>models.Users),
    coupon_id: Type.ref(Type.objectId({ default: null })).to('coupons', <any>models.Coupons),
    is_deleted: Type.boolean({ default: false }),
    created_at: Type.string({ default: +new Date() })
})
const Used_Coupons = typedModel('used_coupons', UsedCouponsSchema)
export default Used_Coupons
 