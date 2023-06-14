import { createSchema, Type, typedModel } from 'ts-mongoose';

const VariablesSchema = createSchema({
    name: Type.string({ default: null }),
    created_at: Type.string({ default: +new Date() })
})

const Variables = typedModel('variables', VariablesSchema);
export default Variables