"use client";

import { UploadButton } from "@/app/api/uploadthing/upload";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { settings } from "@/server/actions/settings";
import { SettingsSchema, type SettingsSchemaType } from "@/types/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Session } from "next-auth";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  session: Session;
};

const SettingsCard = ({ session }: Props) => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [avatarUploading, setAvatarUploading] = useState(false);

  const form = useForm<SettingsSchemaType>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: session.user?.name || undefined,
      email: session.user?.email || undefined,
      image: session.user?.image || undefined,
      isTwoFactorEnabled: session.user?.isTwoFactorEnabled || undefined,
    },
  });

  const { execute, status } = useAction(settings, {
    onSuccess: (data) => {
      if (data?.success) setSuccess(data.success);
      if (data?.error) setError(data.error);
    },
    onError: () => {
      setError("Something went wrong");
    },
  });

  const onSubmit = (values: SettingsSchemaType) => {
    if (error) setError(undefined);
    if (success) setSuccess(undefined);
    execute(values);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        disabled={status === "executing"}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <div className="flex items-center gap-4">
                      {!form.getValues("image") && (
                        <div className="font-bold">
                          {session.user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {form.getValues("image") && (
                        <Image
                          src={form.getValues("image")!}
                          width={42}
                          height={42}
                          className="h-[42px] w-[42px] rounded-full"
                          alt="User Image"
                        />
                      )}
                      <UploadButton
                        className="ut:button:transition-all scale-75  ut-button:bg-primary/75  ut-button:ring-primary  ut-button:duration-500 hover:ut-button:bg-primary/100 ut-allowed-content:hidden  ut-label:hidden ut-label:bg-red-50"
                        endpoint="avatarUploader"
                        onUploadBegin={() => {
                          setAvatarUploading(true);
                        }}
                        onUploadError={(error) => {
                          form.setError("image", {
                            type: "validate",
                            message: error.message,
                          });
                          setAvatarUploading(false);
                          return;
                        }}
                        onClientUploadComplete={(res) => {
                          form.setValue("image", res[0].url!);
                          setAvatarUploading(false);
                          return;
                        }}
                        content={{
                          button({ ready }) {
                            if (ready) return <div>Change Avatar</div>;
                            return <div>Uploading...</div>;
                          },
                        }}
                      />
                    </div>
                    <FormControl>
                      <Input
                        placeholder="User Image"
                        type="hidden"
                        disabled={status === "executing"}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        disabled={
                          status === "executing" || session.user.isOAuth
                        }
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="*******"
                        disabled={
                          status === "executing" || session.user.isOAuth
                        }
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Authentication</FormLabel>
                    <FormDescription>
                      Enable two factor authentication for your account
                    </FormDescription>
                    <FormControl>
                      <Switch
                        disabled={
                          status === "executing" ||
                          session.user.isOAuth === true
                        }
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button
                type="submit"
                disabled={status === "executing" || avatarUploading}
              >
                Update your settings
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default SettingsCard;
