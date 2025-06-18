import z from "zod";
import { useForm } from "react-hook-form";
import { ReviewsGetOneOutput } from "@/modules/reviews/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StarPicker } from "@/components/star-picker";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props {
  productId: string;
  initialData?: ReviewsGetOneOutput;
}

const formSchema = z.object({
  rating: z.number().min(1, { message: "Rating is required" }).max(5),
  description: z.string().min(1, { message: "Description is required" }),
});

export const ReviewForm = ({ productId, initialData }: Props) => {
  const [isPreview, setIsPreview] = useState(!!initialData);

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const createReview = useMutation(trpc.reviews.create.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.reviews.getOne.queryOptions({
        productId
      }))
      setIsPreview(true)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  }))
  const updateReview = useMutation(trpc.reviews.update.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.reviews.getOne.queryOptions({
        productId
      }))
      setIsPreview(true)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  }))

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      rating: initialData?.rating || 0,
      description: initialData?.description || "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (initialData) {
      updateReview.mutate({
        reviewId: initialData.id,
        rating: data.rating,
        description: data.description
      })
    } else {
      createReview.mutate({
        productId: productId,
        rating: data.rating,
        description: data.description,
      })
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <p className="font-medium">
          {isPreview ? "Your rating: " : "Liked it? Give it a rating!"}
        </p>
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (<FormItem>
            <FormControl>
              <StarPicker
                value={field.value}
                onChange={field.onChange}
                disabled={isPreview} />
            </FormControl>
            <FormMessage />
          </FormItem>)} />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (<FormItem>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Want to leave a written review"
                disabled={isPreview}
              />
            </FormControl>
            <FormMessage />
          </FormItem>)} />
        {!isPreview && <Button
          variant="elevated"
          disabled={createReview.isPending || updateReview.isPending}
          type="submit"
          size="lg"
          className="bg-black text-white hover:bg-pink-400 hover:text-primary w-fit"
        >
          {initialData ? "Update Review" : "Post Review"}
        </Button>}
      </form>
      {isPreview &&
        <Button
          variant="elevated"
          className="w-fit mt-4"
          onClick={() => {
            setIsPreview(false)
          }}>
          Edit
        </Button>}
    </Form>
  );
};
