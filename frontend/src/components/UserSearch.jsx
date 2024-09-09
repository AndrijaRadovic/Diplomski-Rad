import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import UserCard from "./UserCard";
import { apiService } from "./ApiService";
import '../styles/UserSearch.css';
import { Toaster, toast } from "react-hot-toast";

const UserSearch = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 6;

    // Funkcija za dobavljanje korisnika
    const fetchUsers = async (query = "") => {
        try {
            // console.log(query);
            const result = query
                ? await apiService.findUsers(query)
                : await apiService.getAllUsers();
            setUsers(result);
        } catch (error) {
            console.error("Error fetching users: ", error);
            toast.error("Greška prilikom pretrage");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = async () => {
        fetchUsers(searchQuery);
    };

    // Paginated korisnici
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // Paginated dugmići
    const totalPages = Math.ceil(users.length / usersPerPage);

    return (
        <>
            <div className="user-search-container">
                <Navbar />
                <Toaster />
                <div className="search-cards-containter">
                    <div className="search-section">
                        <input
                            type="text"
                            placeholder="Pretraži zaposlene"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="user-search-input"
                        />
                        <button onClick={handleSearch} className="user-search-button">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
                                <path d="M10 2a8 8 0 105.31 14.309l4.707 4.708 1.414-1.414-4.708-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z" />
                            </svg>
                        </button>
                    </div>
                    <div className="user-cards-container">
                        {currentUsers.map((user) => (
                            <UserCard key={user.sifraKorisnika} user={user} />
                        ))}
                    </div>
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                className={`pagination-button ${index + 1 === currentPage ? 'active' : ''}`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserSearch;
