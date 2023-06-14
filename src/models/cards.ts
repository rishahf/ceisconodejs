import { createSchema, Type, typedModel } from 'ts-mongoose';
import { models } from "mongoose";


const CardSchema = createSchema({
   user_id           : Type.ref(Type.objectId({ default: null })).to('users', <any>models.Users),
   payment_method    : Type.string({ default: null }),
   brand             : Type.string({ default: null }),
   exp_month         : Type.number({ default:0 }),
   exp_year          : Type.number({ default:0 }),
   last4             : Type.number({ default: 0 }),
   fingerprint       : Type.string({ default: null }),
   is_deleted        : Type.boolean({ default:false }),
   is_default        : Type.boolean({ default: false }),
   is_saved        : Type.boolean({ default: false }),
   created_at        : Type.string({ default: +new Date() })
})
const Cards = typedModel('cards', CardSchema)
export default Cards

