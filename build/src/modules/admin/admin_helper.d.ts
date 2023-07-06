import mongoose from 'mongoose';
declare const match_data: (user_id: string) => Promise<{
    $match: {
        added_by: mongoose.Types.ObjectId;
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
declare const unwind_data: (match_id: any) => Promise<{
    $unwind: {
        path: any;
        preserveNullAndEmptyArrays: boolean;
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
declare const redact_product: (search: string) => Promise<{
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
declare const redact_brand: (search: string) => Promise<{
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
declare const redact_product_type: (search: string) => Promise<{
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
declare const lookup_reviews_data: () => Promise<{
    $lookup: {
        from: string;
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
        as: string;
    };
}>;
declare const set_review_data: () => Promise<{
    $set: {
        fetch_1_rating: {
            $filter: {
                input: string;
                as: string;
                cond: {
                    $eq: string[];
                };
            };
        };
    };
}>;
export { match_data, lookup_data, unwind_data, redact_data, redact_product, redact_brand, redact_product_type, group_data, sort_data, lookup_reviews_data, set_review_data };
