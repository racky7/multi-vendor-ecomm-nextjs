import { Category, Media, Tenant } from "@/payload-types";
import { headers as getHeaders } from "next/headers";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Sort, Where } from "payload";
import { z } from "zod";
import { sortValues } from "../search-params";
import { DEFAULT_LIMIT } from "@/constants";

export const productsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const headers = await getHeaders();
      const session = await ctx.db.auth({ headers });

      const product = await ctx.db.findByID({
        collection: "products",
        id: input.id,
        depth: 2,
        select: {
          content: false,
        },
      });

      let isPurchased = false;

      if (session.user) {
        const ordersData = await ctx.db.find({
          collection: "orders",
          pagination: false,
          limit: 1,
          where: {
            and: [
              {
                product: {
                  equals: input.id,
                },
                user: {
                  equals: session.user.id,
                },
              },
            ],
          },
        });

        isPurchased = !!ordersData.docs[0];
      }

      const reviews = await ctx.db.find({
        collection: 'reviews',
        pagination: false,
        where: {
          product: {
            equals: product.id
          },
        }
      })

      const reviewRating = reviews.docs.length > 0 ?
        reviews.docs.reduce((acc, review) => acc + review.rating, 0) / (reviews.totalDocs || 1)
        : 0

      const ratingDistribution: Record<number, number> = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      };

      if (reviews.docs.length > 0) {
        reviews.docs.forEach((review) => {
          const rating = review.rating
          if (review.rating >= 1 && rating <= 5) {
            ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
          }
        });

        Object.keys(ratingDistribution).forEach((key) => {
          const rating = Number(key)
          const count = ratingDistribution[rating] || 0
          ratingDistribution[rating] = (count / reviews.totalDocs) * 100;
        })
      }

      return {
        ...product,
        isPurchased,
        reviewRating,
        ratingDistribution,
        reviewCount: reviews.totalDocs,
        image: product.image as Media | null,
        tenant: product.tenant as Tenant & { image: Media | null },
      };
    }),
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
        tenantSubdomain: z.string().nullable().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      let sort: Sort = "-createdAt";

      if (input.sort === "trending") {
        sort = "-createdAt";
      }

      if (input.sort === "curated") {
        sort = "-createdAt";
      }

      if (input.sort === "hot_and_new") {
        sort = "+createdAt";
      }

      if (input.minPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
        };
      }

      if (input.maxPrice) {
        where.price = {
          ...(where?.price ?? {}),
          less_than_equal: input.maxPrice,
        };
      }

      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }

      if (input.sort) {
      }

      if (input.tenantSubdomain) {
        where["tenant.subdomain"] = {
          equals: input.tenantSubdomain,
        };
      }

      if (input.category) {
        const categoriesData = await ctx.db.find({
          collection: "categories",
          limit: 1,
          depth: 1, // Populate subcategories
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
          sort,
        });

        const formattedData = categoriesData.docs.map((category) => ({
          ...category,
          subcategories: (category.subcategories?.docs ?? []).map(
            (subcategory) => ({
              // Because of depth 1, we are confident that subcategories will be a type of Category
              ...(subcategory as Category),
            }),
          ),
        }));

        const subcategorySlugs = [];
        const parentCategory = formattedData[0];

        if (parentCategory) {
          subcategorySlugs.push(
            ...(parentCategory.subcategories?.map(
              (subcategory) => (subcategory as Category).slug,
            ) ?? []),
          );

          where["category.slug"] = {
            in: [parentCategory.slug, ...subcategorySlugs],
          };
        }
      }
      const data = await ctx.db.find({
        collection: "products",
        depth: 2, // Populate category, image, tenant & tenant.image
        where: where,
        page: input.cursor,
        limit: input.limit,
        select: {
          content: false,
        },
      });

      // TODO: We can improve this by fetching all reviews by product ids and then group by product review
      const dataWithSummarizedRewiews = await Promise.all(
        data.docs.map(async (doc) => {
          const reviews = await ctx.db.find({
            collection: 'reviews',
            pagination: false,
            where: {
              product: {
                equals: doc.id
              },
            }
          })

          return ({
            ...doc,
            reviewCount: reviews.totalDocs,
            reviewRating: reviews.docs.reduce((acc, review) => acc + review.rating, 0) / (reviews.totalDocs || 1),
          })
        }))

      return {
        ...data,
        docs: dataWithSummarizedRewiews.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
