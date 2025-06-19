import type { CollectionConfig } from "payload";
import { isSuperAdmin } from "@/lib/access";

export const Tenants: CollectionConfig = {
  slug: "tenants",
  access: {
    create: ({ req }) => isSuperAdmin(req?.user),
    delete: ({ req }) => isSuperAdmin(req?.user),
  },
  admin: {
    useAsTitle: "subdomain",
  },
  fields: [
    // Email added by default (by payload)
    {
      name: "name",
      required: true,
      type: "text",
      label: "Store name",
      admin: {
        description: "This is the name of the store (Raj's store)",
      },
    },
    {
      name: "subdomain",
      type: "text",
      index: true,
      required: true,
      unique: true,
      access: {
        update: ({ req }) => isSuperAdmin(req?.user),
      },
      admin: {
        description:
          "This is the subdomain for the store (e.g. [subdomain].funroad.com)",
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "stripeAccountId",
      type: "text",
      required: true,
      access: {
        update: ({ req }) => isSuperAdmin(req?.user),
      },
      admin: {
        readOnly: true,
        description: "This is the Stripe account ID associated with your shop.",
      }
    },
    {
      name: "stripeDetailsSubmitted",
      type: "checkbox",
      access: {
        update: ({ req }) => isSuperAdmin(req?.user),
      },
      admin: {
        readOnly: true,
        description:
          "You cannot create products until you submit your Stripe details.",
      },
    },
  ],
};
