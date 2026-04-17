import type { User } from "../types";
import "./FilterBar.css";

export type SortOption = "default" | "length-asc" | "length-desc" | "danger-asc" | "danger-desc";

interface FilterBarProps {
  users: User[];
  selectedUserId: number | null;
  onUserChange: (userId: number | null) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function FilterBar({
  users,
  selectedUserId,
  onUserChange,
  sortOption,
  onSortChange,
  searchQuery,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="user-filter">Filter by User:</label>
        <select
          id="user-filter"
          value={selectedUserId ?? ""}
          onChange={(e) =>
            onUserChange(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">All Users</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} (@{u.username})
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort-option">Sort by:</label>
        <select
          id="sort-option"
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
        >
          <option value="default">Default (ID)</option>
          <option value="length-asc">Content Length ↑</option>
          <option value="length-desc">Content Length ↓</option>
          <option value="danger-asc">Danger Score ↑</option>
          <option value="danger-desc">Danger Score ↓</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="search">Search:</label>
        <input
          id="search"
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
