import { createSchema, Type, typedModel } from 'ts-mongoose';
import { Admin } from './index';

const AdminFeesSchema = createSchema({
    fee_percent : Type.number({default : 0}),
    updated_at  : Type.string({ default: +new Date() }),
    created_at  : Type.string({ default: +new Date() })
})

const AdminFees = typedModel('admin_fees', AdminFeesSchema);
export default AdminFees