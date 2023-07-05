import { createSchema, Type, typedModel } from 'ts-mongoose';
import * as Models from './index';
const type = ['ABOUT_US', 'PRIVACY_POLICY', 'TERMS_AND_CONDITIONS',"CARRERS","SHIPPING","PAYMENTS","PAYMENTS_SECURITY","RETURN_POLICY"]
const language = ["ENGLISH", "ARABIC"];
const ContentSchema = createSchema({
  type: Type.string({ enum: type }),
  description: Type.string({ default: null }),
  image_url: Type.string({ default: null }),
  language: Type.string({ default: "ENGLISH", enum: language }),
  created_at: Type.string({ default: +new Date() }),
});

const Content = typedModel('content', ContentSchema);
export default Content