import {
    Accordion,
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Box,
    Card,
    CardBody,
    CardHeader,
    Container,
    Grid, GridItem, Input,
    Table,
    TableContainer,
    Tag,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react";
import React from "react";
import { type Task } from "~/utils/tasks";

export type TaskAccordionProps = {
    tasks: Task[]
}

export const TaskAccordion = ({ tasks }: TaskAccordionProps) => {
    tasks = tasks.sort((a, b) => b.date.getTime() - a.date.getTime());

    const grouped = tasks.reduce((accumulator: Record<string, { tasks: Task[] }>, task: Task) => {
        const year = task.date.getFullYear();
        const month = task.date.getMonth();
        const groupKey = `${year},${month}`;
        accumulator[groupKey] = accumulator[groupKey] ?? { tasks: [] };
        accumulator[groupKey]?.tasks.push(task);
        return accumulator;
    }, {});

    return (<>
        <Container>
            <Box py="5">{tasks[0]?.name}</Box>
        </Container>

        <Card>
            <CardHeader>
                <Grid templateColumns='repeat(8, 1fr)' gap={6}>
                    <GridItem>Maand</GridItem>
                    <GridItem>weekDays</GridItem>
                    <GridItem>Feestdagen</GridItem>
                    <GridItem>Verlof</GridItem>
                    <GridItem>workDays</GridItem>
                    <GridItem>Te presteren</GridItem>
                    {/* <GridItem>{ timeTo }</GridItem>
<GridItem>{ timePeriod01 }</GridItem>
<GridItem>{ timePeriod02 }</GridItem>
<GridItem>{ timeFrom }</GridItem> */}
                    <GridItem>Gepresteerd</GridItem>
                    <GridItem>Overuren</GridItem>
                </Grid>
            </CardHeader>
            <CardBody p={0}>
                <Accordion allowToggle>
                    {
                        Object.entries(grouped).map(([key, value]) => {
                            const split = key.split(',');
                            return <TaskAccordionEntry key={key} date={new Date(parseInt(split[0] ?? "0"), parseInt(split[1] ?? "0"))} tasks={value.tasks} />
                        })
                    }
                </Accordion>
            </CardBody>
        </Card>
    </>);
}

export type TaskAccordionEntryProps = {
    date: Date,
    tasks: Task[],
}

export const TaskAccordionEntry = ({ date, tasks }: TaskAccordionEntryProps) => {
    const weekDays = countWeekdays(date)
    const holidays = countHolidays(date);
    const [restDays, setRestDays] = React.useState(0);
    const workDays = weekDays - holidays - restDays;
    const timeToWork = (workDays * 7.6)
    const timeTo = tasks.map((task => task.to.time)).reduce((time, value) => value + time)
    const timePeriod01 = tasks.map((task => task.period01.time)).reduce((time, value) => value + time)
    const timePeriod02 = tasks.map((task => task.period02.time)).reduce((time, value) => value + time)
    const timeFrom = tasks.map((task => task.from.time)).reduce((time, value) => value + time)
    const timeTotal = timeTo + timePeriod01 + timePeriod02 + timeFrom

    return (<>
        <AccordionItem>
            <AccordionButton>
                <Grid templateColumns='repeat(8, 1fr)' gap={6} alignItems="center">

                    <GridItem>{date.toLocaleDateString('en-us', { year: "numeric", month: "numeric" })}</GridItem>
                    <GridItem>{weekDays}</GridItem>
                    <GridItem>{countHolidays(date)}</GridItem>
                    <GridItem><Input variant="filled" type="number" value={restDays} onChange={(e) => setRestDays(parseInt(e.target.value))} ></Input></GridItem>
                    <GridItem>{workDays}</GridItem>
                    <GridItem>{timeToWork.toFixed(2)}</GridItem>
                    {/* <GridItem>{ timeTo }</GridItem>
            <GridItem>{ timePeriod01 }</GridItem>
            <GridItem>{ timePeriod02 }</GridItem>
        <GridItem>{ timeFrom }</GridItem> */}
                    <GridItem>{timeTotal}</GridItem>
                    <GridItem><Tag variant="solid" colorScheme="gray"> {(timeTotal - timeToWork).toFixed(2)} </Tag></GridItem>
                </Grid>
            </AccordionButton>
            <AccordionPanel p={0}>
                <TableContainer m={0}>
                    <Table size='md' variant="striped">
                        <Thead>
                            <Tr>
                                <Th>Datum</Th>
                                <Th>Project</Th>
                                <Th>Comment</Th>
                                <Th isNumeric>Tijd heen</Th>
                                <Th isNumeric>Tijd periode 1</Th>
                                <Th isNumeric>Tijd periode 2</Th>
                                <Th isNumeric>Tijd terug</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                tasks.sort((a, b) => b.date.getTime() - a.date.getTime()).map((task) => {
                                    return (<>
                                        <Tr>
                                            <Td>{task.date.toLocaleDateString()}</Td>
                                            <Td>{task.project} <br />
                                                {task.company} <br />
                                                {task.projectDescription}
                                            </Td>
                                            <Td>{task.comment}</Td>
                                            <Td>{task.to.time}</Td>
                                            <Td>{task.period01.time}</Td>
                                            <Td>{task.period02.time}</Td>
                                            <Td>{task.from.time}</Td>
                                        </Tr>
                                    </>)
                                })
                            }
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Th></Th>
                                <Th></Th>
                                <Th></Th>
                                <Th isNumeric>{timeTo}</Th>
                                <Th isNumeric>{timePeriod01}</Th>
                                <Th isNumeric>{timePeriod02}</Th>
                                <Th isNumeric>{timeFrom}</Th>
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>
            </AccordionPanel>
        </AccordionItem>

    </>)
}

const countWeekdays = (start: Date) => {
    const startMonth = start.getMonth()
    let count = 0;
    const curDate = new Date(start.getTime());
    while (curDate.getMonth() === startMonth) {
        const dayOfWeek = curDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
        curDate.setDate(curDate.getDate() + 1);
    }
    return count;
}

const countHolidays = (start: Date) => {
    const startMonth = start.getMonth()
    let count = 0;
    const curDate = new Date(start.getTime());
    while (curDate.getMonth() === startMonth) {
        if (HOLIDAYS.some((d) => d.getTime() === curDate.getTime())) count++;
        curDate.setDate(curDate.getDate() + 1);
    }
    return count;
}

const HOLIDAYS = [
    new Date('2023/12/25'),
    new Date('2023/11/01'),
    new Date('2023/08/15'),
    new Date('2023/07/21'),
    new Date('2023/05/29'),
    new Date('2023/05/18'),
    new Date('2023/05/19'),
    new Date('2023/05/01'),
    new Date('2023/04/10'),
    new Date('2023/01/02'),
]
