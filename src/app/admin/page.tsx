'use client';

import BackButton from '@/components/BackButton';

export default function AdminPanelPage() {
  return (
    <div className="space-y-4">
      <BackButton />
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <p className="text-gray-500 dark:text-gray-400">CRUD for zones and responders coming soon.</p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded">Export Report</button>
    </div>
  );
}