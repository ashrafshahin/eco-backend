const productImportSchema = {
  title: {
    column: "Title",
    type: String,
  },
  slug: {
    column: "Slug",
    type: String,
  },
  sku: {
    column: "SKU",
    type: String,
  },
  description: {
    column: "Description",
    type: String,
  },
  shortDescription: {
    column: "Short Description",
    type: String,
  },
  price: {
    column: "Price",
    type: Number,
  },
  discount: {
    column: "Discount",
    type: Number,
  },
  discountType: {
    column: "Discount Type",
    type: String,
  },
  discountStartDate: {
    column: "Discount Start Date",
    type: Date,
  },

  discountEndDate: {
    column: "Discount End Date",
    type: Date,
  },
  stock: {
    column: "Stock",
    type: Number,
  },
  category: {
    column: "Category",
    type: String,
  },
  brand: {
    column: "Brand",
    type: String,
  },
  tags: {
    column: "Tags",
    type: String,
  },
  additionalInformation: {
    column: "Additional Information",
    type: String,
  },
  status: {
    column: "Status",
    type: String,
  },
  imageUrl: {
    column: "Image URL",
    type: String,
  },
};

module.exports = productImportSchema;