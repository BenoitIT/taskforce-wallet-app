"use client";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableProps } from "@/interfaces/table-props";
const BaseTable = <T extends Record<string, string | number>>({
  headers,
  data,
  action,
}: TableProps<T>) => {
  return (
    <Table className="bg-white shadow rounded w-full  overflow-x-auto">
      <TableHeader>
        <TableRow className="bg-gray-50 text-gray-900">
          <TableHead
            className={`font-semibold text-xs md:text-sm p-2`}
          >
            #
          </TableHead>
          {headers.map((header, index) => (
            <TableHead
              key={index}
              className={`font-medium text-xs whitespace-nowrap md:text-sm
              p-2 w-fit`}
            >
              {header.header}
            </TableHead>
          ))}
          {action ? (
            <TableHead
              className={`font-medium  text-xs whitespace-nowrap $md:text-sm p-2"`}
            >
              Action
            </TableHead>
          ) : (
            ""
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.length > 0 ? (
          data.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="text-gray-700">
              <TableCell
                className={`text-xs md:text-sm  text-gray-700 p-3`}
              >
                {rowIndex + 1}
              </TableCell>
              {headers.map((header, colIndex) => (
                <TableCell
                  key={colIndex}
                  className={`text-xs  p-3 `}
                >
                  {row[header.field] as string | number}
                </TableCell>
              ))}
              <TableCell
                className={
                  action
                    ? `text-sm`
                    : "hidden p-3"
                }
              >
                <div className={`flex w-fit gap-2 ml-2`}>
                  {action
                    ? action.map((action, index) => (
                        <Label
                          key={index}
                          className={
                            action.name == "delete"
                              ? "text-red-400 hover:cursor-pointer"
                              : `cursor-pointer`
                          }
                          title={action?.name}
                          onClick={() => action.Click(row.id as number)}
                        >
                          {action.icon}
                        </Label>
                      ))
                    : ""}
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={Array.from(Object.keys(headers)).length}
              className="p-3"
            >
              <div
                className={`rounded w-full h-[40px] flex justify-center items-center capitalize text-black`}
              >
                no record found
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
export default BaseTable;
