import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/themeSlice';
import { RootState } from '../redux/store';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="p-2 rounded-full border bg-gray-200 dark:bg-gray-800"
    >
      {themeMode === 'light' ? '🌞' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
