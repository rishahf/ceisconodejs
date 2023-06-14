import mongoose from "mongoose";
const Schema = mongoose.Schema;
import moment from "moment";

const match = async (seller_id: string) => {
    try {
        return {
            $match: {
                seller_id: mongoose.Types.ObjectId(seller_id)
            }
        }
    }
    catch (err) {
        throw err;
    }
}

const match_transactions = async (seller_id: string) => {
    try {
        return {
          $match: {
            $and: [
              {
                seller_id: mongoose.Types.ObjectId(seller_id),
              },
              {
                order_status: "DELIVERED",
              },
            ],
          },
        };
    }
    catch (err) {
        throw err;
    }
}


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
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            prodct_id:1,
                            name: 1,
                            description: 1,
                            images: 1,
                            category_id : 1,
                            quantity:1,
                            discount_price:1,
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
                        $lookup : {
                            from : "subcategories",
                            localField : "category_id",
                            foreignField : "category_id",
                            as : "subcategories"
                        }
                    },
                    {
                        $unwind : "$subcategories"
                    },
                    {
                        $lookup : {
                            from : "reviews",
                            localField : "_id",
                            foreignField : "product_id",
                            as : "reviews"
                        }
                    },
                    {
                        $group : {
                            _id : "$_id",
                            prodct_id:{ $first : "$prodct_id" },
                            name: { $first : "$name" },
                            quantity:{$first : "$quantity"},
                            description: { $first : "$description" },
                            images: { $first : "$images" },
                            categoryId : { $first : "$categories._id" },
                            category_id : { $first : "$categories" },
                            subcategoryId : { $first : "$subcategories._id" },
                            reviews:{$first:"$reviews"}
                            // subcategory_id : { $first : "$subcategories" }
                        }
                    }
                ],
                as: "products"
            }
        }
    }
    catch (err) {
        throw err;
    }
}

const lookup_orders_review_products = async () => {
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
              prodct_id: 1,
              name: 1,
              description: 1,
              images: 1,
              category_id: 1,
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
          {
            $group: {
              _id: "$_id",
              prodct_id: { $first: "$prodct_id" },
              name: { $first: "$name" },
              quantity: { $first: "$quantity" },
              description: { $first: "$description" },
              price:{$first:"$discount_price"},
              images: { $first: "$images" },
              categoryId: { $first: "$categories._id" },
              category_name: { $first: "$categories.name" },
            //   subcategoryId: { $first: "$subcategories._id" },
            //   reviews: { $first: "$reviews" },
              // subcategory_id : { $first : "$subcategories" }
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

const lookup_review_products = async (seller_id:any) => {
    try {
        return {
            $lookup: {
                from: "products",
                let: { product_id: "$product_id" , seller_id:seller_id},
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and:[
                                    {$eq: ["$_id", "$$product_id"] },
                                    {$eq: ["$added_by", "$$seller_id"],}
                                ]
                            
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            prodct_id:1,
                            description: 1,
                            images: 1,
                            category_id : 1,
                            discount_price:1
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
                            name: { $first : "$name" },
                            description: { $first : "$description" },
                            images: { $first : "$images" },
                            prodct_id : { $first : "$prodct_id" },
                            discount_price : { $first : "$discount_price" },
                            category_name : { $first : "$categories.name" },
                            // reviews:{$first:"$reviews"}
                            // subcategory_id : { $first : "$subcategories" }
                        }
                    }
                ],
                as: "products"
            }
        }
    }
    catch (err) {
        throw err;
    }
}

const unwind_review_products = async () => {
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
                  },
                },
              }
            ],
            as: "orders",
          },
        };
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

const lookup_order_product = async () => {
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
                  },
                },
              }
            ],
            as: "order_product",
          },
        };
    }
    catch (err) {
        throw err;
    }
}

const unwind_ordered_product = async () => {
    try {
        return {
            $unwind: {
                path: "$order_product",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
}


const lookup_card = async () => {
    try {
        return {
          $lookup: {
            from: "cards",
            let: { card_id: "$orders.card_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$card_id"],
                  },
                },
              },
            ],
            as: "card",
          },
        };
    }
    catch (err) {
        throw err;
    }
}


const unwind_card = async () => {
  try {
    return {
      $unwind: {
        path: "$card",
        preserveNullAndEmptyArrays: true,
      },
    };
  } catch (err) {
    throw err;
  }
};

