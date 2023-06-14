import mongoose from 'mongoose';

const match_data = async (user_id: string) => {
    try {

        return {
            $match: {
                user_id: mongoose.Types.ObjectId(user_id)  
            }
        }

    }
    catch (err) {
        throw err;
    }
}

const lookup_data = async () => {
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
        }

    }
    catch (err) {
        throw err;
    }
}

const unwind_data = async () => {
    try {

        return {
            $unwind: {
                path: "$product",
                preserveNullAndEmptyArrays: true
            }
        }

    }
    catch (err) {
        throw err;
    }
}

const redact_data = async(search : string) => {
    try {

        return {
            $redact : {
                $cond : {
                    if : {
                        $or : [
                            { $eq : [ search, undefined ] },
                            {
                                $regexMatch: { 
                                    input: "$product.name", 
                                    regex: search,
                                    options:'i' 
                                }
                            },
                            {
                                $regexMatch: { 
                                    input: "$order_status", 
                                    regex: search,
                                    options:'i' 
                                }
                            }
                        ]
                    },
                    then : "$$KEEP",
                    else : "$$PRUNE"
                }
            }
        }

    }
    catch(err) {
        throw err;
    }
}


const group_data = async()=>{
    try {

        return {
            $group: {
                _id: "$_id",
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
            $sort: { created_at: -1 }
        }

    }
    catch (err) {
        throw err;
    }
}

export {
    match_data,
    lookup_data,
    unwind_data,
    redact_data,
    group_data,
    sort_data
}