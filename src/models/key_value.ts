import { createSchema, Type, typedModel } from 'ts-mongoose';
import { models } from "mongoose";


const KeyValueSchema = createSchema({
    main_key_id: Type.ref(Type.objectId({ default: null })).to('main_keys', <any>models.Main_keys),
    key: Type.string({ default: null }),
    value: Type.string({ default: null }),
    language: Type.string({ default: null }),
    created_at: Type.string({ default: +new Date() })
})
const KeyValues = typedModel('key_values', KeyValueSchema)
export default KeyValues
