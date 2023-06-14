
const seckret_keys: any = {
      admin_seckret_key: "admin_seckret_key",
      user_seckret_key: "user_seckret_key",
      seller_seckret_key:"seller_seckret_key"
}

const scope = {
      admin: "admin",
      user: "user",
      seller:"seller"
}

const default_limit = 10;
const salt_rounds = 10;


export {
      seckret_keys,
      scope,
      default_limit,
      salt_rounds
}


