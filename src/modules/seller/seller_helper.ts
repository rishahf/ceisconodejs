import mongoose from "mongoose";

const match_data = async (seller_id: string) => {
  try {
    return {
      $match: {
        added_by: mongoose.Types.ObjectId(seller_id),
      },
    };
  } catch (err) {
    throw err;
  }
};

const match_product_id = async (_id: string) => {
  try {
    return {
      $match: {
        _id: mongoose.Types.ObjectId(_id),
      },
    };
  } catch (err) {
    throw err;
  }
};

const match_order_id = async (_id: string) => {
  try {
    return {
      $match: {
        _id: mongoose.Types.ObjectId(_id),
      },
    };
  } catch (err) {
    throw err;
  }
};

const redact_data = async (search: string) => {
  try {
    return {
      $redact: {
        $cond: {
          if: {
            $or: [
              { $eq: [search, undefined] },
              {
                $regexMatch: {
                  input: "$subcategory_id.name",
                  regex: search,
                  options: "i",
                },
              },
              {
                $regexMatch: {
                  input: "$name",
                  regex: search,
                  options: "i",
                },
              },
              {
                $regexMatch: {
                  input: "$brand_id.name",
                  regex: search,
                  options: "i",
                },
              },
            ],
          },
          then: "$$KEEP",
          else: "$$PRUNE",
        },
      },
    };
  } catch (err) {
    throw err;
  }
};

const lookup_data = async (collection: any, match_id: any) => {
  var field_name = match_id.slice(1, match_id.length);
  // console.log("field_name ", field_name)
  // console.log("match_id ", match_id)
  try {
    return {
      $lookup: {
        from: collection,
        let: { new_id: match_id },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$new_id"],
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
        as: field_name,
      },
    };
  } catch (err) {
    throw err;
  }
};

const lookup_User_data = async () => {
  // var field_name = match_id.slice(1, match_id.length);
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
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              profile_pic: 1
            },
          },
        ],
        as: "user_id",
      },

    };
  } catch (err) {
    throw err;
  }
};

const lookup_address_data = async () => {
  // var field_name = match_id.slice(1, match_id.length);
  // console.log("address_id ", address_id)
  try {
    return {
      $lookup: {
        from: "addresses",
        let: { address_id: "$address_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$address_id"],
              },
            },
          },
        ],
        as: "address_id",
      },
    };
  } catch (err) {
    throw err;
  }
};

const lookup_user_ratings = async () => {
  try {
    return {
      $lookup: {
        from: "reviews",
        let: { user_id: "$user_id._id", product_id:"$product._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and:[
                  {
                    $eq: ["$user_id", "$$user_id"],
                  },
                  {
                    $eq: ["$product_id", "$$product_id"],
                  }
                ]
              },
            },
          },
        ],
        as: "ratings",
      },
    };
  } catch (err) {
    throw err;
  }
};

const lookup_product_detail = async (collection_name: any) => {
  try {
    return {
      $lookup: {
        from: collection_name,
        let: { product_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$product_id", "$$product_id"],
              },
            },
          },
          {
            $project: {
              _id:1,
              key: 1,
              value: 1,
              unique_number:1
            }
          },
        ],
        as: collection_name,
      },
    };
  } catch (err) {
    throw err;
  }
};

const lookup_services_highlights = async (collection_name: any) => {
  try {
    return {
      $lookup: {
        from: collection_name,
        let: { product_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$product_id", "$$product_id"],
              },
            },
          },
          {
            $project:{
              content:1
            }
          }
          
        ],
        as: collection_name,
      },
    };
  } catch (err) {
    throw err;
  }
};

const lookup_common_collection = async (collection_name: any) => {
  try {
    return {
      $lookup: {
        from: collection_name,
        let: { product_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$product_id", "$$product_id"],
              },
            },
          },
          // {
          //   $project:{
          //     content:1
          //   }
          // }
          
        ],
        as: collection_name,
      },
    };
  } catch (err) {
    throw err;
  }
};

