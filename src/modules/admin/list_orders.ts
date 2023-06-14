import mongoose from "mongoose";
const Schema = mongoose.Schema;
import moment from "moment";

const match = async (user_id: string) => {
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

const match_delete = async () => {
  try {
    return {
      $match: {
        is_deleted: false,
      },
    };
  } catch (err) {
    throw err;
  }
};

const set_type = async () => {
    return {
        $set: {
            type: "USER"
        },
    };
};

const set_seller_type = async () => {
    return {
        $set: {
            type: "SELLER"
        },
    };
};

const lookup_sellers = async () => {
    try {
        return {
            $lookup: {
                from: "sellers",
                let: { seller_id: "$seller_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$seller_id"],
                            }
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            image: 1
                        }
                    }
                ],
                as: "sellers"
            }
        };
    }
    catch (err) {
        throw err;
    }
}

const unwind_sellers = async () => {
    try {
        return {
            $unwind: {
                path: "$sellers",
                preserveNullAndEmptyArrays: true
            }
        };
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
                let: { user_id: "$user_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$user_id"],
                            }
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            profile_pic: 1
                        }
                    }
                ],
                as: "users"
            }
        };
    }
    catch (err) {
        throw err;
    }
}

const unwind_users = async () => {
    try {
        return {
            $unwind: {
                path: "$users",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
}

const lookup_products = async () => {
    try {
        return {
          $lookup: {
            from: "products",
            let: { product_id: "$product_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$product_id"],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  description: 1,
                  images: 1,
                  category_id: 1,
                  prodct_id: 1,
                  quantity: 1,
                },
              },
              {
                $lookup: {
                  from: "categories",
                  localField: "category_id",
                  foreignField: "_id",
                  as: "categories",
                },
              },
              {
                $unwind: "$categories",
              },
              {
                $lookup: {
                  from: "reviews",
                  localField: "_id",
                  foreignField: "product_id",
                  as: "reviews",
                },
              },
              {
                $group: {
                  _id: "$_id",
                  prd_id: { $first: "$prodct_id" },
                  name: { $first: "$name" },
                  description: { $first: "$description" },
                  images: { $first: "$images" },
                  product_quantity: { $first: "$quantity" },
                  category_id: { $first: "$categories" },
                  reviews: { $first: "$reviews" },
                  total_ratings: { $first: { $sum: "$reviews.ratings" } },
                  total_reviews: { $first: { $size: "$reviews" } },
                  total_avg_rating: { $first: { $avg: "$reviews.ratings" } },
                },
              },
            ],
            as: "products",
          },
        };
    }
    catch (err) {
        throw err;
    }
}

const lookup_products_review = async () => {
  try {
    return {
      $lookup: {
        from: "products",
        let: { product_id: "$product_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$product_id"],
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              description: 1,
              images: 1,
              category_id: 1,
              prodct_id: 1,
              quantity: 1,
              discount_price: 1,
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "categories",
            },
          },
          {
            $unwind: "$categories",
          },
          //   {
          //     $lookup: {
          //       from: "reviews",
          //       localField: "_id",
          //       foreignField: "product_id",
          //       as: "reviews",
          //     },
          //   },
          {
            $group: {
              _id: "$_id",
              prd_id: { $first: "$prodct_id" },
              name: { $first: "$name" },
              description: { $first: "$description" },
              images: { $first: "$images" },
              //   product_quantity: { $first: "$quantity" },
              product_price: { $first: "$discount_price" },
              category_name: { $first: "$categories.name" },
              //   reviews: { $first: "$reviews" },
              //   total_ratings: { $first: { $sum: "$reviews.ratings" } },
              //   total_reviews: { $first: { $size: "$reviews" } },
              //   total_avg_rating: { $first: { $avg: "$reviews.ratings" } },
            },
          },
        ],
        as: "products",
      },
    };
  } catch (err) {
    throw err;
  }
};


