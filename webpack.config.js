// alias node_modules/govuk-frontend to govuk-frontend to allow imports to work with yarn PnP
module.exports = {
  resolve: {
    alias: {
      'node_modules/govuk-frontend': 'govuk-frontend',
    },
  },
};
