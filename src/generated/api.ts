import { BaseApiConfig, Context, SdkgenError } from "@sdkgen/node-runtime";

export interface ScheduleIntervals {
    start: string
    end: string
}

export interface Schedule {
    day: string
    intervals: ScheduleIntervals[]
}

export interface SelectInterval {
    from: string
    to: string
}

export class InvalidArgument extends SdkgenError {}

export class Fatal extends SdkgenError {}

export class ApiConfig<ExtraContextT> extends BaseApiConfig<ExtraContextT> {
    fn!: {
        createTime: (ctx: Context & ExtraContextT, args: {schedule: Schedule}) => Promise<Schedule>
        deleteTime: (ctx: Context & ExtraContextT, args: {schedule: Schedule}) => Promise<Schedule>
        listTime: (ctx: Context & ExtraContextT, args: {}) => Promise<Schedule[]>
        listTimeInterval: (ctx: Context & ExtraContextT, args: {interval: SelectInterval}) => Promise<Schedule[]>
    }

    err = {
        InvalidArgument(message: string = "") { throw new InvalidArgument(message); },
        Fatal(message: string = "") { throw new Fatal(message); }
    }

    astJson = {
        annotations: {
            "fn.createTime.schedule": [
                {
                    type: "description",
                    value: "teste"
                }
            ],
            "fn.createTime": [
                {
                    type: "description",
                    value: "Create a new time"
                },
                {
                    type: "rest",
                    value: {
                        bodyVariable: "schedule",
                        headers: [],
                        method: "POST",
                        path: "/create",
                        pathVariables: [],
                        queryVariables: []
                    }
                }
            ],
            "fn.deleteTime": [
                {
                    type: "rest",
                    value: {
                        bodyVariable: "schedule",
                        headers: [],
                        method: "DELETE",
                        path: "/delete",
                        pathVariables: [],
                        queryVariables: []
                    }
                }
            ],
            "fn.listTime": [
                {
                    type: "rest",
                    value: {
                        bodyVariable: null,
                        headers: [],
                        method: "GET",
                        path: "/list",
                        pathVariables: [],
                        queryVariables: []
                    }
                }
            ],
            "fn.listTimeInterval": [
                {
                    type: "rest",
                    value: {
                        bodyVariable: "interval",
                        headers: [],
                        method: "GET",
                        path: "/listIn",
                        pathVariables: [],
                        queryVariables: []
                    }
                }
            ]
        },
        errors: [
            "InvalidArgument",
            "Fatal"
        ],
        functionTable: {
            createTime: {
                args: {
                    schedule: "Schedule"
                },
                ret: "Schedule"
            },
            deleteTime: {
                args: {
                    schedule: "Schedule"
                },
                ret: "Schedule"
            },
            listTime: {
                args: {},
                ret: "Schedule[]"
            },
            listTimeInterval: {
                args: {
                    interval: "SelectInterval"
                },
                ret: "Schedule[]"
            }
        },
        typeTable: {
            ScheduleIntervals: {
                start: "string",
                end: "string"
            },
            Schedule: {
                day: "string",
                intervals: "ScheduleIntervals[]"
            },
            SelectInterval: {
                from: "string",
                to: "string"
            }
        }
    }
}

export const api = new ApiConfig<{}>();