const lookup_orders_data = async (collection: any, match_id: any, seller_id: any) => {
  var field_name = match_id.slice(1, match_id.length);
  // console.log('seller_id ', seller_id)
  try {
    return {
      $lookup: {
        from: collection,
        let: { new_id: match_id },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$_id", "$$new_id"] },
                  // { $eq: ["$added_by", mongoose.Types.ObjectId(seller_id)] }
                ]
              }
            }
          }, {
            $lookup: {
              from: "$",
              let: { category_id: "$subcategory_id.category_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$_id", "$$category_id"],
                    },
                  },
                },

              ],
              as: "subcategory_id.category_id",
            },
          },
        ],
        as: field_name,
      },
    };
  } catch (err) {
    throw err;
  }
};

const lookup_reviews_data = async () => {
  try {
    return {
      $lookup: {
        from: "reviews",
        let: { new_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$product_id", "$$new_id"],
              },
            },
          },
          {
            $lookup: {
              from: "users",
              let: { user_id: "$user_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$_id", "$$user_id"],
                    },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    name: 1,
                    profile_pic: 1,
                  },
                },
              ],
              as: "user_id",
            },
          },
          {
            $unwind: {
              path: "$user_id",
              preserveNullAndEmptyArrays: true
            }
          },
        ],
        as: "ratings",
      },
    };
  } catch (err) {
    throw err;
  }
};

const unwind_review_user_data = async (match_id: any) => {
  // var path_check = "$"+match_id
  // console.log("path_check -> ", path_check)
  try {
    return {
      $unwind: {
        path: match_id,
        preserveNullAndEmptyArrays: true,
      },
    };
  } catch (err) {
    throw err;
  }
};

const group_data = async () => {
  try {
    return {
      $group: {
        _id: "$_id",
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
      $sort: { created_at: -1 },
    };
  } catch (err) {
    throw err;
  }
};

const set_ratings = async () => {
  return {
    $set: {
      one_rate_count: {
        $size: {
          $filter: {
            input: "$ratings",
            as: "rating_data",
            cond: {
              $and: [
                { $eq: ["$$rating_data.product_id", "$_id"] },
                { $eq: ["$$rating_data.ratings", 1] },
              ],
            },
          },
        },
      },
      two_rate_count: {
        $size: {
          $filter: {
            input: "$ratings",
            as: "rating_data",
            cond: {
              $and: [
                { $eq: ["$$rating_data.product_id", "$_id"] },
                { $eq: ["$$rating_data.ratings", 2] },
              ],
            },
          },
        },
      },
      three_rate_count: {
        $size: {
          $filter: {
            input: "$ratings",
            as: "rating_data",
            cond: {
              $and: [
                { $eq: ["$$rating_data.product_id", "$_id"] },
                { $eq: ["$$rating_data.ratings", 3] },
              ],
            },
          },
        },
      },
      four_rate_count: {
        $size: {
          $filter: {
            input: "$ratings",
            as: "rating_data",
            cond: {
              $and: [
                { $eq: ["$$rating_data.product_id", "$_id"] },
                { $eq: ["$$rating_data.ratings", 4] },
              ],
            },
          },
        },
      },
      five_rate_count: {
        $size: {
          $filter: {
            input: "$ratings",
            as: "rating_data",
            cond: {
              $and: [
                { $eq: ["$$rating_data.product_id", "$_id"] },
                { $eq: ["$$rating_data.ratings", 5] },
              ],
            },
          },
        },
      },
    },
  };
};

const lookup_ordersData = async () => {
  // var field_name = match_id.slice(1, match_id.length);
  try {
    return {
      $lookup: {
        from: "products",
        let: { new_id: "$product" },
        pipeline: [
          {
            $match: {
              $and: [
                {
                  $expr: {
                    $eq: ["$_id", "$$new_id"],
                  },
                  $eq: ["$added_by", "$$seller_id"],
                }
              ]
            },
          },
        ],
        as: "product",
      },
    };
  } catch (err) {
    throw err;
  }
};

const lookup_product_details = async (_id: any) => {
  try {
    return {
      $lookup: {
        from: "productdetails",
        let: { product_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$product_id", "$$product_id"],
              },
            },
          },
          // {
          //   $project: {
          //     _id:1,
          //     key: 1,
          //     value: 1,
          //   },
          // },
        ],
        as: "product_details",
      },
    };
  } catch (err) {
    throw err;
  }
};

