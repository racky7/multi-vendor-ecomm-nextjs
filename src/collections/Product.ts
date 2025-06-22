import { isSuperAdmin } from "@/lib/access";
import { Tenant } from "@/payload-types";
import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  access: {
    create: ({ req }) => {
      if (isSuperAdmin(req?.user)) {
        return true;
      }

      const tenant = req?.user?.tenants?.[0]?.tenant as Tenant

      return Boolean(tenant?.stripeDetailsSubmitted)
    },
  },
  admin: {
    useAsTitle: "name",
    description: "You must verify your Stripe account before creating products.",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      // TODO: Change to richText
      type: "text",
    },
    {
      name: "price",
      type: "number",
      required: true,
      admin: {
        description: "Price in INR",
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "refundPolicy",
      type: "select",
      options: ["30-day", "14-day", "7-day", "1-day", "no-refunds"],
      defaultValue: "30-day",
    },
    {
      name: "content",
      // TODO: Change to richText
      type: "textarea",
      admin: {
        description: "Protected content that is only visible to users who have purchased this product. Add product documentation, downloaded materials, or any other content that should be accessible only to buyers. Supports markdown formatting.",
      }
    }
  ],
};
