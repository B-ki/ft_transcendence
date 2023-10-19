import { isHtmlElement } from 'react-router-dom/dist/dom';

const headParams = [{ title: 'You' }, { title: 'Score' }, { title: 'Opponent' }];

export const Table = () => {
  return (
    <div className="flex flex-col rounded-md border">
      <div className="-m-1.5 overflow-x-auto">
        <div className="inline-block min-w-full p-1.5 align-middle">
          <div className="overflow-hidden">
            <table className="divide-gray-200 dark:divide-gray-700 min-w-full divide-y">
              <thead className="flex w-full flex-row">
                <tr>
                  {headParams.map((item) => (
                    <th
                      scope="col"
                      className="text-gray-500 px-6 py-3 text-left text-xs font-medium uppercase"
                    >
                      {item.title}
                    </th>
                  ))}
                </tr>
                {/* <th
                    scope="col"
                    className="text-gray-500 flex justify-center px-6 py-3 text-left text-xs font-medium uppercase"
                  >
                    You
                  </th>
                  <th
                    scope="col"
                    className="text-gray-500 px-6 py-3 text-left text-xs font-medium uppercase"
                  >
                    score
                  </th>
                  <th
                    scope="col"
                    className="text-gray-500 flex justify-center px-6 py-3 text-left text-xs font-medium uppercase"
                  >
                    opponent
                  </th> */}
              </thead>
              <tbody className="divide-gray-200 dark:divide-gray-700 divide-y">
                <tr>
                  <td className="text-gray-800 dark:text-gray-200 whitespace-nowrap px-6 py-4 text-sm font-medium">
                    John Brown
                  </td>
                  <td className="text-gray-800 dark:text-gray-200 flex justify-center whitespace-nowrap px-6 py-4 text-sm">
                    45
                  </td>
                  <td className="text-gray-800 dark:text-gray-200 whitespace-nowrap px-6 py-4 text-sm">
                    New York No. 1 Lake Park
                  </td>
                </tr>

                <tr>
                  <td className="text-gray-800 dark:text-gray-200 whitespace-nowrap px-6 py-4 text-sm font-medium">
                    Jim Green
                  </td>
                  <td className="text-gray-800 dark:text-gray-200 flex justify-center whitespace-nowrap px-6 py-4 text-sm">
                    27
                  </td>
                  <td className="text-gray-800 dark:text-gray-200 whitespace-nowrap px-6 py-4 text-sm">
                    London No. 1 Lake Park
                  </td>
                </tr>

                <tr>
                  <td className="text-gray-800 dark:text-gray-200 whitespace-nowrap px-6 py-4 text-sm font-medium">
                    Joe Black
                  </td>
                  <td className="text-gray-800 dark:text-gray-200 flex justify-center whitespace-nowrap px-6 py-4 text-sm">
                    31
                  </td>
                  <td className="text-gray-800 dark:text-gray-200 whitespace-nowrap px-6 py-4 text-sm">
                    Sidney No. 1 Lake Park
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
