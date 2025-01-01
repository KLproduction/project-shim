"use client";

import DottedSeparator from "@/components/global/DottedSeparator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateWorkspace } from "@/hooks/workspace";
import { cn } from "@/lib/utils";
import { get } from "http";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Props = {
  onCancel?: () => void;
};

export const CreateWorkspaceForm = ({ onCancel }: Props) => {
  const imgInputRef = useRef<HTMLInputElement | null>(null);
  const {
    register,
    errors,
    handleSubmit,
    onSubmit,
    isPending,
    getValues,
    setValue,
    watch,
  } = useCreateWorkspace();

  const pathname = usePathname();
  const isCreatePage = pathname === "/workspaces/create";
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const imageUrl = watch("image");
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Card className="h-full w-full border-none shadow-none">
      <CardHeader className="flex w-full justify-center p-7">
        <CardTitle className="text-xl font-bold">Create a Workspace</CardTitle>
      </CardHeader>
      <div className="p-7">
        <DottedSeparator />
      </div>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col items-center justify-center space-y-4"
        >
          <Label className="w-full text-start">Workspace name </Label>
          <Input {...register("name")} placeholder="Enter Workspace name" />
          {errors && errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
          )}

          {getValues("image") ? (
            <div className="mt-6 flex h-full w-full items-center justify-center">
              <Image
                src={
                  previewUrl || (typeof imageUrl === "string" ? imageUrl : "")
                }
                alt="image"
                width={100}
                height={100}
                className="aspect-ratio flex rounded-lg object-cover object-center"
              />
            </div>
          ) : (
            <Avatar className="size-[72px]">
              <AvatarFallback>
                <ImageIcon className="size-[72px] text-zinc-200" />
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-col pl-12">
            <p className="text-sm">{`Upload Image for your workspace (Optional)`}</p>
            <p className="text-sm text-zinc-500">{`JPG, PNG, JPEG, SVG up to 1MB`}</p>
          </div>

          <Input
            {...register("image")}
            type="file"
            className="hidden"
            ref={imgInputRef}
            onChange={handleImageChange}
            accept=".jpg, .jpeg, .png, .svg"
            disabled={isPending}
          />
          <Button
            type="button"
            size={"sm"}
            disabled={isPending}
            className="mt-2 w-fit"
            variant={"outline"}
            onClick={() => imgInputRef.current?.click()}
          >
            Choose Image
          </Button>

          <DottedSeparator className="p-7" />

          <div
            className={cn(
              "flex w-full items-center",
              isCreatePage ? "justify-center" : "justify-between",
            )}
          >
            <Button
              onClick={onCancel}
              type="button"
              variant={"outline"}
              size={"lg"}
              disabled={isPending}
              className={cn(isCreatePage ? "hidden" : "")}
            >
              Cancel
            </Button>
            <Button type="submit" size={"lg"} disabled={isPending}>
              Create Workspace
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
