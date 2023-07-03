import mongoose from 'mongoose';
declare const match_data: (user_id: string) => Promise<{
    $match: {
        $or: ({
            sent_by: mongoose.Types.ObjectId;
            sent_to?: undefined;
        } | {
            sent_to: mongoose.Types.ObjectId;
            sent_by?: undefined;
        })[];
    };
}>;
declare const remove_empty_doc: () => Promise<{
    $redact: {
        $cond: {
            if: {
                $eq: string[];
            };
            then: string;
            else: string;
        };
    };
}>;
declare const filter_users_by_name: (search: string) => Promise<{
    $redact: {
        $cond: {
            if: {
                $or: ({
                    $eq: string[];
                    $regexMatch?: undefined;
                } | {
                    $regexMatch: {
                        input: string;
                        regex: string;
                        options: string;
                    };
                    $eq?: undefined;
                })[];
            };
            then: string;
            else: string;
        };
    };
}>;
declare const match_by_con_id: (connection_id: string) => Promise<{
    $match: {
        _id: mongoose.Types.ObjectId;
    };
}>;
declare const set_data: (user_id: string) => Promise<{
    $set: {
        other_user_id: {
            $cond: {
                if: {
                    $eq: mongoose.Types.ObjectId[];
                };
                then: string;
                else: string;
            };
        };
    };
}>;
declare const lookup_users: () => Promise<{
    $lookup: {
        from: string;
        let: {
            other_user_id: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $eq: string[];
                };
            };
        }[];
        as: string;
    };
}>;
declare const unwind_users: () => Promise<{
    $unwind: {
        path: string;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
declare const lookup_unread_chat: (user_id: string) => Promise<{
    $lookup: {
        from: string;
        let: {
            user_id: string;
            sent_by: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $and: {
                        $eq: (string | number)[];
                    }[];
                };
            };
        }[];
        as: string;
    };
}>;
declare const count_message_data: () => Promise<{
    $set: {
        count_message: {
            $size: string;
        };
    };
}>;
declare const find_other_user_id: (_id: string) => Promise<{
    $set: {
        other_user_id: {
            $cond: {
                if: {
                    $eq: mongoose.Types.ObjectId[];
                };
                then: string;
                else: string;
            };
        };
    };
}>;
declare const fetch_messages: (user_id: string) => Promise<{
    $lookup: {
        from: string;
        let: {
            connection_id: string;
        };
        pipeline: ({
            $match: {
                $expr: {
                    $and: ({
                        $eq: string[];
                        $or?: undefined;
                    } | {
                        $or: {
                            $eq: mongoose.Types.ObjectId[];
                        }[];
                        $eq?: undefined;
                    })[];
                };
            };
            $sort?: undefined;
            $limit?: undefined;
        } | {
            $sort: {
                _id: number;
            };
            $match?: undefined;
            $limit?: undefined;
        } | {
            $limit: number;
            $match?: undefined;
            $sort?: undefined;
        })[];
        as: string;
    };
}>;
declare const unwind_messages: () => Promise<{
    $unwind: {
        path: string;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
declare const set_last_message: () => Promise<{
    $set: {
        get_last_message: {
            $cond: {
                if: {
                    $eq: string[];
                };
                then: string;
                else: {
                    $cond: {
                        if: {
                            $eq: string[];
                        };
                        then: string;
                        else: {
                            $cond: {
                                if: {
                                    $eq: string[];
                                };
                                then: string;
                                else: {
                                    $cond: {
                                        if: {
                                            $eq: string[];
                                        };
                                        then: string;
                                        else: {
                                            $cond: {
                                                if: {
                                                    $eq: string[];
                                                };
                                                then: string;
                                                else: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };
}>;
declare const group_data: () => Promise<{
    $group: {
        _id: string;
        other_user_id: {
            $first: string;
        };
        profile_pic: {
            $first: string;
        };
        full_name: {
            $first: string;
        };
        last_message: {
            $first: string;
        };
        unread_msgs: {
            $first: string;
        };
        local_identifier: {
            $first: string;
        };
        token: {
            $first: string;
        };
        updated_at: {
            $first: string;
        };
        created_at: {
            $first: string;
        };
    };
}>;
declare let sort_data: () => Promise<{
    $sort: {
        updated_at: number;
    };
}>;
declare const skip_data: (pagination: any, limit: any) => Promise<{
    $skip: number;
}>;
declare const limit_data: (limit: any) => Promise<{
    $limit: number;
}>;
export { filter_users_by_name, match_data, remove_empty_doc, match_by_con_id, set_data, lookup_users, unwind_users, lookup_unread_chat, count_message_data, find_other_user_id, fetch_messages, unwind_messages, set_last_message, group_data, sort_data, skip_data, limit_data };
