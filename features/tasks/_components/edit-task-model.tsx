"use client";

import ResponsiveModel from "@/components/global/responsive-model";
import { useEditTasksModel } from "@/hooks/tasks";

import EditTaskFormWrapper from "./edit-task-form-wrapper";

const EditTaskModel = () => {
  const { taskId, setTaskId, close } = useEditTasksModel();
  return (
    <div>
      <ResponsiveModel isOpen={!!taskId} onOpenChange={close}>
        {taskId && (
          <div>
            <EditTaskFormWrapper onCancel={close} taskId={taskId} />
          </div>
        )}
      </ResponsiveModel>
    </div>
  );
};

export default EditTaskModel;
