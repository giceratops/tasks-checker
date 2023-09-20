import { Container, FormLabel, Input } from "@chakra-ui/react";
import * as Excel from 'exceljs';
import React from "react";
import { Dropzone } from "~/components/Dropzone";
import { TaskTable } from "~/components/TaskTable";
import { loadTasks, type Task } from "~/utils/tasks";

export default function Home() {
  const [tasks, setTasks] = React.useState<Task[]>([]);


  const parseExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files?.[0]) {
      const wb = new Excel.Workbook();
      const reader = new FileReader();
      reader.readAsArrayBuffer(e.target.files[0])
      reader.onload = () => {
        const buffer = reader.result as Excel.Buffer;
        wb.xlsx.load(buffer).then(workbook => {
          setTasks(loadTasks(workbook))
        }).catch(err => {
          console.error('THE ERROR', err);
          setTasks([])
        })
      }
      e.target.value = '';
    }
  }

  return (
    <>
      <Container paddingTop="5">
        <FormLabel cursor="pointer">
          <Input type="file" onChange={(e) => parseExcel(e)} display="none" />
          <Dropzone />
        </FormLabel>

      { tasks.length > 0 && <TaskTable tasks={tasks} /> }

      </Container>
    </>
  );
}

