import { createSchema, Type, typedModel } from 'ts-mongoose';
import { models } from "mongoose";
import * as Models from './index';

const ParcelSchema = createSchema({
    name                : Type.string({ default: null }),
    description         : Type.string({ default: null }),
    length              : Type.string({ default: null }),
    width               : Type.string({ default: null }),
    height              : Type.string({ default: null }),
    distance_unit       : Type.string({ default: null }),
    weight              : Type.string({ default: null }),
    mass_unit           : Type.string({ default: null }),
    shippo_parcel_id    : Type.string({ default: null }),
    created_at          : Type.string({ default: +new Date() })
})
const Parcel = typedModel('parcels', ParcelSchema)
export default Parcel
