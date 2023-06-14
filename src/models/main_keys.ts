import { createSchema, Type, typedModel } from 'ts-mongoose';
import { models } from "mongoose";

const type = [ "WEBSITE", "SELLER" ]
const MainKeySchema = createSchema({
    name: Type.string({ default: null }),
    type: Type.string({ default: null }),
    created_at: Type.string({ default: +new Date() }),
})
const MainKeys = typedModel('main_keys', MainKeySchema)
export default MainKeys
