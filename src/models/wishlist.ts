import { createSchema, Type, typedModel } from 'ts-mongoose';
import * as Models from './index'


const WishlistSchema = createSchema({
    product_id: Type.ref(Type.objectId({ default: null })).to('products', <any>Models.Products),
    user_id: Type.ref(Type.objectId({ default: null })).to('users', <any>Models.Users),
    created_at: Type.string({ default: +new Date() })
})

const Wishlist = typedModel('wishlists', WishlistSchema);
export default Wishlist