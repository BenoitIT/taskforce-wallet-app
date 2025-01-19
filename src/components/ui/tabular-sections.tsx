import { TableProps } from "@/interfaces/table-props";
import BaseTable from "./base-table";
const TabularSection = (Component: React.FC) => {
  const modifiedSection = <T extends Record<string, string | number>>(
    props: TableProps<T>
  ) => {
    const { headers, action, data } = props;
    return (
      <div className="max-w-full overflow-x-auto">
        <Component />
        <BaseTable headers={headers} data={data} action={action} />
      </div>
    );
  };
  return modifiedSection;
};
export default TabularSection;
