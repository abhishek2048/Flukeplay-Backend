const adminModel = require("../models/adminModel");

class admin_services {
  static async registeradmin(name, email, password) {
    try {
      //console.log(name, email);
      const createadmin = new adminModel({ name, email, password });
      return await createadmin.save();
    } catch (error) {
      throw error;
    }
  }
}
module.exports = ({ env }) => ({
  // autoOpen: false,
  auth: {
    secret: env("ADMIN_JWT_SECRET", "example-token"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT", "example-salt"),
  },
  auditLogs: {
    enabled: env.bool("AUDIT_LOGS_ENABLED", true),
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT", "example-salt"),
    },
  },
  flags: {
    nps: env.bool("FLAG_NPS", true),
    promoteEE: env.bool("FLAG_PROMOTE_EE", true),
  },
});
module.exports = admin_services;
