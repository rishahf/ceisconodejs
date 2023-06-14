import * as DAO from '../../DAO'
import * as Models from '../../models'
import { handle_custom_error, helpers } from '../../middlewares/index'

export default class product_delivery_location_module {
  static add = async (req: any) => {
    try {
      let { product_id, address, lng,lat, radius, units, delivery_time } = req.body
      let data_to_save: any = {
        product_id: product_id,
        address: address,
        location: { type: "Point", coordinates: [lng, lat] },
        radius: radius,
        units: units,
        delivery_time:delivery_time,
        created_at: +new Date(),
      };
      if(!!address){
        console.log('Inside address  --- ', address )
        let address_1 = address.split(',');
        data_to_save.address = address_1.length == 1 ? (address_1[address_1.length-1]).trim().toLowerCase() : address
        data_to_save.country=(address_1[address_1.length-1]).trim().toLowerCase()
      }
      console.log('data_to_save --- ', data_to_save)
      let response = await DAO.save_data(Models.Delivery_Locations, data_to_save)
      await DAO.find_and_update(Models.Products, { _id:product_id }, { is_visible:true }, { new:true } )
      return response
    } catch (err) {
      throw err
    }
  }

  static edit = async (req: any) => {
    try {
      let { _id, address, lng,lat, radius, units, delivery_time } = req.body

      let query = { _id: _id }
      let update: any = {} ;
      if (!!address) {
        // update.address = address;
        let address_1 = address.split(','); 
        console.log('address_1 -- ',address_1)
        console.log('address_2 -- ',String(address_1[address_1.length-1])?.trim()?.toLowerCase())
        update.address = address_1.length == 1 ? (address_1[address_1.length-1]).trim().toLowerCase() : address;
        update.country=(address_1[address_1.length-1])?.trim()?.toLowerCase()
        
      }
      if(!!lng && !! lat){
        update.location =  { type: "Point", coordinates: [lng, lat] }
      }
      if (!!radius) {
        update.radius = radius
      }
      if (!!units) {
        update.units = units
      }
      if (!!delivery_time) {
        update.delivery_time = delivery_time;
      }

      let options = { new: true }
      let response = await DAO.find_and_update(Models.Delivery_Locations,query,update,options)
      return response
    } catch (err) {
      throw err
    }
  }

  static list = async (req: any) => {
    try {
      let { _id, pagination, limit } = req.query

      let query: any = {}
      if (!!_id) {
        query.product_id = _id
      }

      let projection = { __v: 0 }
      let options = await helpers.set_options(pagination, limit)
      let retrive_data = await DAO.get_data(Models.Delivery_Locations,query,projection,options)
      let total_count = await DAO.count_data(Models.Delivery_Locations, query)

      let response = {
        total_count: total_count,
        data: retrive_data
      }

      return response
    } catch (err) {
      throw err
    }
  }

  static delete = async (req: any) => {
    try {
      let { _id } = req.params
      let projection:any = { __v:0 }
      let option:any = { lean :true }
      let get_data:any = await DAO.get_data(Models.Delivery_Locations,{_id:_id},projection, option)
      let { product_id } = get_data[0];
      let query: any = { product_id: product_id };
      let get_locs:any = await DAO.get_data(Models.Delivery_Locations,query,projection, option)
      if(get_locs && get_locs.length){
        if(get_locs.length == 1){
          let update: any = { is_visible:false };
          await DAO.find_and_update(Models.Products, {_id:product_id}, update,{new:true})
        }
      }
      let remove: any = await DAO.remove_data(Models.Delivery_Locations, { _id: _id })
      if (remove.deletedCount > 0) {
        let data = { message: `Delivery Location deleted successfully...` }
        return data
      }
    } catch (err) {
      throw err
    }
  }
}
