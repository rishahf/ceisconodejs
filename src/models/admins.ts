
import { createSchema, Type, typedModel } from 'ts-mongoose';

const address = Type.object().of({
      company                 : Type.string({ default: null }),
      country                 : Type.string({ default: null }),
      state                   : Type.string({ default: null }),
      city                    : Type.string({ default: null }),
      full_address            : Type.string({ default: null }),
});

const AdminSchema = createSchema({
      name              : Type.string({ default: null }),
      image             : Type.string({ default: null }),
      email             : Type.string({ default: null }),
      password          : Type.string({ default: null }),
      country_code      : Type.string({ default: null }),
      phone_number      : Type.number({default:null}),
      roles             : Type.array().of(Type.string({ default: [] })),
      super_admin       : Type.boolean({ default: false }),
      company           : Type.string({ default: null }),
      country           : Type.string({ default: null }),
      state             : Type.string({ default: null }),
      city              : Type.string({ default: null }),
      full_address      : Type.string({ default: null }),
      is_blocked        : Type.boolean({ default: false }),
      is_deleted        : Type.boolean({ default: false }),
      created_at        : Type.string({ default: +new Date() })
})

const Admin = typedModel('admins', AdminSchema);
export default Admin