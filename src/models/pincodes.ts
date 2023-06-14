import { createSchema, Type, typedModel } from 'ts-mongoose';
import * as Models from './index';

const PincodesSchema = createSchema({
    deliverable_location_id: Type.ref(Type.objectId({ default: null })).to('deliverable_locations', <any>Models.DeliverableLocations),
    pincode: Type.string({ default: null }),
    created_at: Type.string({ default: +new Date() }),
})

const PinCodes = typedModel('pincodes', PincodesSchema);
export default PinCodes