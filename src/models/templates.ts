import { createSchema, Type, typedModel } from 'ts-mongoose';
import * as Models from './index';

const TemplatesSchema = createSchema({
    title: Type.string({ default: null }),
    type: Type.string({ default: null }),
    subject: Type.string({ default: null }),
    html: Type.string({ default: null }),
    variables: Type.array().of(Type.ref(Type.objectId({ default: null })).to('variables', <any>Models.Variables)),
    created_at: Type.string({ default: +new Date() })
})

const Templates = typedModel('templates', TemplatesSchema);
export default Templates