import { createSchema, Type, typedModel } from "ts-mongoose";
import { Category, SubCategory, Sub_subcategories, Brands } from "./index";

const DealsTimerSchema = createSchema({
  valid_till: Type.number({ default: 0 }),
  is_active: Type.boolean({ default: true }),
  updated_at: Type.string({ default: null }),
  created_at: Type.string({ default: +new Date() }),
});
const Deals_Timer = typedModel("deals_timer", DealsTimerSchema);
export default Deals_Timer;