const lookup_ordered_products = async (seller_id:any) => {
  try {
    return {
      $lookup: {
        from: "products",
        let: { product_id: "$product_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$_id", "$$product_id"] },
                  { $eq: ["$added_by", seller_id] },
                ],
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
              from: "subcategories",
              localField: "category_id",
              foreignField: "category_id",
              as: "subcategories",
            },
          },
          {
            $unwind: "$subcategories",
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
              name: { $first: "$name" },
              description: { $first: "$description" },
              images: { $first: "$images" },
              categoryId: { $first: "$categories._id" },
              category_id: { $first: "$categories" },
              subcategoryId: { $first: "$subcategories._id" },
              reviews: { $first: "$reviews" },
              // subcategory_id : { $first : "$subcategories" }
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


const unwind_ordered_products = async () => {
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

const filter_data = async (payload_data: any) => {
    try {
        console.log(payload_data);
        
        let {search,product_id,category_id: cat_level_1,subcategory_id: cat_level_2,sub_subcategory_id: cat_level_3,brand_id,min_price,max_price,order_status,payment_status,start_date,end_date,stock} = payload_data;

        // let set_start_date = moment.utc(start_date, "DD/MM/YYYY").startOf('day').format('x');
        // let set_end_date = moment.utc(end_date, "DD/MM/YYYY").endOf('day').format('x');

        if(order_status == 'ALL'){
            order_status = undefined
        }else if( order_status == 'CONFIRMED'){
            order_status = 'PLACED'
        }
        let stock_min, stock_max;
        if (stock == "OUT_OF_STOCK") {
          stock_min = 0; stock_max = 0;
        } else if (stock == "ALERT_OF_STOCK") {
          stock_min = 1; stock_max = 5;
        }
        console.log('stock ', stock)
        let brands = [];
        if (typeof brand_id == "object") {
          for (let value of brand_id) {
            brands.push(mongoose.Types.ObjectId(value));
          }
        } else if (typeof brand_id == "string") {
          brands.push(mongoose.Types.ObjectId(brand_id));
        } else if (typeof product_id == "string") {
          brands.push(mongoose.Types.ObjectId(product_id));
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
                                            input: "$cate_name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                     {
                                        $regexMatch: {
                                            input: "$products.category_id.name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                     {
                                        $regexMatch: {
                                            input: "$prdt_id",
                                            regex: search,
                                            options: "i",
                                        }
                                    }//prdt_id
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
                                            { $eq: [end_date, undefined] },
                                        ],
                                    },
                                    {
                                        $and: [
                                            { $gte: ["$created_at", start_date] },
                                            { $lte: ["$created_at", end_date] },
                                        ],
                                    }
                                ],
                            },
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

const filter_review_order_data = async (payload_data: any) => {
    try {
        console.log(payload_data);
        
        let {search,min_price,max_price,start_date,end_date} = payload_data;
        // let set_start_date = moment.utc(start_date, "DD/MM/YYYY").startOf('day').format('x');
        // let set_end_date = moment.utc(end_date, "DD/MM/YYYY").endOf('day').format('x');
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
                                            input: "$cate_name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                     {
                                        $regexMatch: {
                                            input: "$product_id.prodct_id",
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
                                            { $eq: [end_date, undefined] },
                                        ],
                                    },
                                    {
                                        $and: [
                                            { $gte: ["$created_at", start_date] },
                                            { $lte: ["$created_at", end_date] },
                                        ],
                                    }
                                ],
                            },
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

const filter_transaction_data = async (payload_data: any) => {
    try {
        console.log(payload_data);
        
        let {search,product_id,category_id: cat_level_1,subcategory_id: cat_level_2,sub_subcategory_id: cat_level_3,brand_id,min_price,max_price,order_status,payment_status,start_date,end_date} = payload_data;

        let set_start_date = moment.utc(start_date, "DD/MM/YYYY").startOf('day').format('x');
        let set_end_date = moment.utc(end_date, "DD/MM/YYYY").endOf('day').format('x');
        console.log('set ', set_start_date, set_end_date)

        let brands = [];
        if (typeof brand_id == "object") {
          for (let value of brand_id) {
            brands.push(mongoose.Types.ObjectId(value));
          }
        } else if (typeof brand_id == "string") {
          brands.push(mongoose.Types.ObjectId(brand_id));
        } else if (typeof product_id == "string") {
          brands.push(mongoose.Types.ObjectId(product_id));
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
                                            input: "$cate_name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                     {
                                        $regexMatch: {
                                            input: "$products.category_id.name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$product_id.prodct_id",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
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
                                            { $eq: [end_date, undefined] },
                                        ],
                                    },
                                    {
                                        $and: [
                                            { $gte: ["$created_at", start_date] },
                                            { $lte: ["$created_at", end_date] },
                                        ],
                                    }
                                ],
                            },
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

const group_data = async () => {
    try {
        return {
          $group: {
            _id: "$_id",
            order_id: { $first: "$orders.order_id" },
            prdt_id: { $first: "$products.prodct_id" },
            ord_id: { $first: "$orders._id" },
            user_id: { $first: "$users" },
            seller_id: { $first: "$sellers" },
            product_id: { $first: "$products" },
            productId: { $first: "$products._id" },
            category_id: { $first: "$products.category_id._id" },
            product_quantity: { $first: "$products.quantity" },
            cate_name: { $first: "$products.category_id.name" },
            subcategory_id: { $first: "$products.subcategoryId" },
            // categor_id: { $first: "$products.categoryId" },
            // cate_id: { $first: "$products.categoryId" },
            // cat_id: { $first: "$products.categoryId" },
            // ca_id: { $first: "$products.categoryId" },
            // quantity: { "$first": "$products" },
            // price: { "$first": "$products" },
            // delivery_price: { "$first": "$products" },
            coupon_discount: { $first: "$coupon_discount" },
            quantity: { $first: "$quantity" },
            total_price: { $first: "$total_price" },
            total_earnings: { $first: "$total_earnings" },
            // shippo_data: shippo_data,
            order_status: { $first: "$order_status" },
            // delivery_status: { "$first": "$products" },
            // delivery_date: { "$first": "$products" },
            payment_status: { $first: "$payment_status" },
            cancel_requested: { $first: "$cancel_requested" },
            cancel_request_accepted: {
              $first: "$cancel_request_accepted",
            },
            cancellation_reason: { $first: "$cancellation_reason" },
            cancelled_at: { $first: "$cancelled_at" },
            updated_at: { $first: "$updated_at" },
            created_at: { $first: "$created_at" },
          },
        };
    }
    catch (err) {
        throw err;
    }
}

