"use client";

import DottedSeparator from "@/components/global/DottedSeparator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConfirm, useResetInviteCode } from "@/hooks/workspace";
import { cn } from "@/lib/utils";
import { ArrowLeft, CopyIcon, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Project } from "../type";
import { toast } from "sonner";
import { useDeleteProject, useUpdateProject } from "@/hooks/projects";

type Props = {
  initialValues: Project;
  onCancel?: () => void;
};

export const EditProjectForm = ({ onCancel, initialValues }: Props) => {
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
  } = useUpdateProject({ initialValues });

  const { deleteProjectMutate, isDeletingProject } = useDeleteProject();

  const router = useRouter();
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

  const [ConfirmationDialog, confirm] = useConfirm(
    "Delete Project",
    "This action is irreversible. Are you sure you want to delete this Project?",
    "destructive",
  );
  const [ResetDialog, confirmReset] = useConfirm(
    "Reset Invite Link",
    "This will invalidate the current invite link. Are you sure you want to reset the invite link?",
    "destructive",
  );

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    deleteProjectMutate({ param: { projectId: initialValues.$id } });
  };

  return (
    <div className="flex flex-col gap-4">
      <ConfirmationDialog />
      <ResetDialog />
      <Card className="h-full w-full border-none shadow-none">
        <Button
          onClick={() => {
            onCancel
              ? onCancel()
              : router.push(
                  `/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`,
                );
          }}
          type="button"
          variant={"link"}
          size={"lg"}
          disabled={isPending}
          className="mt-3"
        >
          <ArrowLeft />
          Back to project
        </Button>
        <CardHeader className="flex w-full justify-center p-7">
          <CardTitle className="text-center text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>
        <div className="p-7">
          <DottedSeparator />
        </div>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col items-center justify-center space-y-4"
          >
            <Label className="w-full text-start">Project name </Label>
            <Input {...register("name")} placeholder="Enter Project name" />
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
              <p className="text-sm">{`Upload Image for your project (Optional)`}</p>
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
            {watch("image") === undefined || !watch("image") ? (
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
            ) : (
              <Button
                type="button"
                size={"sm"}
                disabled={isPending}
                className="mt-2 w-fit"
                variant={"outline"}
                onClick={() => {
                  setValue("image", undefined);
                  if (imgInputRef.current) {
                    imgInputRef.current.value = "";
                  }
                }}
              >
                Remove Image
              </Button>
            )}

            <DottedSeparator className="p-7" />

            <div className={cn("flex w-full items-center justify-end")}>
              <Button type="submit" size={"lg"} disabled={isPending}>
                Update Project
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="h-full w-full border-none bg-red-100 shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col gap-3">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting this Project will permanently remove all associated data
              from your account.
            </p>
          </div>
        </CardContent>
        <DottedSeparator className="p-7" />
        <CardFooter className="w-full justify-end">
          <Button
            variant={"destructive"}
            disabled={isPending || isDeletingProject}
            onClick={handleDelete}
          >
            Delete Project
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
