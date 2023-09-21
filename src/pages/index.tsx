import { Box, Container, Flex, FormLabel, Input, Select } from "@chakra-ui/react";
import * as Excel from 'exceljs';
import React from "react";
import { Dropzone } from "~/components/Dropzone";
import { TaskAccordion } from "~/components/TaskAccordion";
import { loadTasks, type Task } from "~/utils/tasks";

export default function Home() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [year, setYear] = React.useState(new Date().getFullYear());

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
    <Container paddingTop="5">
      <FormLabel cursor="pointer">
        <Input type="file" onChange={(e) => parseExcel(e)} display="none" />
        <Dropzone />
      </FormLabel>

      {tasks.length > 0 &&
        <>
          <Flex direction="row" flex="1" alignItems="center">
            <Box py="5">{tasks[0]?.name}</Box>
            <Box flexGrow={1}></Box>
            <Box>
              <Select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
                {
                  [...tasks.map((task) => task.date.getFullYear())
                    .reduce((acc, cur) => acc.add(cur), new Set<number>())
                  ].reverse().map((year) => <option key={year} value={year}>{year}</option>)
                }
              </Select>
            </Box>
          </Flex>

          <TaskAccordion tasks={tasks.filter((task) => task.date.getFullYear() === year)} />
        </>
      }
    </Container>
  );
}

