import type { Row, Workbook } from 'exceljs';

export type Task = {
    id: string
    name: string
    date: Date
    company: string
    project: string
    projectDescription: string
    comment: string
    to: TaskPeriod
    period01: TaskPeriod
    period02: TaskPeriod
    from: TaskPeriod
    overtime: boolean
    driver: boolean
    km_to: number
    km_from: number
}

export type TaskPeriod = {
    start: Date
    end: Date
    time: number
}

export const loadTasks = (workbook: Workbook): Task[] => {
    const tasks = new Array<Task>();
    const sheet = workbook.worksheets[0];
    sheet?.eachRow((row: Row) => {
        if (row.number > 1) {
            let idx = 1;
            const task = {
                id: row.getCell(idx++).value as string,
                name: row.getCell(idx++).value as string,
                date: new Date(row.getCell(idx++).value as string),
                company: row.getCell(idx++).value as string,
                project: row.getCell(idx++).value as string,
                projectDescription: row.getCell(idx++).value as string,
                comment: row.getCell(idx++).value as string,
                to: {
                    start: row.getCell(idx++).value as Date,
                    end: row.getCell(idx++).value as Date,
                    time: row.getCell(idx++).value as number,
                },
                period01: {
                    start: row.getCell(idx++).value as Date,
                    end: row.getCell(idx++).value as Date,
                    time: row.getCell(idx++).value as number,
                },
                period02: {
                    start: row.getCell(idx++).value as Date,
                    end: row.getCell(idx++).value as Date,
                    time: row.getCell(idx++).value as number,
                },
                from: {
                    start: row.getCell(idx++).value as Date,
                    end: row.getCell(idx++).value as Date,
                    time: row.getCell(idx++).value as number,
                },
                overtime: row.getCell(idx++).value as boolean,
                driver: row.getCell(idx++).value as boolean,
                km_to: row.getCell(idx++).value as number,
                km_from: row.getCell(idx++).value as number,
            }

            copyDateTime(task.date, task.to.start);
            copyDateTime(task.date, task.to.end);
            copyDateTime(task.date, task.period01.start);
            copyDateTime(task.date, task.period01.end);
            copyDateTime(task.date, task.period02.start);
            copyDateTime(task.date, task.period02.end);
            copyDateTime(task.date, task.from.start);
            copyDateTime(task.date, task.from.end);
            
            tasks.push(task)
        }
    })

    return tasks;
}

const copyDateTime = (from: Date, to: Date) => {
    if (!from) return;
    if (!to) return;

    to.setHours(to.getHours() - 1)
    to.setFullYear(from.getFullYear());
    to.setMonth(from.getMonth());
    to.setDate(from.getDate());
    return to;
}