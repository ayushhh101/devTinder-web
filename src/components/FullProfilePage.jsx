import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import { useSelector } from 'react-redux';

const TABS = ["About", "Skills", "Projects", "Experience"];

const FullProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const currentUserId = useSelector(store => store.user?._id);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/user/${userId}`, { withCredentials: true });
        setProfile(res.data);
      } catch (err) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleRequest = async (userId) => {
    try {
      await axios.post(`${BASE_URL}/request/send/interested/${userId}`, {}, { withCredentials: true });
      // You can show a notification here if you'd like!
    } catch (error) { }
  }

  if (loading)
    return <div className="h-screen flex items-center justify-center text-[#1790a7]">Loading profile...</div>;
  if (!profile)
    return <div className="h-screen flex items-center justify-center text-[#fc787a]">User Not Found</div>;

  const {
    firstName, lastName, photoUrl, age, gender, headline,
    currentPosition, location, about, skills = [],
    githubUrl, linkedinUrl, bannerUrl, projects = [], experience = []
  } = profile;

  const bannerImg = bannerUrl || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";


  const completionCriteria = [
    Boolean(photoUrl && photoUrl.trim() !== ""),
    Boolean(about && about.trim().length > 30),
    Boolean(headline && headline.trim() !== ""),
    Boolean(currentPosition && currentPosition.trim() !== ""),
    Boolean(location && location.trim() !== ""),
    Boolean(skills && skills.length > 0),
    Boolean(projects && projects.length > 0),
    Boolean(githubUrl && githubUrl.trim().length > 10),
    Boolean(linkedinUrl && linkedinUrl.trim().length > 10),
  ];

  const completed = completionCriteria.filter(Boolean).length;
  const completionPercent = Math.round((completed / completionCriteria.length) * 100);

  return (
    <div className="min-h-screen bg-[#f6fbff] py-10 px-2">
      <div className="relative max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-[#e4e7ee] overflow-hidden">
        {/* App Bar / Banner */}
        <div className="relative w-full">
          <div className="h-28 sm:h-40 bg-[#e4e7ee] w-full">
            <img
              src={bannerImg}
              alt="Profile banner"
              className="w-full h-full object-cover"
            />
          </div>
          {/* App name left, Connect right */}
          <div className="absolute flex justify-between items-center w-full px-6 top-6 left-0">
            <span className="text-xl font-bold lowercase text-[#1790a7] tracking-tight">linkspark</span>
            <button
              className="px-6 py-1.5 bg-[#fc787a] hover:bg-[#ff6767] text-white font-semibold rounded-full shadow transition"
              onClick={() => handleRequest(userId)}
            >
              Connect
            </button>
          </div>
          {/* Profile photo */}
          <div className="absolute left-1/2 -bottom-12 -translate-x-1/2 flex justify-center w-full">
            <div className="w-28 h-28 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden">
              <img src={photoUrl} alt={`${firstName} ${lastName} avatar`} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Profile Main Card */}
        <div className="pt-16 pb-6 px-7">
          <h1 className="text-3xl font-bold text-[#183850] text-center">{firstName} {lastName}</h1>
          <div className="text-base text-[#555c6c] text-center mt-2">{headline}</div>
          <div className="text-base text-[#9098ad] text-center mb-2">{currentPosition}</div>
          <div className="flex flex-wrap gap-4 justify-center mt-1 mb-4">
            {location && <span className="text-sm text-[#7cc0d1] flex items-center gap-1"><i className="ri-map-pin-2-fill" />{location}</span>}
            {age && <span className="text-sm text-[#89a6b2] flex items-center gap-1"><i className="ri-user-3-fill" />{age}</span>}
            {gender && <span className="text-sm text-[#e08eac] flex items-center gap-1"><i className="ri-user-heart-fill" />{gender}</span>}
          </div>
          <div className="flex gap-4 mt-2 justify-center">
            {githubUrl &&
              <a href={githubUrl} target="_blank" rel="noopener noreferrer"
                aria-label="GitHub profile" className="text-[#555c6c] hover:text-[#1790a7] text-2xl transition">
                <i className="ri-github-fill"></i>
              </a>
            }
            {linkedinUrl &&
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer"
                aria-label="LinkedIn profile" className="text-[#0077b5] hover:text-[#1790a7] text-2xl transition">
                <i className="ri-linkedin-box-fill"></i>
              </a>
            }
          </div>
        </div>
        {/* Profile Completion Progress Bar */}
        {currentUserId === userId && (
          <div className="mx-auto w-[90%] mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#1790a7] tracking-wide uppercase">
                Profile Completion
              </span>
              <span className="text-xs font-medium text-[#fc787a]">
                {completionPercent}%
              </span>
            </div>
            <div className="w-full h-3 bg-[#e4e7ee] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0099CC] rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-[#e4e7ee] px-7 flex justify-between gap-8 ml-10 mr-10">
          {TABS.map((tab, idx) => (
            <button
              key={tab}
              className={`py-3 font-semibold text-[16px] transition-all relative
                ${activeTab === idx
                  ? "text-[#183850] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-1 after:bg-[#1790a7] after:rounded-full after:w-full after:mx-auto"
                  : "text-gray-400 hover:text-[#1790a7]"
                }`}
              style={{ minWidth: 60 }}
              onClick={() => setActiveTab(idx)}
            >
              {tab}
            </button>
          ))}
        </div>


        {/* Tab Contents */}
        <div className="px-7 pt-6 pb-3 min-h-[180px] ml-10 ">
          {/* ABOUT */}
          {activeTab === 0 && (
            <>
              <h2 className="text-lg font-semibold text-[#183850] mb-2">About</h2>
              <p className="text-base text-[#313944]">{about}</p>
            </>
          )}

          {/* SKILLS */}
          {activeTab === 1 && !!skills.length && (
            <>
              <h2 className="text-lg font-semibold text-[#183850] mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span key={i} className="bg-[#e4f2f6] uppercase text-[#1790a7] px-3 py-1 rounded-full text-sm font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* PROJECTS */}
          {activeTab === 2 && !!projects.length && (
            <>
              <h2 className="text-lg font-semibold text-[#183850] mb-2">Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects
                  .filter(
                    (proj) =>
                      (proj.title && proj.title.trim() !== "") ||
                      (proj.description && proj.description.trim() !== "") ||
                      (proj.link && proj.link.trim() !== "")
                  )
                  .map((proj, idx) => (
                    <div
                      key={proj._id || idx}
                      className="bg-[#f7fafd] border border-[#e4e7ee] rounded-lg shadow-sm p-4"
                    >
                      {proj.title && (
                        <div className="font-semibold text-[#183850] mb-1">{proj.title}</div>
                      )}
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1790a7] underline text-sm block mb-1"
                        >
                          {proj.link}
                        </a>
                      )}
                      {proj.description && (
                        <div className="text-gray-600 text-sm mt-1">{proj.description}</div>
                      )}
                    </div>
                  ))}
              </div>
            </>
          )}

          {/* EXPERIENCE */}
          {activeTab === 3 && !!experience.length && (
            <>
              <h2 className="text-lg font-semibold text-[#183850] mb-2">Experience</h2>
              <div className="flex flex-col gap-4">
                {experience.map((exp, i) => (
                  <div key={i} className="bg-[#f7fafd] border border-[#e4e7ee] rounded-lg p-3">
                    <div className="font-semibold text-[#183850]">{exp.role} @ {exp.company}</div>
                    <div className="text-gray-600 text-sm">{exp.duration}</div>
                    <div className="text-gray-700 text-sm">{exp.description}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* If no data for tab, show empty state */}
          {(activeTab === 0 && !skills.length) ||
            (activeTab === 1 && !skills.length) ||
            (activeTab === 2 && !projects.length) ||
            (activeTab === 3 && !experience.length) ? (
            <div className="text-gray-400 text-center mt-8">
              No information available for this section.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default FullProfilePage;
