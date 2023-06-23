"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const ParcelSchema = (0, ts_mongoose_1.createSchema)({
    name: ts_mongoose_1.Type.string({ default: null }),
    description: ts_mongoose_1.Type.string({ default: null }),
    length: ts_mongoose_1.Type.string({ default: null }),
    width: ts_mongoose_1.Type.string({ default: null }),
    height: ts_mongoose_1.Type.string({ default: null }),
    distance_unit: ts_mongoose_1.Type.string({ default: null }),
    weight: ts_mongoose_1.Type.string({ default: null }),
    mass_unit: ts_mongoose_1.Type.string({ default: null }),
    shippo_parcel_id: ts_mongoose_1.Type.string({ default: null }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const Parcel = (0, ts_mongoose_1.typedModel)('parcels', ParcelSchema);
exports.default = Parcel;
