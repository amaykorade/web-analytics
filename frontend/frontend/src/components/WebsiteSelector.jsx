import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function WebsiteSelector({ websites, currentWebsite, onSelect }) {
  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center space-x-4">
        <select
          value={currentWebsite?.id}
          onChange={(e) => {
            const website = websites.find(w => w.id === e.target.value);
            if (website) onSelect(website);
          }}
          className="block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {websites.map((website) => (
            <option key={website.id} value={website.id}>
              {website.name}
            </option>
          ))}
        </select>

        <Link
          to="/websites/new"
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Website
        </Link>
      </div>
    </div>
  );
}