import { Request, Response } from "express";
import { handle_catch } from "../../middlewares/index";
import { section_module } from "./homepage_sections";
import { admin_banner_module, user_banner_module } from "./banners";
import { admin_dod_module, user_dod_module } from "./deals_of_the_day";
import { admin_top_deals_module, user_top_deals_module } from "./top_deals";
import {
  admin_fashion_deals_module,
  user_fashion_deals_module,
} from "./fashion_deals";
import { admin_style_for_module, user_style_for_module } from "./style_for";
import {
  admin_style_for_categories,
  user_style_for_categories,
} from "./style_for_categories";
import {
  admin_featured_categories,
  user_featured_categories,
} from "./featured_categories";
import { admin_shop_with_us, user_shop_with_us } from "./shop_with_us";
import { admin_best_on_ecom, user_best_on_ecom } from "./best_on_ecom";

export default class controller {
  // manage home page sections
  static manage_sections = async (req: Request, res: Response) => {
    try {
      let response = await section_module.update(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // banner module
  static add_a_banner = async (req: Request, res: Response) => {
    try {
      let response = await admin_banner_module.add_a_banner(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static update_a_banner = async (req: Request, res: Response) => {
    try {
      let response = await admin_banner_module.update_a_banner(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static list_banners = async (req: Request, res: Response) => {
    try {
      let response = await admin_banner_module.list_banners(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        // total_count: response.total_count,
        // data: response.data
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static banner_details = async (req: Request, res: Response) => {
    try {
      let response = await admin_banner_module.banner_details(req);
      res.send({
        success: true,
        message: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static delete_a_banner = async (req: Request, res: Response) => {
    try {
      let response = await admin_banner_module.delete_a_banner(req);
      res.send({
        success: true,
        message: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static enable_disable_a_banner = async (req: Request, res: Response) => {
    try {
      let response = await admin_banner_module.enable_disable_a_banner(req);
      res.send({
        success: true,
        message: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static enable_disable_banners = async (req: Request, res: Response) => {
    try {
      let response = await admin_banner_module.enable_disable_banners(req);
      res.send({
        success: true,
        message: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static user_list_banners = async (req: Request, res: Response) => {
    try {
      let response = await user_banner_module.user_list_banners(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        // total_count: response.total_count,
        // data: response.data
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  //timer-api
  static add_deals_timer = async (req: Request, res: Response) => {
    try {
      let response = await admin_dod_module.add_timer_of_deals(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static update_deals_timer = async (req: Request, res: Response) => {
    try {
      let response = await admin_dod_module.update_timer_of_deals(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static get_deals_timer = async (req: Request, res: Response) => {
    try {
      let response = await admin_dod_module.get_timer_of_deals(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static get_users_deals_timer = async (req: Request, res: Response) => {
    try {
      let response = await admin_dod_module.get_users_timer_of_deals(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // deal of the day module
  static add_deal_of_the_day = async (req: Request, res: Response) => {
    try {
      let response = await admin_dod_module.add_a_deal(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static update_deal_of_the_day = async (req: Request, res: Response) => {
    try {
      let response = await admin_dod_module.update_a_deal(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static list_deal_of_the_day = async (req: Request, res: Response) => {
    try {
      let response = await admin_dod_module.list_deals(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
        // total_count: response.total_count,
        // data: response.data
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static detail_deal_of_the_day = async (req: Request, res: Response) => {
    try {
      let response = await admin_dod_module.detail_deal_of_the_day(req);
      // let message = "Success";
      res.send({
        success: true,
        message: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static enable_disable_deal_of_the_day = async (
    req: Request,
    res: Response
  ) => {
    try {
      let response = await admin_dod_module.enable_disable_deals_day(req);
      // let message = "Success";
      res.send({
        success: true,
        message: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static delete_a_deal_of_the_day = async (req: Request, res: Response) => {
    try {
      let response = await admin_dod_module.delete_a_deal(req);
      res.send({
        success: true,
        message: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static user_list_deal_of_the_day = async (req: Request, res: Response) => {
    try {
      console.log("user-- list");

      let response = await user_dod_module.user_list_deals(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
        // total_count: response.total_count,
        // data: response.data
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // top_deals_module
  static add_top_deal = async (req: Request, res: Response) => {
    try {
      let response = await admin_top_deals_module.add_top_deal(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static update_top_deal = async (req: Request, res: Response) => {
    try {
      let response = await admin_top_deals_module.update_top_deal(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static list_top_deals = async (req: Request, res: Response) => {
    try {
      let response = await admin_top_deals_module.list_top_deals(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
        // total_count: response.total_count,
        // data: response.data
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static enable_disable_top_deals = async (req: Request, res: Response) => {
    try {
      let response = await admin_top_deals_module.enable_disable_top_deals(req);
      res.send({
        success: true,
        message: response,
        // total_count: response.total_count,
        // data: response.data
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static delete_top_deal = async (req: Request, res: Response) => {
    try {
      let response = await admin_top_deals_module.delete_top_deal(req);
      res.send({
        success: true,
        message: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static detail_top_deal = async (req: Request, res: Response) => {
    try {
      let response = await admin_top_deals_module.detail_top_deals(req);
      res.send({
        success: true,
        message: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static user_list_top_deals = async (req: Request, res: Response) => {
    try {
      let response = await user_top_deals_module.user_list_top_deals(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
        // total_count: response.total_count,
        // data: response.data
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // fashion deals module
  static add_fashion_deals = async (req: Request, res: Response) => {
    try {
      let response = await admin_fashion_deals_module.add_fashion_deals(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static update_fashion_deals = async (req: Request, res: Response) => {
    try {
      let response = await admin_fashion_deals_module.update_fashion_deals(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static list_fashion_deals = async (req: Request, res: Response) => {
    try {
      let response = await admin_fashion_deals_module.list_fashion_deals(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
        // total_count: response.total_count,
        // data: response.data
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static enable_disable_fashion_deals = async (req: Request, res: Response) => {
    try {
      let response = await admin_fashion_deals_module.en_dis_fashion_deals(req);
      let message = "Success";
      res.send({
        success: true,
        message: response,
        // total_count: response.total_count,
        // data: response.data
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static detail_fashion_deals = async (req: Request, res: Response) => {
    try {
      let response = await admin_fashion_deals_module.detail_fashion_deals(req);
      res.send({
        success: true,
        message: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static delete_fashion_deals = async (req: Request, res: Response) => {
    try {
      let response = await admin_fashion_deals_module.delete_fashion_deals(req);
      res.send({
        success: true,
        message: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static user_list_fashion_deals = async (req: Request, res: Response) => {
    try {
      let response = await user_fashion_deals_module.user_list_fashion_deals(
        req
      );
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
        // total_count: response.total_count,
        // data: response.data
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // style_for_module
  static add_style_for = async (req: Request, res: Response) => {
    try {
      let response = await admin_style_for_module.add_style_for(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static update_style_for = async (req: Request, res: Response) => {
    try {
      let response = await admin_style_for_module.update_style_for(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static list_style_for = async (req: Request, res: Response) => {
    try {
      let response = await admin_style_for_module.list_style_for(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
        // total_count: response.total_count,
        // data: response.data
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static delete_style_for = async (req: Request, res: Response) => {
    try {
      let response = await admin_style_for_module.delete_style_for(req);
      res.send({
        success: true,
        message: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static user_list_style_for = async (req: Request, res: Response) => {
    try {
      let response = await user_style_for_module.list(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
        // total_count: response.total_count,
        // data: response.data
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // style_for_categories
  static add_sfc = async (req: Request, res: Response) => {
    try {
      let response = await admin_style_for_categories.add(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static update_sfc = async (req: Request, res: Response) => {
    try {
      let response = await admin_style_for_categories.update(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static list_sfc = async (req: Request, res: Response) => {
    try {
      let response = await admin_style_for_categories.list(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
        // total_count: response.total_count,
        // data: response.data
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static enable_disable_sfc = async (req: Request, res: Response) => {
    try {
      let response = await admin_style_for_categories.en_dis_sfc(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
        // total_count: response.total_count,
        // data: response.data
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static delete_sfc = async (req: Request, res: Response) => {
    try {
      let response = await admin_style_for_categories.delete(req);
      res.send({
        success: true,
        message: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static user_list_sfc = async (req: Request, res: Response) => {
    try {
      let response = await user_style_for_categories.list(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
        // total_count: response.total_count,
        // data: response.data
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // featured categories
  static add_fc = async (req: Request, res: Response) => {
    try {
      let response = await admin_featured_categories.add(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static update_fc = async (req: Request, res: Response) => {
    try {
      let response = await admin_featured_categories.update(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static list_fc = async (req: Request, res: Response) => {
    try {
      let response = await admin_featured_categories.list(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
        // total_count: response.total_count,
        // data: response.data
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static detail_fc = async (req: Request, res: Response) => {
    try {
      let response = await admin_featured_categories.detail_fc(req);
      res.send({
        success: true,
        message: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };
  static enable_disable_fc = async (req: Request, res: Response) => {
    try {
      let response = await admin_featured_categories.enable_disable_fc(req);
      res.send({
        success: true,
        message: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static delete_fc = async (req: Request, res: Response) => {
    try {
      let response = await admin_featured_categories.delete(req);
      res.send({
        success: true,
        message: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static user_list_fc = async (req: Request, res: Response) => {
    try {
      let response = await user_featured_categories.list(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
        // total_count: response.total_count,
        // data: response.data
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // shop with us
  static add_shop_with_us = async (req: Request, res: Response) => {
    try {
      let response = await admin_shop_with_us.add(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static update_shop_with_us = async (req: Request, res: Response) => {
    try {
      let response = await admin_shop_with_us.update(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static list_shop_with_us = async (req: Request, res: Response) => {
    try {
      let response = await admin_shop_with_us.list(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
        // total_count: response.total_count,
        // data: response.data
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static enable_disable_shop_with_us = async (req: Request, res: Response) => {
    try {
      let response = await admin_shop_with_us.enable_disable(req);
      res.send({
        success: true,
        message: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static delete_shop_with_us = async (req: Request, res: Response) => {
    try {
      let response = await admin_shop_with_us.delete(req);
      res.send({
        success: true,
        message: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static detail_shop_with_us = async (req: Request, res: Response) => {
    try {
      let response = await admin_shop_with_us.detail_shop_with_us(req);
      res.send({
        success: true,
        message: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static user_list_shop_with_us = async (req: Request, res: Response) => {
    try {
      let response = await user_shop_with_us.list(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
        // total_count: response.total_count,
        // data: response.data
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  // best on ecom
  static add_best_on_ecom = async (req: Request, res: Response) => {
    try {
      let response = await admin_best_on_ecom.add(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static update_best_on_ecom = async (req: Request, res: Response) => {
    try {
      let response = await admin_best_on_ecom.update(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static enable_dis_best_on_ecom = async (req: Request, res: Response) => {
    try {
      let response = await admin_best_on_ecom.enable_disable(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static list_best_on_ecom = async (req: Request, res: Response) => {
    try {
      let response = await admin_best_on_ecom.list(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
        // total_count: response.total_count,
        // data: response.data
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static detail_best_on_ecom = async (req: Request, res: Response) => {
    try {
      let response = await admin_best_on_ecom.detail(req);
      let message = "Success";
      res.send({
        success: true,
        message: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static delete_best_on_ecom = async (req: Request, res: Response) => {
    try {
      let response = await admin_best_on_ecom.delete(req);
      res.send({
        success: true,
        message: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static user_list_best_on_ecom = async (req: Request, res: Response) => {
    try {
      let response = await user_best_on_ecom.list(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        // total_count: response.total_count,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static get_all_deals_timer = async (req: Request, res: Response) => {
    try {
      let response = await admin_dod_module.get_all_timer_of_deals(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };

  static get_homepage_coupon = async (req: Request, res: Response) => {
    try {
      let response = await user_best_on_ecom.homepageCoupon(req);
      let message = "Success";
      res.send({
        success: true,
        message: message,
        // total_count: response.total_count,
        data: response,
      });
    } catch (err) {
      handle_catch(res, err);
    }
  };
}
