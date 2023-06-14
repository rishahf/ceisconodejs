import * as DAO from '../../DAO';
import * as Models from '../../models';

const fetch_total_count = async (collection: any, query: any) => {
    try {

        let response = await DAO.count_data(collection, query)
        return response

    }
    catch (err) {
        throw err;
    }
}

const  make_products_response  = async (query: any, options: any) => {
    try {

        let response: any = await DAO.aggregate_data(Models.Products, query, options)
        return response

    }
    catch (err) {
        throw err;
    }
}

const get_product_detail = async (query: any, options: any) => {
    try {

        let projection = { __v: 0 }
        let populate = [
            { path: 'brand_id', select: 'name' },
            { path: 'subcategory_id', select: 'name' },
            { path: "sub_subcategory_id", select: "name" },
            { path: 'product_details', select: 'key value' },
            // { path: 'deliverable_cities', select: 'city_name' }
        ]
        let respone = await DAO.populate_data(Models.Products, query, projection, options, populate)
        // console.log("------RESPONSE-------",respone)
        return respone

    }
    catch (err) {
        throw err;
    }
}

const get_deals_detail = async (query: any, options: any) => {
    try {

        let projection = { __v: 0 }
       let populate=[
        { path: 'subcategory_id', select: 'name' },
    ]
        let respone = await DAO.populate_data(Models.Deals_of_the_day, query, projection, options,populate)
        // console.log("------RESPONSE-------",respone)
        return respone

    }
    catch (err) {
        throw err;
    }
}
const get_hotdeals_detail = async (query: any, options: any) => {
    try {

        let projection = { __v: 0 }
       let populate=[
        { path: 'subcategory_id', select: 'name' },
    ]
        let respone = await DAO.populate_data(Models.Hot_deals, query, projection, options,populate)
        // console.log("------RESPONSE-------",respone)
        return respone

    }
    catch (err) {
        throw err;
    }
}

const get_fashiondeals_detail = async (query: any, options: any) => {
    try {

        let projection = { __v: 0 }
       let populate=[
        { path: 'brand_id', select: 'name' },
    ]
        let respone = await DAO.populate_data(Models.FashionDeals, query, projection, options,populate)
        // console.log("------RESPONSE-------",respone)
        return respone

    }
    catch (err) {
        throw err;
    }
}
const get_variants_detail = async (query: any, options: any) => {
    try {

        let projection = { __v: 0 }
        let populate = [
            { path:"product_id", select:""}
        ]
        let respone = await DAO.populate_data(Models.Product_Variations, query, projection, options, populate)
        // console.log(respone)
        return respone
     
    }
    catch (err) {
        throw err;
    }
}


const make_category_response = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 }

        let response = await DAO.get_data(Models.Category, query, projection, options)
        return response
    } catch (err) {
        throw (err)
    }
}

const make_subcategory_response = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 }
        let populate = [
            { path: 'category_id', select: 'name' }
        ]
        let response = await DAO.populate_data(Models.SubCategory, query, projection, options, populate)
        return response
    } catch (err) {
        throw (err)
    }
}
const make_variants_response = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 }
        let populate = [
            { path: 'product_id', select: 'name description services highlights'  }
        ]
        let response = await DAO.populate_data(Models.Product_Variations, query, projection, options, populate)
        return response
    } catch (err) {
        throw (err)
    }
}

const make_Sub_subcategories = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 }
        let populate = [
            { path: 'category_id', select: 'name' }
        ]
        let response = await DAO.populate_data(Models.Sub_subcategories, query, projection, options, populate)
        return response
    } catch (err) {
        throw (err)
    }
}

const make_brand_response = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 }
        let populate = [
            { path: 'product_id', select: ' ' }
        ]

        let response = await DAO.populate_data(Models.Brands, query, projection, options, populate)
        return response
    } catch (err) {
        throw (err)
    }
}

const make_banners_response = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 }

        let response = await DAO.get_data(Models.Banners, query, projection, options)
        return response
    } catch (err) {
        throw (err)
    }
}

const make_deals_response = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 }

        let response = await DAO.get_data(Models.Deals_of_the_day, query, projection, options)
        return response
    } catch (err) {
        throw (err)
    }
}

const make_hot_deals_response = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 }

        let response = await DAO.get_data(Models.Hot_deals, query, projection, options)
        return response
    } catch (err) {
        throw (err)
    }
}

const make_fashion_deals_response = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 }

        let response = await DAO.get_data(Models.FashionDeals, query, projection, options)
        return response
    } catch (err) {
        throw (err)
    }
}


export {

    fetch_total_count,
    make_products_response,
    
    make_category_response,
    make_subcategory_response,

    make_Sub_subcategories,
    make_brand_response,
    make_banners_response,

    get_product_detail,
    
    get_variants_detail,
    make_variants_response,
    make_deals_response,
    make_hot_deals_response,
    make_fashion_deals_response,
    get_deals_detail,
    get_hotdeals_detail,
    get_fashiondeals_detail
    
}