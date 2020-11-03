import { api, Schedule } from "../generated/api";
import fs from "fs";
import moment from "moment";
import totalDays from "../util/totalDays";

const getSchedule = () => {
   const data = fs.readFileSync("./src/data/index.json");
   const newData = JSON.parse(data.toString());
   return newData;
};

api.fn.listTime = async (): Promise<Schedule[]> => {
   const response = getSchedule();
   return response;
};

api.fn.createTime = async (ctx, { schedule }): Promise<Schedule> => {
   const { day, intervals } = schedule;
   const data = getSchedule();
   const newSchedule = {
      day,
      intervals,
   };
   data.push(newSchedule);

   fs.writeFile(
      "./src/data/index.json",
      JSON.stringify(data, null, " "),
      (err) => {
         if (err) {
            return false;
         }
      }
   );
   return newSchedule;
};

api.fn.deleteTime = async (ctx, { schedule }): Promise<Schedule> => {
   const { day, intervals } = schedule;

   const data = getSchedule();

   const index = data.findIndex(
      (s: Schedule) =>
         s.day === day &&
         JSON.stringify(s.intervals) === JSON.stringify(intervals)
   );

   data.splice(index, 1);

   fs.writeFile(
      "./src/data/index.json",
      JSON.stringify(data, null, " "),
      (err) => {
         if (err) {
            return false;
         }
      }
   );

   return schedule;
};

api.fn.listTimeInterval = async (ctx, { interval }): Promise<Schedule[]> => {
   const { from, to } = interval;

   const start = moment(from, "DD-MM-YYYY");
   const end = moment(to, "DD-MM-YYYY");

   if (!start.isValid() || !start.isValid() || start > end) {
      throw api.err.InvalidArgument;
   }

   function filterData(schedule: Schedule) {
      if (
         typeof schedule.day === "string" &&
         (schedule.day === "everyday" ||
            (totalDays(schedule.day) >= totalDays(from) &&
               totalDays(schedule.day) <= totalDays(to)))
      ) {
         console.log("opa");
         return true;
      }
      return false;
   }

   const data = getSchedule();

   const response = data.filter(filterData);
   console.log(response);

   const index = response.findIndex(
      (schedule: Schedule) => schedule.day === "everyday"
   );

   if (index >= 0) {
      const loop = moment(start);
      while (loop <= end) {
         response.push({
            day: loop.format("DD-MM-YYYY"),
            intervals: response[index].intervals,
         });
         loop.add(1, "days");
      }
      response.splice(index, 1);
   }

   if (!response.length) {
      throw api.err.InvalidArgument();
   }

   return response;
};
