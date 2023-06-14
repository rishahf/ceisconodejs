
import mongoose from 'mongoose';
import { app_constant } from '../../config/index'
let default_limit = app_constant.default_limit

const match_data = async (user_id: string) => {
    try {
        return {
            $match: {
                $or: [
                    { sent_by: mongoose.Types.ObjectId(user_id) },
                    { sent_to: mongoose.Types.ObjectId(user_id) }
                ]
            }
        }

    }
    catch (err) {
        throw err;
    }
}

const remove_empty_doc = async () => {
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
        }
    }
    catch (err) {
        throw err;
    }
}

const filter_users_by_name = async (search: string) => {
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
        }

    } catch (err) {
        throw err;
    }
}



const match_by_con_id = async (connection_id: string) => {
    try {

        return {
            $match: {
                _id: mongoose.Types.ObjectId(connection_id)
            }
        }

    }
    catch (err) {
        throw err;
    }
}

const set_data = async (user_id: string) => {
    try {

        return {
            $set: {
                other_user_id: {
                    $cond: {
                        if: {
                            $eq: ["$sent_by", mongoose.Types.ObjectId(user_id)]
                        },
                        then: "$sent_to",
                        else: "$sent_by"
                    }
                }
            }
        }

    }
    catch (err) {
        throw err;
    }
}


const lookup_users = async () => {
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
        }

    }
    catch (err) {
        throw err;
    }
}

const unwind_users = async () => {
    try {

        return {
            $unwind: {
                path: "$fetch_users",
                preserveNullAndEmptyArrays: true
            }
        }

    }
    catch (err) {
        throw err;
    }
}


const lookup_unread_chat = async (user_id: string) => {
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
        }

    }
    catch (err) {
        throw err;
    }
}

const count_message_data = async () => {
    try {

        return {
            $set: {
                count_message: { "$size": "$fetch_messages" }
            }
        }

    }
    catch (err) {
        throw err;
    }
}


const find_other_user_id = async (_id: string) => {
    try {

        return {
            $set: {
                other_user_id: {
                    $cond: {
                        if: {
                            $eq: [mongoose.Types.ObjectId(_id), "$sent_by"]
                        },
                        then: "$sent_to",
                        else: "$sent_by"
                    }
                }
            }
        }

    }
    catch (err) {
        throw err;
    }
}

const fetch_messages = async (user_id: string) => {
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
                                            { $eq: ["$sent_by", mongoose.Types.ObjectId(user_id)] },
                                            { $eq: ["$sent_to", mongoose.Types.ObjectId(user_id)] }
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
        }

    }
    catch (err) {
        throw err;
    }
}

const unwind_messages = async () => {
    try {

        return {
            $unwind: {
                path: "$fetch_messages",
                preserveNullAndEmptyArrays: true
            }
        }

    }
    catch (err) {
        throw err;
    }
}

const set_last_message = async () => {
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
        }

    }
    catch (err) {
        throw err;
    }
}


const group_data = async () => {
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
        }

    }
    catch (err) {
        throw err;
    }
}


let sort_data = async () => {
    try {

        return {
            $sort: { updated_at: -1 }
        }

    }
    catch (err) {
        throw err;
    }
}

const skip_data = async (pagination: any, limit: any) => {
    try {

        if (pagination != undefined || pagination != null && limit != undefined || limit != null) {

            if (limit == undefined) {
                return { $skip: parseInt(pagination) * 10 }
            } else {
                return { $skip: parseInt(pagination) * parseInt(limit) }
            }


        }
        else {
            return { $skip: 0 }
        }

    }
    catch (err) {
        throw err;
    }
}

const limit_data = async (limit: any) => {
    try {

        if (limit != undefined || limit != null) {
            // console.log("----limit_data-case_1---")
            return { $limit: parseInt(limit) }
        } else {
            // console.log("----limit_data-case_2---")
            return { $limit: 10 }
        }

    }
    catch (err) {
        throw err;
    }
}


export {
    filter_users_by_name,
    match_data,
    remove_empty_doc,
    match_by_con_id,
    set_data,
    lookup_users,
    unwind_users,
    lookup_unread_chat,
    count_message_data,
    find_other_user_id,
    fetch_messages,
    unwind_messages,
    set_last_message,
    group_data,
    sort_data,
    skip_data,
    limit_data
}