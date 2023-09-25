import React, { type Dispatch, type SetStateAction } from 'react';
import { type Task } from '~/utils/tasks';

type TaskProviderProps = {
  children?: React.ReactNode;
}

type TaskContextType = {
  tasks?: Task[]
  setTasks?: Dispatch<SetStateAction<Task[]>>
}

const TaskContext = React.createContext<TaskContextType>({});

const TaskConsumer = TaskContext.Consumer;

const TaskProvider = (props: TaskProviderProps) => {
  const [tasks, setTasks] = React.useState<Task[]>([])

  return (
    <TaskContext.Provider value={{tasks, setTasks}}>
      {props.children}
    </TaskContext.Provider>
  )
}

export { TaskConsumer, TaskContext, TaskProvider };

