import { useEffect, useState } from 'react'
import '../css/FilterBar.css'
import { blogsearch, filterBlogs, fetchblogs } from "../API/endpoint";

// const FilterBar = ({onsearch}) => {
  const FilterBar = ({ allblogs, onSearch }) => {

  const [selectedtitle, setSelectedTitle] = useState('All');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleTitleChange = (event) => {
    setSelectedTitle(event.target.value);
  };

  useEffect(() => {
    handleFilter()
  }, [selectedtitle, selectedDate])


    const handleTypeSearch = async () => {
      const keyword = searchKeyword.trim();
      try {
        let response;
        if (keyword === '') {
          response = await fetchblogs();
        } else {
          response = await blogsearch(keyword);
        }
        onSearch(response.data);
      } catch (error) {
        console.error("Error fetching filtered blogs:", error);
      }
    };

    const handleFilter = async () => {
      let result;
      if (selectedtitle === 'All') {
        const res = await fetchblogs()
        result = res.data
      }
      else {
        const filteredBlogs = allblogs.filter((blog) => {
          const titleMatch = blog.title.toLowerCase().includes(selectedtitle.toLowerCase());
          const dateMatch = selectedDate ? blog.date.substring(0, 10) === selectedDate : true;
          return titleMatch && dateMatch;
        });
        result = filteredBlogs
      }
      onSearch(result)
    };

  return (
    <div className="bottom-section">
      <div className="bottom-section-left">
        <h4 style={{ fontSize: '20px', textAlign: 'end' }}>Filter</h4>
      </div>
      <div className="bottom-section-middle">
        <div className="middle-first">
          <h5 className="bsm-fs">Blog Title</h5>
          <div className="created-list">
            <select name="" className="select-box-first" value={selectedtitle} onChange={handleTitleChange}>
              <option value="All" >All</option>
              {allblogs && allblogs.map((blog, _id) => (
                <option key={_id} value={blog.title}>{blog.title}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="middle-second">
          <h5 className="bsm-fs">Published Date</h5>
          <div className="date-selection">
            <input type="date"
              value={selectedDate}
              onChange={handleDateChange} className="select-box-second" />
          </div>
        </div>
      </div>
      <div className="bottom-section-right">
        <h5 className="bsm-fs">Search</h5>
        <div className="search">
          <input
            type="text"
            name="search"
            className="search-bar"
            placeholder="  Type Here"
            value={searchKeyword}
            onChange={handleSearchChange}
          />
          <div className="div" onClick={handleTypeSearch} style={{ cursor: "pointer" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={18}
              fill="currentColor"
              className="bi bi-search search-icon"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterBar;