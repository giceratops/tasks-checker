import { Box, Center, Container, Divider, FormLabel, HStack, Icon, Input, Text, Wrap, useToast } from "@chakra-ui/react";
import * as Excel from 'exceljs';
import { useContext } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { TaskContext } from "~/providers/TaskProvider";
import { loadTasks } from "~/utils/tasks";
import { DarkModeSwitch } from "./DarkModeSwitch";

export const Navbar = () => {
  const { tasks, setTasks } = useContext(TaskContext)
  const toast = useToast()

  const parseExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files?.[0]) {
      const wb = new Excel.Workbook();
      const reader = new FileReader();
      reader.readAsArrayBuffer(e.target.files[0])
      reader.onload = () => {
        const buffer = reader.result as Excel.Buffer;
        wb.xlsx.load(buffer).then(workbook => {
          if (setTasks)
            setTasks(loadTasks(workbook))
        }).catch(err => {
          console.error('THE ERROR', err);
          toast({
            title: `Error loading tasks`,
            variant: 'left-accent',
            position: 'top',
            status: 'error',
            isClosable: true,
          })

          if (setTasks)
            setTasks([])
        })
      }
      e.target.value = '';
    }
  }

  return (
    <Box as="section" position="sticky" top="0" zIndex="docked" bg="bg.surface" shadow="lg">
      <Container py="4">
        <HStack justify="space-between">
          <HStack spacing="10">
            <Text>{tasks?.[0]?.name}</Text>
          </HStack>
          <HStack justify="center" alignItems="center" placeItems="center" justifyItems="center" gap={5}>
            <FormLabel cursor="pointer" my={0}>
              <Input type="file" onChange={(e) => parseExcel(e)} display="none" />
              <Wrap>
                <Icon as={FiUploadCloud} boxSize="6" />
                Upload
              </Wrap>
            </FormLabel>

            <Center height="25px">
              <Divider orientation="vertical" />
            </Center>

            <DarkModeSwitch />
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
};