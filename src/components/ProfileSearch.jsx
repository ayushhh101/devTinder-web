import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserCard from './UserCard'; 
import { BASE_URL } from '../utils/constants';

const ProfileSearch = () => {
  const [filters, setFilters] = useState({
    skills: '',
    location: '',
    name: '',
    headline: '',
    currentPosition: '',
  });
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProfiles = async (pageNum = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        ...filters,
        page: pageNum,
        limit: 10,
      };
      const res = await axios.get(`${BASE_URL}/user/search`, { params, withCredentials: true });
      setResults(res.data.results);
      setTotalPages(res.data.pages);
      setPage(res.data.page);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles(1);
  }, []); // load initially

  const handleInputChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = () => {
    fetchProfiles(1);
  };

  return (
   <div className="min-h-screen w-full px-2 pt-8 pb-12 bg-gradient-to-tr from-indigo-50 from-40% via-purple-50 to-blue-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-extrabold text-indigo-800 mb-4 text-center">Find Professionals</h2>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 bg-white/70 p-5 rounded-2xl border border-indigo-200 shadow">
          <input
            name="name"
            placeholder="Name"
            value={filters.name}
            onChange={handleInputChange}
            className="px-4 py-2 rounded-md border border-indigo-200 shadow focus:outline-indigo-300"
          />
          <input
            name="skills"
            placeholder="Skills (comma separated)"
            value={filters.skills}
            onChange={handleInputChange}
            className="px-4 py-2 rounded-md border border-indigo-200 shadow focus:outline-indigo-300"
          />
          <input
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleInputChange}
            className="px-4 py-2 rounded-md border border-indigo-200 shadow focus:outline-indigo-300"
          />
          <input
            name="headline"
            placeholder="Headline"
            value={filters.headline}
            onChange={handleInputChange}
            className="px-4 py-2 rounded-md border border-indigo-200 shadow focus:outline-indigo-300"
          />
          <input
            name="currentPosition"
            placeholder="Position"
            value={filters.currentPosition}
            onChange={handleInputChange}
            className="px-4 py-2 rounded-md border border-indigo-200 shadow focus:outline-indigo-300"
          />
          <button
            onClick={handleSearch}
            className="col-span-1 md:col-span-3 mt-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-400 text-white font-bold py-2 rounded-md shadow transition hover:shadow-lg hover:from-indigo-700"
          >Search</button>
        </div>
        {/* Message */}
        {loading && <p className="text-center text-lg text-indigo-600 mt-10">Loading...</p>}
        {error && <p className="text-center text-base text-red-500 mb-4">{error}</p>}
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
          {results.length === 0 && !loading ?
            <p className="col-span-full text-center text-lg text-slate-500">No profiles found</p> :
            results.map(user => (
              <UserCard key={user._id} user={user} showActions={false} />
            ))
          }
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-4">
            <button disabled={page <= 1}
              onClick={() => fetchProfiles(page - 1)}
              className={`px-4 py-2 rounded-lg bg-gray-100 font-medium text-sm ${page <= 1 ? "opacity-40" : "hover:bg-indigo-100 hover:text-indigo-700"} transition`}>Prev</button>
            <span className="text-indigo-700 font-bold text-lg">Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages}
              onClick={() => fetchProfiles(page + 1)}
              className={`px-4 py-2 rounded-lg bg-gray-100 font-medium text-sm ${page >= totalPages ? "opacity-40" : "hover:bg-indigo-100 hover:text-indigo-700"} transition`}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSearch;