const look_up_product_services = async (_id: any) => {
  try {
    return {
      $lookup: {
        from: "product_services",
        let: { product_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$product_id", "$$product_id"],
              },
            },
          },
        ],
        as: "services",
      },
    };
  } catch (err) {
    throw err;
  }
};

const look_up_product_highlights = async (_id: any) => {
  try {
    return {
      $lookup: {
        from: "product_highlights",
        let: { product_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$product_id", "$$product_id"],
              },
            },
          },
        ],
        as: "highlights",
      },
    };
  } catch (err) {
    throw err;
  }
};

const lookup_data_category = async (collection: any, match_id: any) => {
  var field_name = match_id.slice(1, match_id.length);
  try {
    return {
      $lookup: {
        from: collection,
        let: { new_id: match_id },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$new_id"],
              },
            },
          }, {
            $lookup: {
              from: "$categories",
              let: { category_id: "$subcategory_id.category_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$_id", "$$category_id"],
                    },
                  },
                },

              ],
              as: "subcategory_id.category_id",
            },
          }


        ],
        as: field_name,
      },
    };
  } catch (err) {
    throw err;
  }
};

const unwind_data_category = async (match_id: any) => {
  // var path_check = "$"+match_id
  // console.log("path_check -> ", path_check)
  try {
    return {
      $unwind: {
        path: match_id,
        preserveNullAndEmptyArrays: true,
      },
    };
  } catch (err) {
    throw err;
  }
};

const unwind_data = async (match_id: any) => {
  // var path_check = "$"+match_id
  // console.log("path_check -> ", path_check)
  try {
    return {
      $unwind: {
        path: match_id,
        preserveNullAndEmptyArrays: true,
      },
    };
  } catch (err) {
    throw err;
  }
};

// const lookup_orders_data = async (collection: any, match_id: any) => {
//   var field_name = match_id.slice(1, match_id.length);
//   try {
//     return {
//       $lookup: {
//         from: collection,
//         let: { new_id: match_id },
//         pipeline: [
//           {
//             $match: {
//               $expr: {
//                 $eq: ["$_id", "$$new_id"],
//               },
//             },
//           }, {
//             $lookup: {
//               from: "$",
//               let: { category_id: "$subcategory_id.category_id" },
//               pipeline: [
//                 {
//                   $match: {
//                     $expr: {
//                       $eq: ["$_id", "$$category_id"],
//                     },
//                   },
//                 },

//               ],
//               as: "subcategory_id.category_id",
//             },
//           }


//         ],
//         as: field_name,
//       },
//     };
//   } catch (err) {
//     throw err;
//   }
// };

let graph_data = async () => {
  try {
    return {
      $facet: {
        Weekly: [
          {
            $group: {
              order_id: {
                "$week": "$created"
              },
              total: {
                $sum: "$total"
              }
            }
          }
        ]
      }
    };
  } catch (err) {
    throw err;
  }
};

const new_lookup_ordersData = async () => {
  // var field_name = match_id.slice(1, match_id.length);
  try {
    return {
      $lookup: {
        from: "products",
        let: { new_id: "$product" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$new_id"],
              },
            },
          },
        ],
        as: "product",
      },
    };
  } catch (err) {
    throw err;
  }
};

export {
  match_data,
  match_product_id,
  match_order_id,
  lookup_data,
  lookup_User_data,
  lookup_address_data,
  lookup_user_ratings,
  lookup_common_collection,
  lookup_product_detail,
  lookup_services_highlights,
  redact_data,
  lookup_orders_data,
  lookup_reviews_data,
  unwind_review_user_data,
  // lookup_data_category,
  // unwind_data_category,
  group_data,
  sort_data,
  set_ratings,
  unwind_data,
};
