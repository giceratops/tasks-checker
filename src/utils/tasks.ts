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
            tasks.push({
                id: row.getCell(idx++).value as string,
                name: row.getCell(idx++).value as string,
                date: new Date(row.getCell(idx++).value as string),
                company: row.getCell(idx++).value as string,
                project: row.getCell(idx++).value as string,
                projectDescription: row.getCell(idx++).value as string,
                comment: row.getCell(idx++).value as string,
                to: {
                    start: row.getCell(idx++).value as string,
                    end: row.getCell(idx++).value as string,
                    time: row.getCell(idx++).value as number,
                },
                period01: {
                    start: row.getCell(idx++).value as string,
                    end: row.getCell(idx++).value as string,
                    time: row.getCell(idx++).value as number,
                },
                period02: {
                    start: row.getCell(idx++).value as string,
                    end: row.getCell(idx++).value as string,
                    time: row.getCell(idx++).value as number,
                },
                from: {
                    start: row.getCell(idx++).value as string,
                    end: row.getCell(idx++).value as string,
                    time: row.getCell(idx++).value as number,
                },
                overtime: row.getCell(idx++).value as boolean,
                driver: row.getCell(idx++).value as boolean,
                km_to: row.getCell(idx++).value as number,
                km_from: row.getCell(idx++).value as number,
            })
        }
    })

    return tasks;
}