import { Box, Text } from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { Calendar, momentLocalizer, type Event } from 'react-big-calendar';
import { type Task, type TaskPeriod } from "~/utils/tasks";

export type EventTaskTableProps = {
    tasks: Task[]
}

const MyEvent = ({ event }: { event: Event }) => {
    const e = event as (Event & { comment: string });
    return (
        <Box>
            <Text as="strong">{e.title}</Text>
            <Text>{e.comment}</Text>
        </Box>
    )
}
MyEvent.propTypes = {}

export const EventTaskTable = ({ tasks }: EventTaskTableProps) => {
    const startDate = React.useMemo(() => {
        const date = new Date()
        date.setHours(7);
        date.setMinutes(0);
        return date;
    }, []);

    type PeriodKeys = {
        [K in keyof Task]: Task[K] extends TaskPeriod ? K : never;
    }[keyof Task];

    const events = React.useMemo(() => {
        const convert = (task: Task, period: PeriodKeys): Event & { id: string, type: string, comment: string } | undefined => {
            return (task[period].time > 0) ? {
                id: task.id,
                title: task.company,
                comment: task.comment,
                start: task[period].start,
                end: task[period].end,
                type: period,
                resource: {}
            } : undefined;
        };

        const events: Array<Event & { id: string, type: string }> = []
        tasks.forEach((task) => {
            const periods: Array<PeriodKeys> = ['to', 'period01', 'period02', 'from'];
            periods.forEach(period => {
                const e = convert(task, period);
                if (e) events.push(e);
            })
        });
        return events;
    }, [tasks])

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const localizer = momentLocalizer(moment) // or globalizeLocalizer
    moment.locale('en-us', {
        week: {
            dow: 1,
            doy: 1,
        },
    });

    return (

        <Calendar
            components={{
                event: MyEvent
            }}
            defaultDate={startDate}
            localizer={localizer}
            events={events}
            step={60}
            timeslots={1}
            views={["week", "month"]}
            defaultView="week"
            style={{ height: 'calc(100vh - 110px)' }}
            scrollToTime={startDate}
            eventPropGetter={eventStyleGetter}
            dayPropGetter={(date: Date) => {
                if ((date.getDate() === startDate.getDate())
                    && (date.getMonth() === startDate.getMonth())
                    && (date.getFullYear() === startDate.getFullYear()))
                    return {
                        style: {
                            background: '#FF44'
                        }
                    }
                return {}
            }}
            dayLayoutAlgorithm={(params) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
                const overlap = require('react-big-calendar/lib/utils/layout-algorithms/overlap').default;

                // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
                return overlap({ ...params, minimumStartDifference: 15 })
            }}
        />

    )
}

const eventStyleGetter = (event: Event & { type?: string }, _start: Date, _end: Date, _isSelected: boolean) => {
    let backgroundColor = 'blue';
    switch (event.type) {
        case 'to':
        case 'from':
            backgroundColor = 'lightgray';
            break;
        default:
            return {}
    }

    const style = {
        backgroundColor: backgroundColor,
        borderRadius: '2px',
        'min-height': '1px',
        border: 0,
        // opacity: 0.8,
        // color: 'black',
        // border: '0px',
        // display: 'block'
    };
    return { style };
}