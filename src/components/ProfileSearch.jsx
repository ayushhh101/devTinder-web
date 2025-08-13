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
        limit: 9,
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
    <div className="min-h-screen w-full bg-bg py-10 px-4 font-alibaba">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-[32px] md:text-[48px] font-bold text-textPrimary mb-8 text-center">
          Find Developers & Professionals
        </h2>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-lightGray p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="name"
              placeholder="Name"
              value={filters.name}
              onChange={handleInputChange}
              className="px-4 py-2 rounded-[12px] border border-gray-300 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primar text-body text-[16px]"
            />
            <input
              name="skills"
              placeholder="Skills (comma separated)"
              value={filters.skills}
              onChange={handleInputChange}
              className="px-4 py-2 rounded-[12px] border border-gray-300 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primar text-body text-[16px]"
            />
            <input
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleInputChange}
              className="px-4 py-2 rounded-[12px] border border-gray-300 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primar text-body text-[16px]"
            />
            <input
              name="headline"
              placeholder="Headline"
              value={filters.headline}
              onChange={handleInputChange}
              className="px-4 py-2 rounded-[12px] border border-gray-300 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primar text-body text-[16px]"
            />
            <input
              name="currentPosition"
              placeholder="Position"
              value={filters.currentPosition}
              onChange={handleInputChange}
              className="px-4 py-2 rounded-[12px] border border-gray-300 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primar text-body text-[16px]"
            />
            <button
              onClick={handleSearch}
              className="col-span-1 md:col-span-3 mt-2 py-2 rounded-[12px] bg-primary text-white font-semibold shadow hover:bg-[#007ea8] transition-all"
            >
              Search
            </button>
          </div>
        </div>

        {/* Message */}
        {loading && <p className="text-center text-lg text-[#0099CC] mt-10">Loading...</p>}
        {error && <p className="text-center text-base text-red-500 mb-4">{error}</p>}

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
          {results.length === 0 && !loading ? (
            <p className="col-span-full text-center text-lg text-gray-500">
              No profiles found
            </p>
          ) : (
            results.map(user => (
              <UserCard key={user._id} user={user} showActions={true} variant="search"/>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-4">
            <button
              disabled={page <= 1}
              onClick={() => fetchProfiles(page - 1)}
              className={`px-4 py-2 rounded-lg font-medium text-sm border border-gray-300 bg-white ${page <= 1
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-gray-100 hover:text-[#0099CC] transition"
                }`}
            >
              Prev
            </button>
            <span className="text-[#0099CC] font-bold text-lg">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => fetchProfiles(page + 1)}
              className={`px-4 py-2 rounded-lg font-medium text-sm border border-gray-300 bg-white ${page >= totalPages
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-gray-100 hover:text-[#0099CC] transition"
                }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSearch;
