export type InProgressReading = {book:string, startPage:number, startTime:number }
export type Reading = InProgressReading & {endTime:number, endPage:number}