const group_orders_review_data = async () => {
    try {
        return {
          $group: {
            _id: "$_id",
            title: { $first: "$title" },
            description: { $first: "$description" },
            ratings: { $first: "$ratings" },
            images: { $first: "$images" },
            user_id: { $first: "$users" },
            seller_id: { $first: "$sellers" },
            product_id: { $first: "$products" },
            productId: { $first: "$products._id" },
            // category_id: { $first: "$products.category_id._id" },
            // product_quantity: { $first: "$products.quantity" },
            /// cate_name: { $first: "$products.category_id.name" },
            // subcategory_id: { $first: "$products.subcategoryId" },
            // categor_id: { $first: "$products.categoryId" },
            // cate_id: { $first: "$products.categoryId" },
            // cat_id: { $first: "$products.categoryId" },
            // ca_id: { $first: "$products.categoryId" },
            // quantity: { "$first": "$products" },
            // price: { "$first": "$products" },
            // delivery_price: { "$first": "$products" },
            // coupon_discount: { "$first": "$coupon_discount" },
            // quantity: { $first: "$quantity" },
            total_price: { $first: "$products.discount_price" },
            // tot/al_earnings: { $first: "$total_earnings" },
            // shippo_data: shippo_data,
            // order_status: { $first: "$order_status" },
            // delivery_status: { "$first": "$products" },
            // delivery_date: { "$first": "$products" },
            // payment_status: { $first: "$payment_status" },
            // cancel_requested: { $first: "$cancel_requested" },
            // cancel_request_accepted: {
            //   $first: "$cancel_request_accepted",
            // },
            // cancellation_reason: { $first: "$cancellation_reason" },
            // cancelled_at: { $first: "$cancelled_at" },
            updated_at: { $first: "$updated_at" },
            created_at: { $first: "$created_at" },
          },
        };
    }
    catch (err) {
        throw err;
    }
}

const group_transactions_data = async () => {
  try {
    return {
      $group: {
        _id: "$_id",
        pm_id: { $first: "$card.payment_method" },
        order_id: { $first: "$orders.order_id" },
        order: { $first: "$orders" },
        payment_status: { $first: "$orders.payment_status" },
        ord_id: { $first: "$orders._id" },
        user_id: { $first: "$users" },
        seller_id: { $first: "$sellers" },
        product_id: { $first: "$products" },
        productId: { $first: "$products._id" },
        category_id: { $first: "$products.category_id._id" },
        cate_name: { $first: "$products.category_id.name" },
        subcategory_id: { $first: "$products.subcategoryId" },
        // categor_id: { $first: "$products.categoryId" },
        // cate_id: { $first: "$products.categoryId" },
        // cat_id: { $first: "$products.categoryId" },
        // ca_id: { $first: "$products.categoryId" },
        // quantity: { "$first": "$products" },
        // price: { "$first": "$products" },
        // delivery_price: { "$first": "$products" },
        // coupon_discount: { "$first": "$products" },
        total_price: { $first: "$total_price" },
        admin_commision: { $first: "$admin_commision" },
        total_earnings: { $first: "$total_earnings" },
        // shippo_data: shippo_data,
        order_status: { $first: "$order_status" },
        // delivery_status: { "$first": "$products" },
        // delivery_date: { "$first": "$products" },
        cancel_requested: { $first: "$orders.cancel_requested" },
        updated_at: { $first: "$updated_at" },
        created_at: { $first: "$created_at" },
      },
    };
  } catch (err) {
    throw err;
  }
};

let sort_data = async () => {
    try {

        return {
            $sort: {
                _id: -1
                // updated_at:-1
            }
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
        // _id: -1
        updated_at: -1,
      },
    };
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
  match_transactions,
  lookup_sellers,
  unwind_sellers,
  lookup_users,
  unwind_users,
  lookup_products,
  unwind_products,
  lookup_review_products,
  unwind_review_products,
  lookup_order,
  unwind_orders,
  lookup_order_product,
  unwind_ordered_product,
  lookup_ordered_products,
  unwind_ordered_products,
  lookup_card,
  unwind_card,
  filter_data,
  filter_review_order_data,
  filter_transaction_data,
  group_transactions_data,
  group_orders_review_data,
  group_data,
  sort_data,
  skip_data,
  limit_data,
  sort_order_data,
};