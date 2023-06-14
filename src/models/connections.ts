import { createSchema, Type, typedModel } from 'ts-mongoose';
import * as Models from './index';

const ConnectionSchema = createSchema({
    sent_by: Type.ref(Type.objectId({ default: null })).to('users', <any>Models.Users),
    sent_to: Type.ref(Type.objectId({ default: null })).to('users', <any>Models.Users),
    last_message: Type.string({ default: null }),
    local_identifier : Type.string({ default: null }),
    token : Type.string({ default: null }),
    updated_at: Type.string({ default: null }),
    created_at: Type.string({ default: +new Date() })
})

const Connectiona = typedModel('connection', ConnectionSchema);
export default Connectiona