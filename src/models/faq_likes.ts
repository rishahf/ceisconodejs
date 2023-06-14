import { createSchema, Type, typedModel } from 'ts-mongoose';
import * as Models from './index';
const type = [ "LIKE", "DISLIKE" ]

const FaqLikeSchema = createSchema({
    faq_id      : Type.ref(Type.objectId({ default: null })).to('faqs_products', <any>Models.FaqsProducts),
    user_id     : Type.ref(Type.objectId({ default: null })).to('users', <any>Models.Users),
    type        : Type.string({ default : "LIKE",  enum : type }),
    updated_at  : Type.string({ default : +new Date() }),
    created_at  : Type.string({ default: +new Date() })
})

const FaqLikes = typedModel("faq_likes", FaqLikeSchema);
export default FaqLikes