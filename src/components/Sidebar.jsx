import React, {useState} from 'react'


const Sidebar = ({searchTerm, setSearchTerm, selectedRatings, setSelectedRatings}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleRatingChange = (rating) => {
        setSelectedRatings((prevRatings) =>
            prevRatings.includes(rating)
                ? prevRatings.filter((r) => r !== rating)
                : [...prevRatings, rating]
        );
    };
    return (
        <div className="sidebar">
            <input
                type="text"
                placeholder="Search"
                className="searchbar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="filters">
                <div className="dropdown">
                    <button onClick={toggleDropdown} className="dropdown-button">
                        Filter by Rating
                    </button>
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            {[0, 1, 2, 3, 4, 5].map((rating) => (
                                <label key={rating} className="dropdown-item">
                                    <input
                                        type="checkbox"
                                        value={rating}
                                        checked={selectedRatings.includes(rating)}
                                        onChange={() => handleRatingChange(rating)}
                                    />
                                    {rating} Stars
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Sidebar;