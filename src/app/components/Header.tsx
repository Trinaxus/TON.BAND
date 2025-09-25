"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Prüfe, ob der Benutzer ein Admin ist
    const checkUserStatus = async () => {
      try {
        // Prüfe zuerst, ob ein Session-Cookie vorhanden ist
        const sessionCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('tubox_session='));
        
        if (!sessionCookie) {
          setIsLoggedIn(false);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }
        
        // Wir verzichten auf die direkte Cookie-Verarbeitung und verlassen uns auf die API
        
        // Versuche, Benutzerinformationen aus dem API-Endpunkt zu laden
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Cache-Control": "no-cache"
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          console.log("Benutzer-Daten erhalten:", data);
          
          // Setze Benutzerinformationen
          setIsLoggedIn(data.isLoggedIn);
          
          // Prüfe die Rolle des Benutzers
          const isUserAdmin = data.isLoggedIn && data.role === 'admin';
          console.log("Ist Admin?", isUserAdmin, "Rolle:", data.role);
          setIsAdmin(isUserAdmin);
          
          setUsername(data.username || "");
          setEmail(data.email || "");
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Fehler beim Prüfen des Benutzer-Status:", error);
        setIsLoggedIn(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial beim Laden prüfen
    checkUserStatus();
    
    // Intervall einrichten, um den Status alle 10 Sekunden zu prüfen
    const intervalId = setInterval(checkUserStatus, 10000);
    
    // Event-Listener für Fokus-Änderungen hinzufügen
    // Wenn der Benutzer zurück zum Tab wechselt, wird der Status sofort aktualisiert
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkUserStatus();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup: Intervall und Event-Listener entfernen, wenn die Komponente unmontiert wird
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Logout-Funktion
  const handleLogout = async () => {
    try {
      console.log("Starte Logout-Prozess...");
      
      // 1. Alle Cookies löschen
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
        console.log(`Cookie gelöscht: ${name}`);
      }
      
      // 2. Lokalen Speicher leeren
      localStorage.clear();
      sessionStorage.clear();
      console.log("Lokaler Speicher geleert");
      
      // 3. Logout-API aufrufen
      console.log("Rufe Logout-API auf...");
      try {
        const response = await fetch("/api/logout", {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
          }
        });
        
        if (response.ok) {
          console.log("Logout-API erfolgreich aufgerufen");
        } else {
          console.warn("Logout-API-Fehler:", response.status);
        }
      } catch (e) {
        console.warn("Fehler beim Aufruf der Logout-API:", e);
      }
      
      // 4. Hard-Reload zur Login-Seite
      console.log("Leite zur Login-Seite weiter...");
      setTimeout(() => {
        const cacheBuster = `?logout=${Date.now()}`;
        window.location.href = "/login" + cacheBuster;
      }, 100);
    } catch (error) {
      console.error("Fehler beim Logout:", error);
      alert("Fehler beim Logout. Bitte versuche es erneut.");
    }
  };

  return (
    <div className="sticky top-0 z-[60] w-full bg-[rgba(30,30,30,0.85)] border-b border-[rgba(0,225,255,0.2)] backdrop-blur-md" style={{backdropFilter: 'blur(12px)'}} >
    
    <header 
      className="py-3 md:py-4 px-3 md:px-5 flex flex-col md:flex-row justify-between items-center w-full max-w-[1200px] mx-auto border-b-0"
      style={{ 
        backgroundColor: '#ffffff'
      }}
    >
      <nav>
        <Link href="/" className="block mb-2 md:mb-0">
          <img 
            src="/Logo_ton.band_weiss.png" 
            alt="TON.BAND Logo" 
            className="w-[90px] md:w-[110px] h-auto filter drop-shadow-md"
          />
        </Link>
      </nav>
      {/* Benutzername und E-Mail anzeigen, wenn eingeloggt - nur auf Desktop */}
      {isLoggedIn && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 border-r border-l border-[rgba(0,225,255,0.3)] rounded-md bg-[rgba(0,225,255,0.05)] mr-1 md:mr-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#00e1ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" stroke="#00e1ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-white text-xs sm:text-sm">{username}</span>
                {isAdmin && (
                  <span className="inline-flex items-center justify-center px-1 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full bg-[#00e1ff] bg-opacity-20 text-[#00e1ff] border border-[#00e1ff] border-opacity-30">
                    Admin
                  </span>
                )}
              </div>
              <span className="text-gray-400 text-[10px] sm:text-xs truncate max-w-[120px] sm:max-w-[150px] md:max-w-none">{email}</span>
            </div>
          </div>
        )}

        
      {/* Rechte Seite mit Benutzerinfo und Buttons */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto justify-center md:justify-end">
        <Link href="/blog"
          style={{
            display: 'flex',
            alignItems: 'center',
            color: '#00e1ff',
            fontSize: '0.875rem',
            fontWeight: 600,
            padding: '0.3rem 0.5rem',
            borderRadius: '15px',
            border: '1px solid rgba(0, 225, 255, 0.2)',
            backgroundColor: 'rgba(0, 225, 255, 0.1)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s',
          }}
          className="header-button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1.5">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="#00e1ff" strokeWidth="2"/>
            <path d="M7 9H17" stroke="#00e1ff" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7 13H13" stroke="#00e1ff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>BLOG</span>
        </Link>
        
        
        {/* Admin-Link - nur anzeigen, wenn der Benutzer ein Admin ist */}
        {isAdmin && (
          <Link href="/admin" style={{
              display: 'flex',
              alignItems: 'center',
              color: '#00e1ff',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              padding: '0.3rem 0.5rem',
              borderRadius: '15px',
              border: '1px solid rgba(0, 225, 255, 0.2)',
              backgroundColor: 'rgba(0, 225, 255, 0.1)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s',
            }}
            className="header-button"
          >
            <span className="mr-1.5">ADMIN</span>
           
          </Link>
        )}
        
        {/* Login-Button - nur anzeigen, wenn der Benutzer NICHT eingeloggt ist */}
        {!isLoggedIn && !isLoading && (
          <Link href="/login" 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#00e1ff',
              fontSize: '0.875rem',
              fontWeight: 600,
              padding: '0.3rem 0.5rem',
              borderRadius: '15px',
              border: '1px solid rgba(0, 225, 255, 0.2)',
              backgroundColor: 'rgba(0, 225, 255, 0.1)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s',
            }}
            className="header-button"
          >
            <span className="mr-1.5">LOGIN</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15" stroke="#00e1ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 17L15 12L10 7" stroke="#00e1ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 12H3" stroke="#00e1ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        )}
        
        {/* Logout-Button - nur anzeigen, wenn der Benutzer eingeloggt ist */}
        {isLoggedIn && (
          <button 
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#00e1ff',
              fontSize: '0.875rem',
              fontWeight: 600,
              padding: '0.3rem 0.5rem',
              borderRadius: '15px',
              border: '1px solid rgba(0, 225, 255, 0.2)',
              backgroundColor: 'rgba(0, 225, 255, 0.1)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
            className="header-button"
          >
            <span className="mr-1.5">LOGOUT</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H11C11.5523 19 12 18.5523 12 18C12 17.4477 11.5523 17 11 17H5V7H11C11.5523 7 12 6.55228 12 6C12 5.44772 11.5523 5 11 5H5Z" fill="#00e1ff"/>
              <path d="M8 12C8 11.4477 8.44772 11 9 11H16.5858L14.2929 8.70711C13.9024 8.31658 13.9024 7.68342 14.2929 7.29289C14.6834 6.90237 15.3166 6.90237 15.7071 7.29289L19.7071 11.2929C20.0976 11.6834 20.0976 12.3166 19.7071 12.7071L15.7071 16.7071C15.3166 17.0976 14.6834 17.0976 14.2929 16.7071C13.9024 16.3166 13.9024 15.6834 14.2929 15.2929L16.5858 13H9C8.44772 13 8 12.5523 8 12Z" fill="#00e1ff"/>
            </svg>
          </button>
        )}
      </div>
    </header>
    </div>
  );
}