const unwind_products = async () => {
    try {
        return {
            $unwind: {
                path: "$products",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
}

const lookup_order = async () => {
    try {
        return {
            $lookup: {
                from: "orders",
                let: { order_id: "$order_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$order_id"],
                            }
                        }
                    }
                ],
                as: "orders"
            }
        }
    }
    catch (err) {
        throw err;
    }
}

const unwind_orders = async () => {
    try {
        return {
            $unwind: {
                path: "$orders",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
}

const lookup_order_products = async () => {
    try {
        return {
            $lookup: {
                from: "order_products",
                let: { product_id: "$product_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$product_id", "$$product_id"],
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "products",
                            let: { product_id: "$product_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$_id", "$$product_id"],
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        name: 1,
                                        description: 1,
                                        images: 1,
                                        category_id : 1,
                                        prodct_id:1,
                                        quantity:1,
                                    }
                                },
                                {
                                    $lookup : {
                                        from : "categories",
                                        localField : "category_id",
                                        foreignField : "_id",
                                        as : "categories"
                                    }
                                },
                                {
                                    $unwind : "$categories"
                                },
                                {
                                    $group : {
                                        _id : "$_id",
                                        prd_id:{$first:"$prodct_id"},
                                        name: { $first : "$name" },
                                        description: { $first : "$description" },
                                        images: { $first : "$images" },
                                        product_quantity: { $first : "$quantity" },
                                        category_id : { $first : "$categories" },
                                    }
                                }
                            ],
                            as: "products"
                        }
                    }
                ],
                as: "orders"
            }
        }
    }
    catch (err) {
        throw err;
    }
}

const lookup_order_product_review = async () => {
    try {
        return {
            $lookup: {
                from: "order_products",
                let: { product_id: "$product_id",order_product_id: "$order_product_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and:[
                                    { $eq: ["$product_id", "$$product_id"]  },
                                    { $eq: ["$_id", "$$order_product_id"]  }
                                ]
                                
                            }
                        }
                    },
                    // {
                    //     $lookup: {
                    //         from: "products",
                    //         let: { product_id: "$product_id" },
                    //         pipeline: [
                    //             {
                    //                 $match: {
                    //                     $expr: {
                    //                         $eq: ["$_id", "$$product_id"],
                    //                     }
                    //                 }
                    //             },
                    //             {
                    //                 $project: {
                    //                     _id: 1,
                    //                     name: 1,
                    //                     description: 1,
                    //                     images: 1,
                    //                     category_id : 1,
                    //                     prodct_id:1,
                    //                     quantity:1,
                    //                 }
                    //             },
                    //             {
                    //                 $lookup : {
                    //                     from : "categories",
                    //                     localField : "category_id",
                    //                     foreignField : "_id",
                    //                     as : "categories"
                    //                 }
                    //             },
                    //             {
                    //                 $unwind : "$categories"
                    //             },
                    //             {
                    //                 $group : {
                    //                     _id : "$_id",
                    //                     prd_id:{$first:"$prodct_id"},
                    //                     name: { $first : "$name" },
                    //                     description: { $first : "$description" },
                    //                     images: { $first : "$images" },
                    //                     product_quantity: { $first : "$quantity" },
                    //                     category_id : { $first : "$categories" },
                    //                 }
                    //             }
                    //         ],
                    //         as: "products"
                    //     }
                    // }
                ],
                as: "orders"
            }
        }
    }
    catch (err) {
        throw err;
    }
}

const unwind_order_products = async () => {
    try {
        return {
            $unwind: {
                path: "$orders",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
}

const lookup_order_review = async () => {
    try {
        return {
            $lookup: {
                from: "orders",
                let: { order_id: "$order_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                             
 
                                     $eq: ["$_id", "$$order_id"]  
                                
                                
                            }
                        }
                    },
                ],
                as: "order_data"
            }
        }
    }
    catch (err) {
        throw err;
    }
}

const unwind_order_review = async () => {
  try {
    return {
      $unwind: {
        path: "$order_data",
        preserveNullAndEmptyArrays: true,
      },
    };
  } catch (err) {
    throw err;
  }
};


