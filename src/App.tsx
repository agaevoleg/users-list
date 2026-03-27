import { useEffect, useState } from "react";
import { Pagination } from './components/pagination';
import type { UsersData, User } from './types';

import "./App.css";

function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export default function App() {
  const limit = 30;

  const [query, setQuery] = useState({ page: 1, search: ''});
  const [total, setTotal] = useState(0);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const changePage = (page: number) => {
    setQuery((prev) => ({
      ...prev,
      page,
    }));
  }

  const changeSearch = (value: string) => {
    setQuery({
      search: value,
      page: 1,
    });
  }

  const debouncedSearch = useDebounce(query.search, 400);

  useEffect(() => {
    if (query.search !== debouncedSearch) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://dummyjson.com/users/search?q=${debouncedSearch}&limit=${limit}&skip=${(query.page - 1) * limit}`
        );

        if (!res.ok) throw new Error("Loading error");

        const data: UsersData = await res.json();

        setTotal(data.total);
        setUsers(data.users);
      } catch (error) {
        console.error(error)
        setError('Loading error');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [query.page, debouncedSearch]);

  return (
    <div className="container">
      <h1 className="title">Users</h1>

      <input
        className="search"
        placeholder="Search..."
        value={query.search}
        onChange={(e) => changeSearch(e.target.value)}
      />

      {loading && <p>Loading...</p>}
      {users.length === 0 && !loading && <p>No users found</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <Pagination 
            length={Math.ceil(total / limit)}
            page={query.page}
            onChange={changePage}
          />

          <div className="flex">
            {users.map((user) => (
              <div key={user.id} className="card">
                <img src={user.image} alt="" className="avatar" />
                <div className="maininfo">
                  <div className="name">
                    <img className="gender" src={`/${user.gender}.png`} />
                    {user.firstName} {user.lastName} {user.maidenName && `(${user.maidenName})`}
                  </div>
                  <div className="username">
                    @{user.username}
                  </div>

                </div>
                <div className="additional-info">
                  <div className="phone">
                    <a href={`tel:${user.phone}`}>
                      {user.phone}
                    </a>
                  </div>
                  <div className="email">
                    <a href={`mailto:${user.email}`}>
                      {user.email}
                    </a>
                  </div>
                </div>
                <div className="additional-info">
                  <div className="bday">
                    <img src='/bday.png' />
                    <span>
                      {new Date(user.birthDate).toLocaleDateString()} ({user.age} y.o)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination 
            length={Math.ceil(total / limit)}
            page={query.page}
            onChange={changePage}
          />
        </>
      )}
    </div>
  );
}