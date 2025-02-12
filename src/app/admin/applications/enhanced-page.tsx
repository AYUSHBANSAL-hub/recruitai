// src/app/admin/applications/enhanced-page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

interface Application {
  id: string;
  candidate: {
    name: string;
    email: string;
  };
  matchScore: number;
  status: string;
  submittedAt: string;
  jobTitle: string;
}

const columnHelper = createColumnHelper<Application>();

export default function EnhancedApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const columns = [
    columnHelper.accessor('candidate.name', {
      header: 'Candidate Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('jobTitle', {
      header: 'Position',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('matchScore', {
      header: 'Match Score',
      cell: info => `${info.getValue()}%`,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span className={`px-2 py-1 rounded-full text-sm ${
          getStatusColor(info.getValue())
        }`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('submittedAt', {
      header: 'Submitted',
      cell: info => format(new Date(info.getValue()), 'MMM d, yyyy'),
    }),
  ];

  const table = useReactTable({
    data: applications,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Applications</h1>
        
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="Search applications..."
                className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Export Button */}
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Export to CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        {header.column.getIsSorted() && (
                          {
                            asc: <ChevronUp size={16} />,
                            desc: <ChevronDown size={16} />,
                          }[header.column.getIsSorted() as string]
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => window.location.href = `/admin/applications/${row.original.id}`}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

