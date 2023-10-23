import { isHtmlElement } from 'react-router-dom/dist/dom';

const headParams = [{ title: 'You' }, { title: 'Score' }, { title: 'Opponent' }];

const games = [
  { score: '5 - 3', opponent: 'rcarles' },
  { score: '2 - 5', opponent: 'ntige' },
  { score: '5 - 1', opponent: 'rcarles' },
];

export const Table = () => {
  return (
    <div className="rounded-md border p-5">
      <table className="border-collapse border-2 font-sans text-xs">
        <caption className="pb-10 text-center">Your Caption Text</caption>
        <thead>
          <tr>
            <th className="text-white-1" scope="col">
              Header 1
            </th>
            <th className="text-white-1" scope="col">
              Header 2
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="">
            <td className="border text-center">Data 1</td>
            <td className="border text-center">Data 2</td>
          </tr>
          <tr>
            <td className="border text-center">Data 3</td>
            <td className="border text-center">Data 4</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
