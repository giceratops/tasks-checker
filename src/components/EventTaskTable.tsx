import moment from "moment";
import React from "react";
import { Calendar, momentLocalizer, type Event } from 'react-big-calendar';
import { type Task, type TaskPeriod } from "~/utils/tasks";

export type EventTaskTableProps = {
    tasks: Task[]
}

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
        const convert = (task: Task, period: PeriodKeys): Event & { id: string, type: string } | undefined => {
            return (task[period].time > 0) ? {
                id: task.id,
                title: task.company,
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
        <>
            <Calendar
                defaultDate={startDate}
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                step={60}
                timeslots={1}
                views={["week", "month"]}
                defaultView="week"
                style={{ height: 'calc(100vh - 110px)' }}
                scrollToTime={startDate}
                eventPropGetter={eventStyleGetter}
                dayLayoutAlgorithm={(params) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
                    const overlap = require('react-big-calendar/lib/utils/layout-algorithms/overlap').default;

                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
                    return overlap({ ...params, minimumStartDifference: 15 })
                }}
            />
        </>
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