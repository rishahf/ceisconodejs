"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const DAO = __importStar(require("../../DAO"));
const Models = __importStar(require("../../models"));
const index_1 = require("../../middlewares/index");
class product_delivery_location_module {
}
exports.default = product_delivery_location_module;
_a = product_delivery_location_module;
product_delivery_location_module.add = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { product_id, address, lng, lat, radius, units, delivery_time } = req.body;
        let data_to_save = {
            product_id: product_id,
            address: address,
            location: { type: "Point", coordinates: [lng, lat] },
            radius: radius,
            units: units,
            delivery_time: delivery_time,
            created_at: +new Date(),
        };
        if (!!address) {
            console.log('Inside address  --- ', address);
            let address_1 = address.split(',');
            data_to_save.address = address_1.length == 1 ? (address_1[address_1.length - 1]).trim().toLowerCase() : address;
            data_to_save.country = (address_1[address_1.length - 1]).trim().toLowerCase();
        }
        console.log('data_to_save --- ', data_to_save);
        let response = yield DAO.save_data(Models.Delivery_Locations, data_to_save);
        yield DAO.find_and_update(Models.Products, { _id: product_id }, { is_visible: true }, { new: true });
        return response;
    }
    catch (err) {
        throw err;
    }
});
product_delivery_location_module.edit = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e;
    try {
        let { _id, address, lng, lat, radius, units, delivery_time } = req.body;
        let query = { _id: _id };
        let update = {};
        if (!!address) {
            // update.address = address;
            let address_1 = address.split(',');
            console.log('address_1 -- ', address_1);
            console.log('address_2 -- ', (_c = (_b = String(address_1[address_1.length - 1])) === null || _b === void 0 ? void 0 : _b.trim()) === null || _c === void 0 ? void 0 : _c.toLowerCase());
            update.address = address_1.length == 1 ? (address_1[address_1.length - 1]).trim().toLowerCase() : address;
            update.country = (_e = (_d = (address_1[address_1.length - 1])) === null || _d === void 0 ? void 0 : _d.trim()) === null || _e === void 0 ? void 0 : _e.toLowerCase();
        }
        if (!!lng && !!lat) {
            update.location = { type: "Point", coordinates: [lng, lat] };
        }
        if (!!radius) {
            update.radius = radius;
        }
        if (!!units) {
            update.units = units;
        }
        if (!!delivery_time) {
            update.delivery_time = delivery_time;
        }
        let options = { new: true };
        let response = yield DAO.find_and_update(Models.Delivery_Locations, query, update, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
product_delivery_location_module.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, pagination, limit } = req.query;
        let query = {};
        if (!!_id) {
            query.product_id = _id;
        }
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let retrive_data = yield DAO.get_data(Models.Delivery_Locations, query, projection, options);
        let total_count = yield DAO.count_data(Models.Delivery_Locations, query);
        let response = {
            total_count: total_count,
            data: retrive_data
        };
        return response;
    }
    catch (err) {
        throw err;
    }
});
product_delivery_location_module.delete = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let projection = { __v: 0 };
        let option = { lean: true };
        let get_data = yield DAO.get_data(Models.Delivery_Locations, { _id: _id }, projection, option);
        let { product_id } = get_data[0];
        let query = { product_id: product_id };
        let get_locs = yield DAO.get_data(Models.Delivery_Locations, query, projection, option);
        if (get_locs && get_locs.length) {
            if (get_locs.length == 1) {
                let update = { is_visible: false };
                yield DAO.find_and_update(Models.Products, { _id: product_id }, update, { new: true });
            }
        }
        let remove = yield DAO.remove_data(Models.Delivery_Locations, { _id: _id });
        if (remove.deletedCount > 0) {
            let data = { message: `Delivery Location deleted successfully...` };
            return data;
        }
    }
    catch (err) {
        throw err;
    }
});
