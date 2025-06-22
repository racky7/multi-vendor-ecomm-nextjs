import { CollectionConfig } from "payload";
import { isSuperAdmin } from "@/lib/access";

export const Orders: CollectionConfig = {
  slug: "orders",
  access: {
    read: ({ req, }) => {
      if (isSuperAdmin(req?.user)) {
        return true;
      }
      // TODO: For non-super admins, allow read access only if the user is the owner of the order
      return false
    },
    create: ({ req }) => isSuperAdmin(req?.user),
    update: ({ req }) => isSuperAdmin(req?.user),
    delete: ({ req }) => isSuperAdmin(req?.user),
  },
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
    },
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      required: true,
      hasMany: false,
    },
    {
      name: "stripeCheckoutSessionId",
      type: "text",
      required: true,
      admin: {
        description: "Stripe Checkout Session associated with this order.",
      }
    },
    {
      name: "stripeAccountId",
      type: "text",
      admin: {
        description: "Stripe Account ID associated with this order.",
      }
    }
  ],
};
