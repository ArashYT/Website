'use client';
import React, { useEffect, useState } from 'react';

export default function StreamSchedule() {
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0, isLive: false });

  useEffect(() => {
    const updateCountdown = () => {
      // Get current date
      const now = new Date();
      
      // Target schedule in America/New_York (EST/EDT)
      // Streams: Mon (1), Wed (3), Fri (5) at 19:00 (7:00 PM)
      // We will check the current time in Eastern Time
      let tempDate;
      try {
        tempDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      } catch (e) {
        // Fallback to local time if timezone string fails
        tempDate = new Date(now);
      }
      
      const currentDay = tempDate.getDay();
      const currentHour = tempDate.getHours();
      
      const streamDays = [1, 3, 5]; // Mon, Wed, Fri
      let daysUntilStream = -1;
      
      // If today is a stream day and it is between 7:00 PM and 10:00 PM, show "Live Now!"
      if (streamDays.includes(currentDay) && currentHour >= 19 && currentHour < 22) {
        setCountdown({ hours: 0, minutes: 0, seconds: 0, isLive: true });
        return;
      }

      // Otherwise, find the next stream date
      for (let i = 0; i < 8; i++) {
        const checkDay = (currentDay + i) % 7;
        if (streamDays.includes(checkDay)) {
          if (i === 0) {
            if (currentHour < 19) {
              daysUntilStream = 0;
              break;
            }
          } else {
            daysUntilStream = i;
            break;
          }
        }
      }

      if (daysUntilStream === -1) {
        daysUntilStream = 1;
      }

      const targetDateET = new Date(tempDate);
      targetDateET.setDate(tempDate.getDate() + daysUntilStream);
      targetDateET.setHours(19, 0, 0, 0);

      const diffMs = targetDateET.getTime() - tempDate.getTime();
      
      if (diffMs <= 0) {
        setCountdown({ hours: 0, minutes: 0, seconds: 0, isLive: true });
      } else {
        const totalSecs = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSecs / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = totalSecs % 60;
        setCountdown({ hours, minutes, seconds, isLive: false });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass reveal" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
        <span>📅</span> Stream Schedule
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
            <span style={{ fontWeight: '600' }}>📅 Monday, Wednesday, Friday</span>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>7:00 PM EST</span>
          </div>
          <p style={{ fontSize: '0.85rem', opacity: 0.6, margin: 0 }}>
            Valorant ranked pushes, Minecraft hardcore worlds & variety gaming!
          </p>
        </div>

        <div style={{ 
          background: 'rgba(255, 255, 255, 0.02)', 
          border: '1px solid var(--card-border)', 
          borderRadius: '12px', 
          padding: '1rem', 
          textAlign: 'center',
          marginTop: '0.5rem'
        }}>
          {countdown.isLive ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span className="live-dot" style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%', 
                background: '#ff4757',
                display: 'inline-block',
                boxShadow: '0 0 10px #ff4757',
                animation: 'fadeIn 1s infinite alternate'
              }}></span>
              <span style={{ fontWeight: 'bold', color: '#ff4757', letterSpacing: '0.5px' }}>STREAM IS LIVE NOW! 🔴</span>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.8rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                Next Stream Countdown
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--accent)', fontFamily: 'monospace', letterSpacing: '1px' }}>
                {String(countdown.hours).padStart(2, '0')}h : {String(countdown.minutes).padStart(2, '0')}m : {String(countdown.seconds).padStart(2, '0')}s
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
