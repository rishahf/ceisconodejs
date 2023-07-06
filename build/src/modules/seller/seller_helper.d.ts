import mongoose from "mongoose";
declare const match_data: (seller_id: string) => Promise<{
    $match: {
        added_by: mongoose.Types.ObjectId;
    };
}>;
declare const match_product_id: (_id: string) => Promise<{
    $match: {
        _id: mongoose.Types.ObjectId;
    };
}>;
declare const match_order_id: (_id: string) => Promise<{
    $match: {
        _id: mongoose.Types.ObjectId;
    };
}>;
declare const redact_data: (search: string) => Promise<{
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
declare const lookup_data: (collection: any, match_id: any) => Promise<{
    $lookup: {
        from: any;
        let: {
            new_id: any;
        };
        pipeline: ({
            $match: {
                $expr: {
                    $eq: string[];
                };
            };
            $project?: undefined;
        } | {
            $project: {
                _id: number;
                name: number;
            };
            $match?: undefined;
        })[];
        as: any;
    };
}>;
declare const lookup_User_data: () => Promise<{
    $lookup: {
        from: string;
        let: {
            user_id: string;
        };
        pipeline: ({
            $match: {
                $expr: {
                    $eq: string[];
                };
            };
            $project?: undefined;
        } | {
            $project: {
                _id: number;
                name: number;
                profile_pic: number;
            };
            $match?: undefined;
        })[];
        as: string;
    };
}>;
declare const lookup_address_data: () => Promise<{
    $lookup: {
        from: string;
        let: {
            address_id: string;
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
declare const lookup_user_ratings: () => Promise<{
    $lookup: {
        from: string;
        let: {
            user_id: string;
            product_id: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $and: {
                        $eq: string[];
                    }[];
                };
            };
        }[];
        as: string;
    };
}>;
declare const lookup_product_detail: (collection_name: any) => Promise<{
    $lookup: {
        from: any;
        let: {
            product_id: string;
        };
        pipeline: ({
            $match: {
                $expr: {
                    $eq: string[];
                };
            };
            $project?: undefined;
        } | {
            $project: {
                _id: number;
                key: number;
                value: number;
                unique_number: number;
            };
            $match?: undefined;
        })[];
        as: any;
    };
}>;
declare const lookup_services_highlights: (collection_name: any) => Promise<{
    $lookup: {
        from: any;
        let: {
            product_id: string;
        };
        pipeline: ({
            $match: {
                $expr: {
                    $eq: string[];
                };
            };
            $project?: undefined;
        } | {
            $project: {
                content: number;
            };
            $match?: undefined;
        })[];
        as: any;
    };
}>;
declare const lookup_common_collection: (collection_name: any) => Promise<{
    $lookup: {
        from: any;
        let: {
            product_id: string;
        };
        pipeline: {
            $match: {
                $expr: {
                    $eq: string[];
                };
            };
        }[];
        as: any;
    };
}>;
declare const lookup_orders_data: (collection: any, match_id: any, seller_id: any) => Promise<{
    $lookup: {
        from: any;
        let: {
            new_id: any;
        };
        pipeline: ({
            $match: {
                $expr: {
                    $and: {
                        $eq: string[];
                    }[];
                };
            };
            $lookup?: undefined;
        } | {
            $lookup: {
                from: string;
                let: {
                    category_id: string;
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
            $match?: undefined;
        })[];
        as: any;
    };
}>;
declare const lookup_reviews_data: () => Promise<{
    $lookup: {
        from: string;
        let: {
            new_id: string;
        };
        pipeline: ({
            $match: {
                $expr: {
                    $eq: string[];
                };
            };
            $lookup?: undefined;
            $unwind?: undefined;
        } | {
            $lookup: {
                from: string;
                let: {
                    user_id: string;
                };
                pipeline: ({
                    $match: {
                        $expr: {
                            $eq: string[];
                        };
                    };
                    $project?: undefined;
                } | {
                    $project: {
                        _id: number;
                        name: number;
                        profile_pic: number;
                    };
                    $match?: undefined;
                })[];
                as: string;
            };
            $match?: undefined;
            $unwind?: undefined;
        } | {
            $unwind: {
                path: string;
                preserveNullAndEmptyArrays: boolean;
            };
            $match?: undefined;
            $lookup?: undefined;
        })[];
        as: string;
    };
}>;
declare const unwind_review_user_data: (match_id: any) => Promise<{
    $unwind: {
        path: any;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
declare const group_data: () => Promise<{
    $group: {
        _id: string;
        created_at: {
            $first: string;
        };
    };
}>;
declare let sort_data: () => Promise<{
    $sort: {
        created_at: number;
    };
}>;
declare const set_ratings: () => Promise<{
    $set: {
        one_rate_count: {
            $size: {
                $filter: {
                    input: string;
                    as: string;
                    cond: {
                        $and: {
                            $eq: (string | number)[];
                        }[];
                    };
                };
            };
        };
        two_rate_count: {
            $size: {
                $filter: {
                    input: string;
                    as: string;
                    cond: {
                        $and: {
                            $eq: (string | number)[];
                        }[];
                    };
                };
            };
        };
        three_rate_count: {
            $size: {
                $filter: {
                    input: string;
                    as: string;
                    cond: {
                        $and: {
                            $eq: (string | number)[];
                        }[];
                    };
                };
            };
        };
        four_rate_count: {
            $size: {
                $filter: {
                    input: string;
                    as: string;
                    cond: {
                        $and: {
                            $eq: (string | number)[];
                        }[];
                    };
                };
            };
        };
        five_rate_count: {
            $size: {
                $filter: {
                    input: string;
                    as: string;
                    cond: {
                        $and: {
                            $eq: (string | number)[];
                        }[];
                    };
                };
            };
        };
    };
}>;
declare const unwind_data: (match_id: any) => Promise<{
    $unwind: {
        path: any;
        preserveNullAndEmptyArrays: boolean;
    };
}>;
export { match_data, match_product_id, match_order_id, lookup_data, lookup_User_data, lookup_address_data, lookup_user_ratings, lookup_common_collection, lookup_product_detail, lookup_services_highlights, redact_data, lookup_orders_data, lookup_reviews_data, unwind_review_user_data, group_data, sort_data, set_ratings, unwind_data, };
