import React from 'react';
import { categoryLabels } from '../data/threads';

const CategoryFilter = ({ currentFilter, onFilterChange }) => {
  const categories = ['all', 'announcement', 'qa', 'resources', 'entertainment'];

  return (
    <div className="categories">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-btn ${currentFilter === category ? 'active' : ''}`}
          data-category={category}
          onClick={() => onFilterChange(category)}
        >
          {categoryLabels[category]}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;

