'use client';

import { useState, useEffect } from 'react';
import { fetchHealth } from '@/lib/api';
import styles from './BackendStatus.module.css';

interface Props {
  className?: string;
}

export default function BackendStatus({ className }: Props) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function check() {
      const health = await fetchHealth();
      if (mounted) setConnected(health.status !== 'offline');
    }

    check();
    const interval = setInterval(check, 30_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <span className={`${styles.pill} ${className ?? ''}`}>
      <span className={`${styles.dot} ${connected ? styles.connected : styles.offline}`} />
      {connected ? 'Connected' : 'Offline'}
    </span>
  );
}
