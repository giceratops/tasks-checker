import { Box, Container, Flex, Select } from "@chakra-ui/react";
import React, { useContext } from "react";
import { EventTaskTable } from "~/components/EventTaskTable";
import { TaskAccordion } from "~/components/TaskAccordion";
import { TaskContext } from "~/providers/TaskProvider";

export default function Home() {
  const { tasks } = useContext(TaskContext);
  const [year, setYear] = React.useState(new Date().getFullYear());

  return (
    <Container paddingTop="5">
      {tasks && tasks.length > 0 &&
        <>
          <Flex direction="row" flex="1" alignItems="center">
            <Box flexGrow={1}></Box>
            <Box py={2}>
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

          <Box py={5}>
            <EventTaskTable tasks={tasks} />
          </Box>
        </>
      }
    </Container>
  );
}

