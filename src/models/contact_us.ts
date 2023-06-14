import { createSchema, Type, typedModel } from 'ts-mongoose';
import * as Models from './index';

const ContactUsSchema = createSchema({
    user_id: Type.ref(Type.objectId({ default: null })).to('users', <any>Models.Users),
    name: Type.string({ default: null }),
    email: Type.string({ default: null }),
    country_code: Type.string({ default: null }),
    phone_no: Type.number({ default: 0 }),
    message: Type.string({ default: null }),
    resolved: Type.boolean({ default: false }),
    is_deleted: Type.boolean({ default: false }),
    created_at: Type.string({ default: +new Date() })
})

const ContactUs = typedModel('contact_us', ContactUsSchema);
export default ContactUs