import { createSchema, Type, typedModel } from 'ts-mongoose';
import * as Models from './index';

const language = ["ENGLISH","ARABIC"]

const FaqSchema = createSchema({
    question: Type.string({ default: null }),
    answer: Type.string({ default: null }),
    is_deleted:Type.boolean({default: false}),
    language: Type.string({default:"ENGLISH",enum:language}),
    created_at: Type.string({ default: +new Date() }),
})

const Faq = typedModel('faqs', FaqSchema);
export default Faq