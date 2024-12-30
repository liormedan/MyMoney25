import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  cardNumber: z
    .string()
    .min(16, { message: "מספר כרטיס חייב להכיל 16 ספרות" })
    .max(16)
    .regex(/^\d+$/, { message: "מספר כרטיס חייב להכיל ספרות בלבד" }),
  expiryMonth: z
    .string()
    .min(1)
    .max(2)
    .regex(/^(0?[1-9]|1[0-2])$/, { message: "חודש לא תקין" }),
  expiryYear: z.string().length(2).regex(/^\d+$/, { message: "שנה לא תקינה" }),
  cvv: z.string().length(3).regex(/^\d+$/, { message: "CVV לא תקין" }),
});

interface AddCreditCardDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: z.infer<typeof formSchema>) => void;
}

export function AddCreditCardDialog({
  open = false,
  onOpenChange = () => {},
  onSubmit = () => {},
}: AddCreditCardDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>הוספת כרטיס אשראי</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>מספר כרטיס</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="הזן מספר כרטיס"
                      {...field}
                      maxLength={16}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="expiryMonth"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>חודש</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MM"
                        {...field}
                        maxLength={2}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiryYear"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>שנה</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="YY"
                        {...field}
                        maxLength={2}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="***"
                        {...field}
                        maxLength={3}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                ביטול
              </Button>
              <Button type="submit">הוסף כרטיס</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
