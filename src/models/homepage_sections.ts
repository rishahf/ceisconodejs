import { createSchema, Type, typedModel } from 'ts-mongoose';

const language = [ "ENGLISH","ARABIC"]

const HomePageSectionsSchema = createSchema({
    // banners                 : Type.boolean({ default: true }),
    top_banners             : Type.boolean({ default: true }),
    middle_banners          : Type.boolean({ default: true }),
    bottom_banners          : Type.boolean({ default: true }),
    deal_of_the_day         : Type.boolean({ default: true }),
    top_deals               : Type.boolean({ default: true }),
    fashion_deals           : Type.boolean({ default: true }),
    style_for_categories    : Type.boolean({ default: true }),
    featured_categories     : Type.boolean({ default: true }),
    shop_with_us            : Type.boolean({ default: true }),
    best_on_ecom            : Type.boolean({ default: true }),
    language                : Type.string({ default: "ENGLISH", enum:language }),
    updated_at              : Type.string({ default: +new Date() }),
    created_at              : Type.string({ default: +new Date() })
})
const HomePageSections = typedModel('homePage_sections', HomePageSectionsSchema)
export default HomePageSections