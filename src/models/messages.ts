import { createSchema, Type, typedModel } from 'ts-mongoose';
import * as Models from './index';
const type = [null, 'NORMAL', 'REPLY', 'FORWARDED', 'DELETED']
const message_type = [null, 'TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT']

const MessagesSchema = createSchema({
    connection_id: Type.ref(Type.objectId({ default: null })).to('connections', <any>Models.Connections),
    sent_by: Type.ref(Type.objectId({ default: null })).to('users', <any>Models.Users),
    sent_to: Type.ref(Type.objectId({ default: null })).to('users', <any>Models.Users),
    type : Type.string({ default: null, enum: type }),
    message_type: Type.string({ default: null, enum: message_type }),
    message: Type.string({ default: null }),
    media_url : Type.string({ default: null }),
    front_img : Type.string({ default: null }),
    local_identifier : Type.string({ default: null }),
    message_id : Type.ref(Type.objectId({ default: null })).to('messages', <any>Models.Messages),
    delete_type : Type.number({ default: 0 }),
    deleted_for : Type.array().of(Type.ref(Type.objectId({ default: null })).to('users', <any>Models.Users)),
    token : Type.string({ default: null }),
    is_read : Type.number({ default: 0 }),
    created_at: Type.string({ default: +new Date() })
})

const Messages = typedModel('messages', MessagesSchema);
export default Messages
