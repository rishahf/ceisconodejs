"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sort_data = exports.group_data = exports.redact_data = exports.unwind_data = exports.lookup_data = exports.match_data = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const match_data = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $match: {
                user_id: mongoose_1.default.Types.ObjectId(user_id)
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.match_data = match_data;
const lookup_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "products",
                // localField: "product",
                // foreignField:"_id",
                let: { product: "$product" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$product"]
                            }
                        }
                    }
                ],
                as: "product"
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_data = lookup_data;
const unwind_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $unwind: {
                path: "$product",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_data = unwind_data;
const redact_data = (search) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $redact: {
                $cond: {
                    if: {
                        $or: [
                            { $eq: [search, undefined] },
                            {
                                $regexMatch: {
                                    input: "$product.name",
                                    regex: search,
                                    options: 'i'
                                }
                            },
                            {
                                $regexMatch: {
                                    input: "$order_status",
                                    regex: search,
                                    options: 'i'
                                }
                            }
                        ]
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE"
                }
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.redact_data = redact_data;
const group_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $group: {
                _id: "$_id",
                created_at: { "$first": "$created_at" },
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.group_data = group_data;
let sort_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $sort: { created_at: -1 }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.sort_data = sort_data;
