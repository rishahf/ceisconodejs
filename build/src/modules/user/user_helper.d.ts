import mongoose from 'mongoose';
declare const match_data: (user_id: string) => Promise<{
    $match: {
        user_id: mongoose.Types.ObjectId;
    };
}>;
declare const lookup_data: () => Promise<{
    $lookup: {
        from: string;
        let: {
            product: string;
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
declare const unwind_data: () => Promise<{
    $unwind: {
        path: string;
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
export { match_data, lookup_data, unwind_data, redact_data, group_data, sort_data };
