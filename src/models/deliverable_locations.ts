import { createSchema, Type, typedModel } from 'ts-mongoose';
import * as Models from './index';

const deliverableLocationsSchema = createSchema({
    product_id: Type.ref(Type.objectId({ default: null })).to('products', <any>Models.Products),
    city_name: Type.string({ default: null }),
    is_deleted:Type.boolean({default: false}),
    created_at: Type.string({ default: +new Date() }),
})

const DeliverableLocations = typedModel('deliverable_locations',  deliverableLocationsSchema);
export default DeliverableLocations