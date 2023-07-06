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
const search_products = __importStar(require("./search_products"));
class product_variation_module {
}
exports.default = product_variation_module;
_a = product_variation_module;
product_variation_module.add = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { product_id_1, product_id_2 } = req.body;
        let options = { lean: true };
        let projection = { __v: 0 };
        let response;
        // let query:any = { product_id_1:product_id_1, product_id_2:product_id_2 }
        let query = {
            //   $or: [
            // {
            $and: [{ product_id_1: product_id_1 }, { product_id_2: product_id_2 }],
            // },
            // {
            //   $and: [{ product_id_1: product_id_2 }, { product_id_2: product_id_1 }],
            // },
            //   ],
        };
        let get_variants = yield DAO.get_data(Models.Product_Variations, query, projection, options);
        if (get_variants && get_variants.length) {
            throw yield (0, index_1.handle_custom_error)("ALREADY_ADDED_VARIANTS", "ENGLISH");
        }
        else {
            let data_to_save = {
                product_id_1: product_id_1,
                product_id_2: product_id_2,
                created_at: +new Date(),
            };
            let data_to_save2 = {
                product_id_1: product_id_2,
                product_id_2: product_id_1,
                created_at: +new Date(),
            };
            // await this.add_other_variants(product_id,variants_ids)
            response = yield DAO.save_data(Models.Product_Variations, data_to_save);
            yield DAO.save_data(Models.Product_Variations, data_to_save2);
            return response;
        }
    }
    catch (err) {
        throw err;
    }
});
product_variation_module.add_other_variants = (product_id, variants_ids) => __awaiter(void 0, void 0, void 0, function* () {
    let options = { lean: true };
    let projection = { __v: 0 };
    for (let i = 0; i < variants_ids.length; i++) {
        let insert_data = {
            product_id: variants_ids[i],
            variants_ids: product_id
        };
        let query_v = { product_id: variants_ids[i] };
        let getVariant1 = yield DAO.get_data(Models.Product_Variations, query_v, projection, options);
        console.log("getVariant1", getVariant1);
        if (getVariant1 && getVariant1.length) {
            let query_v2 = { product_id: variants_ids[i], variants_ids: { $nin: product_id } };
            let getVariant2 = yield DAO.get_data(Models.Product_Variations, query_v2, projection, options);
            if (getVariant2 && getVariant2.length) {
                let variants_arr = getVariant2[i].variants_ids;
                variants_arr.push(product_id);
                let update = {
                    variants_ids: variants_arr
                };
                yield DAO.find_and_update(Models.Product_Variations, query_v, update, options);
            }
        }
        else {
            yield DAO.save_data(Models.Product_Variations, insert_data);
        }
    }
    return;
});
// static list2 = async (req: any) => {
//     try {
//       let { product_id } = req.query;
//       let query: any = {
//         $or:[
//             { product_id_1: product_id }, 
//             { product_id_2: product_id },
//         ]
//       }
//       let projection = { __v: 0 };
//       let options = {lean :true}
//       let populate:any = [
//         { path:'product_id_1',select:'name images price discount discount_price' },
//         { path:'product_id_2',select:'name images price discount discount_price' }
//       ]
//       let product_variations = await DAO.populate_data(Models.Product_Variations,query,projection,options,populate);
//       let response = product_variations
//       return response;
//     }
//     catch (err) {
//         throw err;
//     }
// }
product_variation_module.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { product_id } = req.query;
        let query = [
            yield search_products.match_product_id_1_2(product_id),
            yield search_products.lookup_variants(),
            yield search_products.unwind_variant(),
            yield search_products.group_variants_data()
        ];
        let projection = { __v: 0 };
        let options = { lean: true };
        let product_variations = yield DAO.aggregate_data(Models.Product_Variations, query, options);
        let response = { data: product_variations };
        return response;
    }
    catch (err) {
        throw err;
    }
});
product_variation_module.delete = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let get_variation = yield DAO.get_data(Models.Product_Variations, { _id: _id }, { __v: 0 }, { lean: true });
        if (get_variation && get_variation.length) {
            let query = { product_id_1: get_variation[0].product_id_2, product_id_2: get_variation[0].product_id_1 };
            yield DAO.remove_data(Models.Product_Variations, query);
            let remove_variation = yield DAO.remove_data(Models.Product_Variations, { _id: _id });
            if (remove_variation.deletedCount > 0) {
                let data = { message: `Product Variation deleted successfully...` };
                return data;
            }
        }
    }
    catch (err) {
        throw err;
    }
});
product_variation_module.edit = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, variants_ids } = req.body;
        let options = { new: true };
        let projection = { __v: 0 };
        let update = { updated_at: +new Date() };
        let query = { _id: _id };
        let other_variants = yield DAO.get_data(Models.Product_Variations, query, projection, options);
        // let variants_arr:any = other_variants[0].variants_ids;
        // console.log('1 ', variants_arr);
        // console.log('2 ',variants_ids.length)
        if (!!variants_ids) {
            for (let i = 0; i < variants_ids.length; i++) {
                console.log("variants_ids ", variants_ids);
                let other_variants = yield DAO.get_data(Models.Product_Variations, { product_id: variants_ids[i] }, projection, options);
                //   variants_arr.push(variants_ids[i]);
                console.log("other_variants ", other_variants);
            }
            update.variants_ids = variants_ids;
        }
        let response = yield DAO.find_and_update(Models.Product_Variations, query, update, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
product_variation_module.add1 = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { product_id, variants_ids } = req.body;
        let options = { lean: true };
        let projection = { __v: 0 };
        let response;
        let query = { product_id: product_id, variants_ids: { $in: variants_ids } };
        let get_variants = yield DAO.get_data(Models.Product_Variations, query, projection, options);
        console.log('get_var ', get_variants);
        if (get_variants && get_variants.length) {
            throw yield (0, index_1.handle_custom_error)("ALREADY_ADDED_VARIANTS", "ENGLISH");
        }
        let query2 = { product_id: product_id };
        let get_variants2 = yield DAO.get_data(Models.Product_Variations, query2, projection, options);
        if (get_variants2 && get_variants2.length) {
            let var_arr = get_variants2[0].variants_ids;
            for (let i = 0; i < variants_ids.length; i++) {
                var_arr.push(variants_ids[i]);
            }
            let update = {
                variants_ids: var_arr
            };
            response = yield DAO.find_and_update(Models.Product_Variations, query2, update, options);
            yield _a.add_other_variants(product_id, variants_ids);
        }
        else {
            let data_to_save = {
                product_id: product_id,
                variants_ids: variants_ids,
                created_at: +new Date(),
            };
            yield _a.add_other_variants(product_id, variants_ids);
            response = yield DAO.save_data(Models.Product_Variations, data_to_save);
        }
        return response;
    }
    catch (err) {
        throw err;
    }
});
product_variation_module.list1 = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { product_id, pagination, limit } = req.query;
        // let query: any = {}
        // if (!!_id) { query._id = _id }
        // if (!!product_id) { query.product_id = product_id }
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let query = [
            yield search_products.match_product_id(product_id),
            //   await search_products.lookup_variant_head(),
            //   await search_products.unwind_variant_head(),
            yield search_products.lookup_variants(),
            yield search_products.group_variants_data(),
        ];
        let product_variations = yield DAO.aggregate_data(Models.Product_Variations, query, options);
        // let total_count = await DAO.count_data(Models.Product_Variations, query)
        // let response = {
        //     // total_count: total_count,
        //     data: product_variations[0]
        // }
        let response = product_variations[0];
        return response;
    }
    catch (err) {
        throw err;
    }
});
product_variation_module.delete1 = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let remove_variation = yield DAO.remove_data(Models.Product_Variations, { _id: _id });
        if (remove_variation.deletedCount > 0) {
            let data = { message: `Product Variation deleted successfully...` };
            return data;
        }
    }
    catch (err) {
        throw err;
    }
});
product_variation_module.list_variants_to_add = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let options = { lean: true };
        let { _id: seller_id } = req.user_data;
        let query = [
            yield search_products.match_data(seller_id),
            yield search_products.lookup_brands(),
            yield search_products.unwind_brands(),
            yield search_products.lookup_categories(),
            yield search_products.unwind_categories(),
            yield search_products.lookup_subcategories(),
            yield search_products.unwind_subcategories(),
            yield search_products.lookup_sub_subcategories(),
            yield search_products.unwind_sub_subcategories(),
            yield search_products.lookup_seller(),
            yield search_products.unwind_seller(),
            yield search_products.filter_data(req.query),
            yield search_products.group_data(),
            yield search_products.sort_data(),
            yield search_products.skip_data(req.query),
            yield search_products.limit_data(req.query)
        ];
        let Products = yield DAO.aggregate_data(Models.Products, query, options);
        // if (_id != undefined) {
        //     let get_variants:any = await DAO.get_data(Models.Product_Variations,{product_id:_id}, {__v:0},{lean:true})
        //     console.log('variants ', get_variants[0])
        //     for(let i=0; i<get_variants.length; i++){
        //         console.log(get_variants[i]);
        //     }
        // }
        let query_count = [
            yield search_products.match_data(seller_id),
            yield search_products.lookup_brands(),
            yield search_products.unwind_brands(),
            yield search_products.lookup_categories(),
            yield search_products.unwind_categories(),
            yield search_products.lookup_subcategories(),
            yield search_products.unwind_subcategories(),
            yield search_products.lookup_sub_subcategories(),
            yield search_products.unwind_sub_subcategories(),
            yield search_products.lookup_seller(),
            yield search_products.unwind_seller(),
            yield search_products.filter_data(req.query),
            yield search_products.group_data(),
            yield search_products.sort_data()
        ];
        let CountProducts = yield DAO.aggregate_data(Models.Products, query_count, options);
        let response = {
            total_count: CountProducts.length,
            data: Products
        };
        return response;
    }
    catch (err) {
        throw err;
    }
});
