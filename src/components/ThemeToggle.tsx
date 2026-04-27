/* eslint-disable @typescript-eslint/naming-convention */
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/themeSlice';
import { RootState } from '../redux/store';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      aria-label={`Switch to ${themeMode === 'light' ? 'night' : 'day'} mode`}
      style={{
        width: 36,
        height: 36,
        borderRadius: 2,
        background: 'var(--paper-1)',
        border: '1px solid var(--rule-strong)',
        color: 'var(--ink-900)',
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontSize: 18,
        boxShadow: 'var(--shadow-press)',
        cursor: 'pointer',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      {themeMode === 'light' ? '☀' : '☾'}
    </button>
  );
};

export default ThemeToggle;
