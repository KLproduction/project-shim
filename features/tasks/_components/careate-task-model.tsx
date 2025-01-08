"use client";

import ResponsiveModel from "@/components/global/responsive-model";
import { useCreateTasksModel } from "@/hooks/tasks";
import CreateTaskFormWrapper from "./create-task-form-wrapper";

type Props = {};

const CreateTaskModel = (props: Props) => {
  const { isOpen, close } = useCreateTasksModel();
  return (
    <div>
      <ResponsiveModel isOpen={isOpen} onOpenChange={close}>
        <div>
          <CreateTaskFormWrapper onCancel={close} />
        </div>
      </ResponsiveModel>
    </div>
  );
};

export default CreateTaskModel;