const lookup_Rev_sellers = async () => {
    try {
        return {
            $lookup: {
                from: "sellers",
                let: { seller_id: "$seller_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$seller_id", "$$seller_id"],
                            }
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            image: 1
                        }
                    }
                ],
                as: "sellers"
            }
        };
    }
    catch (err) {
        throw err;
    }
}

const unwind_Rev_sellers = async () => {
    try {
        return {
            $unwind: {
                path: "$sellers",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
}

const filter_data = async (payload_data: any) => {
    try {

        console.log('admin order payload ', payload_data)
        let { search,product_id,seller_id,category_id: cat_level_1,subcategory_id: cat_level_2,sub_subcategory_id: cat_level_3, brand_id,min_price,max_price,order_status,payment_status,start_date,end_date,stock} = payload_data

        let set_start_date = moment.utc(start_date, "DD/MM/YYYY").startOf('day').format('x');
        let set_end_date = moment.utc(end_date, "DD/MM/YYYY").endOf('day').format('x')
        console.log("start_date...", start_date);
        console.log("end_date...",end_date)
        let stock_min:number, stock_max:number;
        if (stock == "OUT_OF_STOCK") {
          stock_min = 0; stock_max = 0;
        } else if (stock == "ALERT_OF_STOCK") {
          stock_min = 1; stock_max = 5;
        }
      
        if(order_status == 'ALL'){
            order_status = undefined
        }else if (order_status == "CONFIRMED") {
            order_status = "PLACED"
        }

        let brands = [];
        if (typeof brand_id == "object") {
            for (let value of brand_id) {
                brands.push(mongoose.Types.ObjectId(value));
            }
        }
        else if (typeof brand_id == "string") {
            brands.push(mongoose.Types.ObjectId(brand_id));
        }

        return {
            $redact: {
                $cond: {
                    if: {
                        $and: [
                            {
                                $or: [
                                    { $eq: [search, undefined] },
                                    {
                                        $regexMatch: {
                                            input: "$order_id",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$user_id.name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$seller_id.name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$product_id.name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$product_id.prd_id",
                                            regex: search,
                                            options: "i",
                                        }
                                    }, 
                                    {
                                        $regexMatch: {
                                            input: "$orderedId",
                                            regex: search,
                                            options: "i",
                                        }
                                    }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [cat_level_1, undefined] },
                                    { $eq: ["$category_id", mongoose.Types.ObjectId(cat_level_1)] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [cat_level_2, undefined] },
                                    { $eq: ["$subcategory_id", mongoose.Types.ObjectId(cat_level_2)] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [cat_level_3, undefined] },
                                    { $eq: ["$sub_subcategory_id", mongoose.Types.ObjectId(cat_level_3)] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [product_id, undefined] },
                                    { $eq: ["$product_id._id", mongoose.Types.ObjectId(product_id)] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [brand_id, undefined] },
                                    { $in: ["$brand_id", brands] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [order_status, undefined] },
                                    { $eq: ["$order_status", order_status] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [payment_status, undefined] },
                                    { $eq: ["$payment_status", payment_status] }
                                ]
                            },
                            {
                                $or:[
                                    { $eq: [seller_id, undefined] },
                                    { $eq: ["$sellerId", mongoose.Types.ObjectId(seller_id)] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [stock, undefined] },
                                    {
                                        $and:[
                                            { $gte: ["$product_quantity", stock_min] },
                                            { $lte: ["$product_quantity", stock_max] }
                                        ]
                                    }
                                    // { $lte: ["$product_quantity", stock] }
                                ]
                            },
                            {
                                $or: [
                                    {
                                        $and: [
                                            { $eq: [min_price, undefined] },
                                            { $eq: [max_price, undefined] }
                                        ]
                                    },
                                    {
                                        $and: [
                                            { $gte: ["$total_price", Number(min_price)] },
                                            { $lt: ["$total_price", Number(max_price)] }
                                        ]
                                    }
                                ]
                            },
                            {
                                $or: [
                                    {
                                        $and: [
                                            { $eq: [start_date, undefined] },
                                            { $eq: [end_date, undefined] }
                                        ]
                                    },
                                    {
                                        $and: [
                                            { $gte: ["$created_at", start_date] },
                                            { $lt: ["$created_at", end_date] }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE"
                }
            }
        }
    }
    catch (err) {
        throw err;
    }
};

const filter_reviews_data = async (payload_data: any) => {
    try {

        console.log('admin order payload ', payload_data)
        let { search,min_price,max_price,start_date,end_date} = payload_data

        let set_start_date = moment.utc(start_date, "DD/MM/YYYY").startOf('day').format('x');
        let set_end_date = moment.utc(end_date, "DD/MM/YYYY").endOf('day').format('x')

        return {
            $redact: {
                $cond: {
                    if: {
                        $and: [
                            {
                                $or: [
                                    { $eq: [search, undefined] },
                                    // {
                                    //     $regexMatch: {
                                    //         input: "$order_id",
                                    //         regex: search,
                                    //         options: "i",
                                    //     }
                                    // },
                                    {
                                        $regexMatch: {
                                            input: "$user_id.name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$seller_id.name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$product_id.name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$product_id.prd_id",
                                            regex: search,
                                            options: "i",
                                        }
                                    }
                                ]
                            },    
                            {
                                $or: [
                                    {
                                        $and: [
                                            { $eq: [min_price, undefined] },
                                            { $eq: [max_price, undefined] }
                                        ]
                                    },
                                    {
                                        $and: [
                                            { $gte: ["$product_id.product_price", Number(min_price)] },
                                            { $lt: ["$product_id.product_price", Number(max_price)] }
                                        ]
                                    }
                                ]
                            },
                            {
                                $or: [
                                    {
                                        $and: [
                                            { $eq: [start_date, undefined] },
                                            { $eq: [end_date, undefined] }
                                        ]
                                    },
                                    {
                                        $and: [
                                            { $gte: ["$created_at", start_date] },
                                            { $lt: ["$created_at", end_date] }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE"
                }
            }
        }
    }
    catch (err) {
        throw err;
    }
};

const filter_search = async (payload_data: any) => {
    try {

        console.log('list user_seller ', payload_data)
        let { search } = payload_data;

        return {
            $redact: {
                $cond: {
                    if: {
                        $and: [
                            {
                                $or: [
                                    { $eq: [search, undefined] },
                                    {
                                        $regexMatch: {
                                            input: "$name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$email",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                   
                                ]
                            }
                        ]
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE"
                }
            }
        }
    }
    catch (err) {
        throw err;
    }
};

const filter_sorting = async (payload:any) => {
  try {
    let { filter_by } = payload
    console.log("SORT Data type", typeof filter_by, " --> ", filter_by);
    if (filter_by == 1) {
      console.log(filter_by == 1);
      return {
        $sort: {
          _id: -1,
        },
      };
    } else if (filter_by == 2) {
      console.log(filter_by == 2);
      return {
        $sort: {
          _id: 1,
        },
      };
    } else {
      return {
        $sort: {
          created_at: -1,
        },
      };
    }
  } catch (err) {
    throw err;
  }
};

const group_data = async () => {
    try {
        return {
          $group: {
            _id: "$_id",
            order_id: { $first: "$orders.order_id" },
            orderedId: { $first: "$orders.order_id" },
            user_id: { $first: "$users" },
            seller_id: { $first: "$sellers" },
            product_id: { $first: "$products" },
            sellerId: { $first: "$sellers._id" },
            categoryId: { $first: "$products.category_id._id" },
            product_quantity: { "$first": "$products.product_quantity" },
            // price: { "$first": "$products" },
            // delivery_price: { "$first": "$products" },
            // coupon_discount: { "$first": "$products" },
            total_price: { $first: "$total_price" },
            total_earnings: { $first: "$total_earnings" },
            admin_commision: { $first: "$admin_commision" },
            // shippo_data: shippo_data,
            order_status: { $first: "$order_status" },
            payment_status:{$first: "$payment_status"},
            // delivery_status: { "$first": "$products" },
            // delivery_date: { "$first": "$products" },
            updated_at: { $first: "$updated_at" },
            created_at: { $first: "$created_at" },
          },
        };
    }
    catch (err) {
        throw err;
    }
}

const group_orderReview_data = async () => {
    try {
        return {
          $group: {
            _id: "$_id",
            title: { $first: "$title" },
            description: { $first: "$description" },
            ratings: { $first: "$ratings" },
            images: { $first: "$images" },
            // order_id: { $first: "$order_data.order_id" },
            // orderedId: { $first: "$orders.order_id" },
            user_id: { $first: "$users" },
            seller_id: { $first: "$sellers" },
            product_id: { $first: "$products" },
            product_order_id: { $first: "$orders.product_order_id" },
            // delivery_price: { "$first": "$products" },
            // coupon_discount: { "$first": "$products" },
            price: { $first: "$products.product_price" },
            // total_earnings: { $first: "$orders.total_earnings" },
            // admin_commision: { $first: "$orders.admin_commision" },
            // shippo_data: shippo_data,
            // delivery_status: { "$first": "$products" },
            // delivery_date: { "$first": "$products" },
            updated_at: { $first: "$updated_at" },
            created_at: { $first: "$created_at" },
          },
        };
    }
    catch (err) {
        throw err;
    }
}


let sort_data = async () => {
    try {
       
        return {
            $sort: {
                updated_at: -1
            }
        }
    }
    catch (err) {
        throw err;
    }
}

let sorting_data = async (data:any) => {
    try {
        let { min_price, max_price } = data;
        if(min_price && max_price){
            return {
              $sort: {
                price: 1,
              },
            };
        }else{
            return {
              $sort: {
                updated_at: -1,
              },
            };
        }
    }
    catch (err) {
        throw err;
    }
}

let sort_order_data = async () => {
  try {
    return {
      $sort: {
        updated_at: -1,
      },
    };
  } catch (err) {
    throw err;
  }
};

let sortOrder_data = async (data:any) => {
  try {
    let { min_price, max_price } = data;
    if(min_price && max_price){
         return {
           $sort: {
             total_price: 1,
           },
         };
    }else{
    return {
        $sort: {
            updated_at: -1,
        },
        };
    }
  } catch (err) {
    throw err;
  }
};

const skip_data = async (payload_data: any) => {
    try {

        let { pagination, limit }: any = payload_data
        let set_pagination: number = 0, set_limit: number = 0;

        if (pagination != undefined) { set_pagination = parseInt(pagination) }
        if (limit != undefined) { set_limit = parseInt(limit) }
        return {
            $skip: set_pagination * set_limit
        }

    }
    catch (err) {
        throw err;
    }
}

const limit_data = async (payload_data: any) => {
    try {

        let { limit }: any = payload_data
        let set_limit: number = 10;

        if (limit != undefined) { set_limit = parseInt(limit) }
        return {
            $limit: set_limit
        }

    }
    catch (err) {
        throw err;
    }
}







export {
  match,
  match_delete,
  lookup_sellers,
  unwind_sellers,
  lookup_users,
  unwind_users,
  lookup_products,
  lookup_products_review,
  unwind_products,
  lookup_order,
  unwind_orders,
  lookup_order_products,
  lookup_order_product_review,
  unwind_order_products,
  lookup_order_review,
  unwind_order_review,
  lookup_Rev_sellers,
  unwind_Rev_sellers,
  filter_data,
  filter_reviews_data,
  group_data,
  group_orderReview_data,
  sort_data,
  skip_data,
  limit_data,
  filter_sorting,
  set_type,
  set_seller_type,
  filter_search,
  sort_order_data,
  sorting_data,
  sortOrder_data,
};