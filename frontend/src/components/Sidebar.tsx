'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BackendStatus from './BackendStatus';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { icon: '⬡', label: 'Overview', href: '/' },
  { icon: '◈', label: 'Sessions', href: '/sessions' },
  { icon: '◉', label: 'Heatmaps', href: '/heatmaps' },
  { icon: '◎', label: 'Models', href: '/models' },
  { icon: '◇', label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.logo}>
        <div className={styles.logoDot} />
        <span className={styles.logoText}>GazeLite</span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.bottom}>
        <BackendStatus />
      </div>

      <button
        className={styles.collapseBtn}
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? '›' : '‹'}
      </button>
    </aside>
  );
}
