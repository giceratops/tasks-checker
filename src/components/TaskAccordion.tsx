import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Card,
    CardBody,
    CardHeader,
    Grid, GridItem,
    Icon,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Tfoot,
    Th,
    Thead,
    Tr,
    Wrap
} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { BsFileEarmarkCheck, BsFileEarmarkMinus, BsFileEarmarkPlus } from "react-icons/bs";
import { api } from "~/utils/api";
import { type Task, type TaskPeriod } from "~/utils/tasks";

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

    return (
        <Card variant="outline">
            <CardHeader bgColor="whiteAlpha.200">
                <Grid templateColumns='repeat(10, 1fr)' gap={3}>
                    <GridItem>Maand</GridItem>
                    <GridItem>Weekdagen</GridItem>
                    <GridItem>Feestdagen</GridItem>
                    <GridItem>Verlof</GridItem>
                    <GridItem>Werkdagen</GridItem>
                    <GridItem>Te presteren</GridItem>
                    <GridItem>Gepresteerd</GridItem>
                    <GridItem>Overuren</GridItem>
                    <GridItem>Loonbrief</GridItem>
                    <GridItem></GridItem>
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
    );
}

export type TaskAccordionEntryProps = {
    date: Date,
    tasks: Task[],
}

export const TaskAccordionEntry = ({ date, tasks }: TaskAccordionEntryProps) => {
    const mutateMonth = api.example.setByMonth.useMutation()
    const { data, isLoading } = api.example.findByMonth.useQuery({
        name: tasks[0]?.name ?? '',
        month: date.getFullYear() + ',' + date.getMonth(),
        key: 'restDays',
    })
    React.useEffect(() => {
        if (!isLoading) { setRestDays(data ?? 0) }
    }, [data, isLoading])

    const { data: dataLoon, isLoading: isLoadingLoon } = api.example.findByMonth.useQuery({
        name: tasks[0]?.name ?? '',
        month: date.getFullYear() + ',' + date.getMonth(),
        key: 'loon',
    })
    React.useEffect(() => {
        if (!isLoadingLoon) { setLoon('' + dataLoon ?? '0') }
    }, [dataLoon, isLoadingLoon])

    const weekDays = countWeekdays(date)
    const holidays = countHolidays(date);
    const [restDays, setRestDays] = React.useState(0);
    const workDays = weekDays - holidays - (restDays ?? 0);
    const timeToWork = (workDays * 7.6)
    const timeTo = tasks.map((task => task.to.time)).reduce((time, value) => value + time)
    const timePeriod01 = tasks.map((task => task.period01.time)).reduce((time, value) => value + time)
    const timePeriod02 = tasks.map((task => task.period02.time)).reduce((time, value) => value + time)
    const timeFrom = tasks.map((task => task.from.time)).reduce((time, value) => value + time)
    const timeTotal = timeTo + timePeriod01 + timePeriod02 + timeFrom
    const overTime = timeTotal - timeToWork
    const [loon, setLoon] = React.useState('0');
    const diff = Math.abs(overTime - Number(loon))

    const updateRestDays = (value: number) => {
        mutateMonth.mutate({
            name: tasks[0]?.name ?? '',
            month: date.getFullYear() + ',' + date.getMonth(),
            key: 'restDays',
            value
        })
        setRestDays(value)
    }
    const updateLoon = (value: string) => {
        setLoon(value)

        const numberValue = Number(value)
        if (!Number.isNaN(numberValue)) {
            mutateMonth.mutate({
                name: tasks[0]?.name ?? '',
                month: date.getFullYear() + ',' + date.getMonth(),
                key: 'loon',
                value: numberValue
            })
        }
    }
    return (<>
        <AccordionItem>
            <AccordionButton as="div">
                <Grid templateColumns='repeat(10, 1fr)' gap={3} alignItems="center" justifyItems="left">
                    <GridItem>{date.toLocaleDateString('en-us', { year: "numeric", month: "numeric" })}</GridItem>
                    <GridItem>{weekDays}</GridItem>
                    <GridItem>{countHolidays(date)}</GridItem>
                    <GridItem>
                        <NumberInput onChange={(_, value) => updateRestDays(value)} value={restDays}>
                            <NumberInputField disabled={isLoading} />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </GridItem>
                    <GridItem>{workDays}</GridItem>
                    <GridItem>{decimalToTime(timeToWork)}</GridItem>
                    <GridItem>{decimalToTime(timeTotal)}</GridItem>
                    <GridItem>{overTime.toFixed(2)}</GridItem>
                    <GridItem>
                        <NumberInput step={0.1} precision={2} onChange={(value) => updateLoon(value)} value={loon}>
                            <NumberInputField step={0.1} disabled={isLoadingLoon} />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </GridItem>
                    <GridItem>
                        {
                            Number(loon) > 0 &&
                            (
                                diff >= 0.1 ?
                                    <Wrap justifyItems="center" color={(overTime - Number(loon)) > 0.0 ? 'red.300' : 'green.300'}>
                                        <Icon boxSize={5} as={(overTime - Number(loon)) > 0.0 ? BsFileEarmarkMinus : BsFileEarmarkPlus} 
                                        ></Icon>
                                        <Text> {decimalToTime(Math.abs(Number(loon) - overTime))}
                                        </Text>
                                    </Wrap>
                                    :
                                    <Text><Icon boxSize={5} as={BsFileEarmarkCheck}></Icon></Text>
                            )
                        }

                        {/* {(diff >= 0.0 && diff < 0.3) && Number(loon) > 0 &&
                            <Tag mr={2} colorScheme="green">
                                <TagLeftIcon boxSize='12px' as={MdCheckCircleOutline} />
                                <TagLabel>{(Number(loon) - overTime).toFixed(2)}</TagLabel>
                            </Tag>
                        }
                        {(diff >= 0.3 && diff < 1.5) && Number(loon) > 0 &&
                            <Tag mr={2} colorScheme="orange">
                                <TagLeftIcon boxSize='12px' as={MdOutlineWarningAmber} />
                                <TagLabel>{(Number(loon) - overTime).toFixed(2)}</TagLabel>
                            </Tag>
                        }
                        {(diff >= 1.5) && Number(loon) > 0 &&
                            <Tag mr={2} colorScheme="red">
                                <TagLeftIcon boxSize='12px' as={MdOutlineErrorOutline} />
                                <TagLabel>{(Number(loon) - overTime).toFixed(2)}</TagLabel>
                            </Tag>
                        } */}
                    </GridItem>
                </Grid>
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel p={0}>
                <TableContainer m={0}>
                    <Table size='md' variant="striped">
                        <Thead>
                            <Tr>
                                <Th>Datum</Th>
                                <Th>Project</Th>
                                <Th>Commentaar</Th>
                                <Th>Heen</Th>
                                <Th>Periode 1</Th>
                                <Th>Periode 2</Th>
                                <Th>Terug</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                tasks.sort((a, b) => b.date.getTime() - a.date.getTime()).map((task) => {
                                    return (
                                        <Tr key={task.id}>
                                            <Td>
                                                {getDay(task.date)} <br />
                                                {task.date.toLocaleDateString()} <br />
                                                <Text fontSize='xs'>{decimalToTime(task.to.time + task.period01.time + task.period02.time + task.from.time)}</Text>
                                            </Td>
                                            <Td>{task.project} <br />
                                                {task.company} <br />
                                                {task.projectDescription}
                                            </Td>
                                            <Td><Text whiteSpace="initial" noOfLines={4}>{task.comment}</Text></Td>
                                            <Td>{timePeriod(task.to)}</Td>
                                            <Td>{timePeriod(task.period01)}</Td>
                                            <Td>{timePeriod(task.period02)}</Td>
                                            <Td>{timePeriod(task.from)}</Td>
                                        </Tr>
                                    )
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

const timePeriod = (period: TaskPeriod) => {
    if (!period.time) return;

    return (<>
        {(moment(period.start)).format('HH:mm')}
        &nbsp;-&nbsp;
        {(moment(period.end)).format('HH:mm')}
        <Text fontSize='xs'>{decimalToTime(period.time)}</Text>
    </>)
}

const getDay = (date: Date): string => {
    switch (date.getDay()) {
        case 0: return 'Zondag';
        case 1: return 'Maandag';
        case 2: return 'Dinsdag';
        case 3: return 'Woensdag';
        case 4: return 'Donderdag';
        case 5: return 'Vrijdag';
        case 6: return 'Zaterdag';
        default: return ''
    }
}

const decimalToTime = (time:number): string => {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    return `${hours}u${minutes > 0 ? minutes : ''}`
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

    new Date('2022/12/26'),
    new Date('2022/11/11'),
    new Date('2022/11/01'),
    new Date('2022/08/15'),
    new Date('2022/07/20'),
    new Date('2022/07/21'),
    new Date('2022/07/22'),
    new Date('2022/06/06'),
    new Date('2022/05/26'),
    new Date('2022/05/27'),
    new Date('2022/04/18'),
]
