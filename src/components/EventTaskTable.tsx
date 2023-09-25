import moment from "moment";
import React from "react";
import { Calendar, momentLocalizer, type Event } from 'react-big-calendar';
import { type Task } from "~/utils/tasks";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
const overlap = require('react-big-calendar/lib/utils/layout-algorithms/overlap').default;

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
    // const [events, setEvents] = React.useState<Event[]>([]);

    console.log("here");

    const events = React.useMemo(() => {

        console.log("here memo");

        const _e: Array<Event & { id: string, type: string }> = []
        tasks.forEach((task) => {
            if (task.to.time > 0) {
                _e.push({
                    id: task.id,
                    title: task.company,
                    start: task.to.start,
                    end: task.to.end,
                    type: 'to',
                    resource: {}
                })

            }
            if (task.period01.time > 0) {
                _e.push({
                    id: task.id,
                    title: task.company,
                    start: task.period01.start,
                    end: task.period01.end,
                    type: 'period01',
                    resource: {}
                })

            }
            if (task.period02.time > 0) {
                _e.push({
                    id: task.id,
                    title: task.company,
                    start: task.period02.start,
                    end: task.period02.end,
                    type: 'period02',
                    resource: {}
                })

            }
            if (task.from.time > 0) {
                _e.push({
                    id: task.id,
                    title: task.company,
                    start: task.from.start,
                    end: task.from.end,
                    type: 'from',
                    resource: {}
                })

            }
        });
        return _e;
    }, [tasks])

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const localizer = momentLocalizer(moment) // or globalizeLocalizer
    moment.locale('en-us', {
        week: {
            dow: 1,
            doy: 1,
        },
    });

    console.log(events);

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
                style={{ height: 'calc(100vh - 50px)' }}
                scrollToTime={startDate}
                eventPropGetter={eventStyleGetter}
                dayLayoutAlgorithm={(params) => {
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