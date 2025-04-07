import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { useEffect, useMemo, useState } from 'react';
import arrowUpDown from './../assets/arrowUpDown.svg';
import down from './../assets/down.svg';
import up from './../assets/up.svg';
import { useNavigate } from 'react-router-dom';

const Table = ({data, columns}: any) => {


    return (
        <div className="flex flex-col">
            
            {/* Table */}
            <div className="shadow overflow-auto">
                <table className="min-w-full shadow-md rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            {columns.map((h: any) => {
                                return (
                                    <th key={h.accessorKey}
                                        scope="col"
                                        className="cursor-pointer text-sm font-medium text-gray-900 px-4 py-4 text-left"
                                    >
                                        <b className='flex'>
                                            {h.header}
                                        </b>
                                    </th>

                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row: any, idx: number) => (
                            <tr key={idx} className="bg-white border-b">
                                {columns.map((h: any) => {
                                    return <td key={`${row.id}-${h.accessorKey}`} className="px-4 py-2  whitespace-nowrap text-sm font-medium text-gray-900">
                                        {h.cell(h.accessorKey ? row[h.accessorKey] : idx)}
                                    </td>
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;