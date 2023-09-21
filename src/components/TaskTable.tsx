import {
    Box, Input, Table, TableContainer, Tag, Tbody, Td, Th, Thead, Tr
} from "@chakra-ui/react";
import React from "react";
import { type Task } from "~/utils/tasks";

export type TaskTableProps = {
    tasks: Task[]
}

export const TaskTable = ({ tasks }: TaskTableProps) => {
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
        <Box py="5">{tasks[0]?.name}</Box>

        <TableContainer>
            <Table size='md' variant="striped">
                <Thead>
                    <Tr>
                        <Th>Maand</Th>
                        <Th isNumeric>Weekdagen</Th>
                        <Th isNumeric>Werkdagen</Th>
                        <Th isNumeric>Feestdagen</Th>
                        <Th isNumeric>Verlof</Th>
                        <Th isNumeric>Te presteren</Th>
                        {/* <Th isNumeric>Tijd heen</Th>
                        <Th isNumeric>Tijd periode 1</Th>
                        <Th isNumeric>Tijd periode 2</Th>
                        <Th isNumeric>Tijd terug</Th> */}
                        <Th isNumeric>Gepresteerd</Th>
                        <Th isNumeric>Overruen</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        Object.entries(grouped).map(([key, value]) => {
                            const split = key.split(',');
                            return <TaskTableEntry key={key} date={new Date(parseInt(split[0] ?? "0"), parseInt(split[1] ?? "0"))} tasks={value.tasks} />
                        })
                    }
                </Tbody>
            </Table>
        </TableContainer>
    </>);
}

export type TaskTableEntryProps = {
    date: Date,
    tasks: Task[],
}

export const TaskTableEntry = ({ date, tasks }: TaskTableEntryProps) => {
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
        <Tr>
            <Td>{date.toLocaleDateString('en-us', { year: "numeric", month: "numeric" })}</Td>
            <Td isNumeric>{weekDays}</Td>
            <Td isNumeric>{workDays}</Td>
            <Td isNumeric>{countHolidays(date)}</Td>
            <Td isNumeric><Input type="number" size="xs" value={restDays} onChange={(e) => setRestDays(parseInt(e.target.value))} ></Input></Td>
            <Td isNumeric>{timeToWork.toFixed(2)}</Td>
            {/* <Td>{ timeTo }</Td>
            <Td>{ timePeriod01 }</Td>
            <Td>{ timePeriod02 }</Td>
            <Td>{ timeFrom }</Td> */}
            <Td isNumeric>{timeTotal}</Td>
            <Td isNumeric><Tag variant="solid" colorScheme="gray"> {(timeTotal - timeToWork).toFixed(2)} </Tag></Td>
        </Tr>

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
