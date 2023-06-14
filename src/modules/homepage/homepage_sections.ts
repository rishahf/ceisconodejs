import * as DAO from "../../DAO";
import { HomePageSections } from "../../models";
import { helpers, handle_custom_error } from "../../middlewares/index";

class section_module {

    static update = async (req: any) => {
        try {

            let {
                top_banners,
                middle_banners : mid_banners,
                bottom_banners : btm_banners,
                deal_of_the_day: dod,
                top_deals: td,
                fashion_deals: fd,
                style_for_categories: sfc,
                featured_categories: fc,
                shop_with_us: swu,
                best_on_ecom: boe,
                language
            } = req.body;

            let query = {}
            let projection = { __v: 0 }
            let options = { lean: true, sort: { _id: -1 } }
            let retrive_sections: any = await DAO.get_data(HomePageSections, query, projection, options)
            if (retrive_sections.length) {
                let { _id } = retrive_sections[0];
                let query = { _id: _id }
                let update: any = { updated_at: +new Date() }

                if (typeof top_banners !== undefined && top_banners !== null && top_banners !== undefined) {
                    update.top_banners = top_banners
                }
                if (typeof mid_banners !== undefined && mid_banners !== null && mid_banners !== undefined) {
                    update.middle_banners = mid_banners
                }
                if (typeof btm_banners !== undefined && btm_banners !== null && btm_banners !== undefined) {
                    update.bottom_banners = btm_banners
                }
                if (typeof dod !== undefined && dod !== null && dod !== undefined) {
                    update.deal_of_the_day = dod
                }
                if (typeof td !== undefined && td !== null && td !== undefined) {
                    update.top_deals = td
                }
                if (typeof fd !== undefined && fd !== null && fd !== undefined) {
                    update.fashion_deals = fd
                }
                if (typeof sfc !== undefined && sfc !== null && sfc !== undefined) {
                    update.style_for_categories = sfc
                }
                if (typeof fc !== undefined && fc !== null && fc !== undefined) {
                    update.featured_categories = fc
                }
                if (typeof swu !== undefined && swu !== null && swu !== undefined) {
                    update.shop_with_us = swu
                }
                if (typeof boe !== undefined && boe !== null && boe !== undefined) {
                    update.best_on_ecom = boe
                }
                if(language){ update.language = language}
                let options = { new: true }
                let response = await DAO.find_and_update(HomePageSections, query, update, options)
                return response
            }
            
        }
        catch (err) {
            throw err;
        }
    }

}



export {
    section_module
}