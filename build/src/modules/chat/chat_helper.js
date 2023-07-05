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
exports.limit_data = exports.skip_data = exports.sort_data = exports.group_data = exports.set_last_message = exports.unwind_messages = exports.fetch_messages = exports.find_other_user_id = exports.count_message_data = exports.lookup_unread_chat = exports.unwind_users = exports.lookup_users = exports.set_data = exports.match_by_con_id = exports.remove_empty_doc = exports.match_data = exports.filter_users_by_name = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../../config/index");
let default_limit = index_1.app_constant.default_limit;
const match_data = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $match: {
                $or: [
                    { sent_by: mongoose_1.default.Types.ObjectId(user_id) },
                    { sent_to: mongoose_1.default.Types.ObjectId(user_id) }
                ]
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.match_data = match_data;
const remove_empty_doc = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $redact: {
                $cond: {
                    if: {
                        $eq: ["$last_message", "N"],
                    },
                    then: "$$PRUNE",
                    else: "$$KEEP"
                }
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.remove_empty_doc = remove_empty_doc;
const filter_users_by_name = (search) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $redact: {
                $cond: {
                    if: {
                        $or: [
                            { $eq: [search, undefined] },
                            {
                                $regexMatch: {
                                    input: "$full_name",
                                    regex: search,
                                    options: "i"
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
exports.filter_users_by_name = filter_users_by_name;
const match_by_con_id = (connection_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $match: {
                _id: mongoose_1.default.Types.ObjectId(connection_id)
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.match_by_con_id = match_by_con_id;
const set_data = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $set: {
                other_user_id: {
                    $cond: {
                        if: {
                            $eq: ["$sent_by", mongoose_1.default.Types.ObjectId(user_id)]
                        },
                        then: "$sent_to",
                        else: "$sent_by"
                    }
                }
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.set_data = set_data;
const lookup_users = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "users",
                let: { other_user_id: "$other_user_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$other_user_id"]
                            }
                        }
                    }
                ],
                as: "fetch_users"
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_users = lookup_users;
const unwind_users = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $unwind: {
                path: "$fetch_users",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_users = unwind_users;
const lookup_unread_chat = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "messages",
                let: { user_id: user_id, sent_by: "$other_user_id" },
                pipeline: [
                    {
                        $match: {
                            // $eq: ["$is_read", 0]
                            $expr: {
                                $and: [
                                    { $eq: ["$sent_by", "$$sent_by"] },
                                    { $eq: ["$sent_to", "$$user_id"] },
                                    { $eq: ["$is_read", 0] },
                                    // { $not: { $in: [mongoose.Types.ObjectId(user_id), "$read_by"] } }
                                ]
                            }
                        }
                    }
                ],
                as: "fetch_messages"
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_unread_chat = lookup_unread_chat;
const count_message_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $set: {
                count_message: { "$size": "$fetch_messages" }
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.count_message_data = count_message_data;
const find_other_user_id = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $set: {
                other_user_id: {
                    $cond: {
                        if: {
                            $eq: [mongoose_1.default.Types.ObjectId(_id), "$sent_by"]
                        },
                        then: "$sent_to",
                        else: "$sent_by"
                    }
                }
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.find_other_user_id = find_other_user_id;
const fetch_messages = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "messages",
                let: { connection_id: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$connection_id", "$$connection_id"] },
                                    {
                                        $or: [
                                            { $eq: ["$sent_by", mongoose_1.default.Types.ObjectId(user_id)] },
                                            { $eq: ["$sent_to", mongoose_1.default.Types.ObjectId(user_id)] }
                                        ]
                                    },
                                    // { $not: { $in: [user_id, "$deleted_for"] } }
                                ],
                            }
                        }
                    },
                    { $sort: { _id: -1 } },
                    { $limit: 1 }
                ],
                as: "fetch_messages"
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_messages = fetch_messages;
const unwind_messages = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $unwind: {
                path: "$fetch_messages",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_messages = unwind_messages;
const set_last_message = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $set: {
                get_last_message: {
                    $cond: {
                        if: { $eq: ["$fetch_messages.message_type", 'TEXT'] },
                        then: "$fetch_messages.message",
                        else: {
                            $cond: {
                                if: { $eq: ["$fetch_messages.message_type", 'IMAGE'] },
                                then: 'image',
                                else: {
                                    $cond: {
                                        if: { $eq: ["$fetch_messages.message_type", 'VIDEO'] },
                                        then: 'video',
                                        else: {
                                            $cond: {
                                                if: { $eq: ["$fetch_messages.message_type", 'AUDIO'] },
                                                then: 'audio',
                                                // else: document
                                                else: {
                                                    $cond: {
                                                        if: { $eq: ["$fetch_messages.message_type", 'DOCUMENT'] },
                                                        then: 'document',
                                                        else: 'N'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.set_last_message = set_last_message;
const group_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $group: {
                _id: "$_id",
                other_user_id: { "$first": "$other_user_id" },
                profile_pic: { "$first": "$fetch_users.profile_pic" },
                full_name: { "$first": "$fetch_users.name" },
                last_message: { "$first": "$get_last_message" },
                unread_msgs: { "$first": "$count_message" },
                local_identifier: { "$first": "$local_identifier" },
                token: { "$first": "$token" },
                updated_at: { "$first": "$updated_at" },
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
            $sort: { updated_at: -1 }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.sort_data = sort_data;
const skip_data = (pagination, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (pagination != undefined || pagination != null && limit != undefined || limit != null) {
            if (limit == undefined) {
                return { $skip: parseInt(pagination) * 10 };
            }
            else {
                return { $skip: parseInt(pagination) * parseInt(limit) };
            }
        }
        else {
            return { $skip: 0 };
        }
    }
    catch (err) {
        throw err;
    }
});
exports.skip_data = skip_data;
const limit_data = (limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (limit != undefined || limit != null) {
            // console.log("----limit_data-case_1---")
            return { $limit: parseInt(limit) };
        }
        else {
            // console.log("----limit_data-case_2---")
            return { $limit: 10 };
        }
    }
    catch (err) {
        throw err;
    }
});
exports.limit_data = limit_data;
