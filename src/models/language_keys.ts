import { createSchema, Type, typedModel } from 'ts-mongoose';

const LanguageKeysSchema = createSchema({

      key: Type.string({ default: null }),
      english: Type.string({ default: null }),
      arabic: Type.string({ default: null }), 
      is_blocked: Type.boolean({ default: false }),
      is_deleted: Type.boolean({ default: false }),
      created_at: Type.string({ default: +new Date() })

})

const LanguageKeys = typedModel('languages_keys', LanguageKeysSchema);
export default LanguageKeys