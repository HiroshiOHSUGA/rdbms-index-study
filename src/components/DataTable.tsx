import React from 'react';

interface DataTableProps {
  data: any[];
  title?: string;
}

export default function DataTable({ data, title }: DataTableProps) {
  if (!data || data.length === 0) {
    return <div>データがありません</div>;
  }

  const headers = Object.keys(data[0]);

  return (
    <div className="mb-4">
      {title && <h3 className="mb-2">{title}</h3>}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header) => (
                  <td
                    key={`${rowIndex}-${header}`}
                  >
                    {JSON.stringify(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 