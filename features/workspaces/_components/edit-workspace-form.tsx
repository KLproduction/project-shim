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
import {
  useConfirm,
  useDeleteWorkspace,
  useResetInviteCode,
  useUpdateWorkspace,
} from "@/hooks/workspace";
import { cn } from "@/lib/utils";
import { ArrowLeft, CopyIcon, ImageIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Workspace } from "../type";
import { toast } from "sonner";

type Props = {
  initialValues: Workspace;
  onCancel?: () => void;
};

export const EditWorkspaceForm = ({ onCancel, initialValues }: Props) => {
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
  } = useUpdateWorkspace(initialValues);

  const { deleteWorkspace, isDeletingWorkspace } = useDeleteWorkspace();
  const { resetInviteCodeMutate, isResettingInviteCode } = useResetInviteCode();

  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const imageUrl = watch("image");
  const fullInviteCode = `${process.env.NEXT_PUBLIC_APP_URL}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;
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
    "Delete Workspace",
    "This action is irreversible. Are you sure you want to delete this workspace?",
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
    deleteWorkspace({ param: { workspaceId: initialValues.$id } });
  };
  const handleReset = async () => {
    const ok = await confirmReset();
    if (!ok) return;
    resetInviteCodeMutate({ param: { workspaceId: initialValues.$id } });
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(fullInviteCode).then(() => {
      toast.success("Invite link copied to clipboard");
    });
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
              : router.push(`/workspaces/${initialValues.$id}`);
          }}
          type="button"
          variant={"link"}
          size={"lg"}
          disabled={isPending}
          className="mt-3"
        >
          <ArrowLeft />
          Back to workspace
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
                Update Workspace
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="h-full w-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold">Invite Member</h3>
            <div className="mt-4">
              <div className="flex items-center justify-between gap-2">
                <Label className="rounded-xl border-2 border-zinc-200 p-3 text-zinc-500">
                  {fullInviteCode}
                </Label>
                <Button
                  variant={"secondary"}
                  className="size-12"
                  onClick={() => {
                    handleCopyInviteLink();
                  }}
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Use the invite link to add members to your workspace.
            </p>
          </div>
        </CardContent>
        <DottedSeparator className="p-7" />
        <CardFooter className="w-full justify-end">
          <Button
            variant={"outline"}
            disabled={isPending || isResettingInviteCode}
            onClick={handleReset}
          >
            Reset Invite Link
          </Button>
        </CardFooter>
      </Card>

      <Card className="h-full w-full border-none bg-red-100 shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col gap-3">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting this workspace will permanently remove all associated
              data from your account.
            </p>
          </div>
        </CardContent>
        <DottedSeparator className="p-7" />
        <CardFooter className="w-full justify-end">
          <Button
            variant={"destructive"}
            disabled={isPending || isDeletingWorkspace}
            onClick={handleDelete}
          >
            Delete Workspace
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
