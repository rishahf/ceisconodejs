import { createSchema, Type, typedModel } from 'ts-mongoose';
const type = ['SUCCESS', 'ERROR']

const ResMessagesSchema = createSchema({
    type: Type.string({ enum: type }),
    message_type: Type.string({ default: null }),
    status_code: Type.number({ default: 0 }),
    msg_in_english: Type.string({ default: null }),
    msg_in_arabic: Type.string({ default: null }),
    created_at: Type.string({ default: +new Date() }),
})

const ResMessages = typedModel('res_messages', ResMessagesSchema);
export default ResMessages