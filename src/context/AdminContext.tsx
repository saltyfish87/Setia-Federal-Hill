import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithPopup, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage, googleProvider } from '../lib/firebase';
import firebaseConfig from '../../firebase-applet-config.json';
import { AppContent } from '../types';
import { INITIAL_CONTENT } from '../constants';

interface AdminContextType {
  user: User | null;
  isAdmin: boolean;
  content: AppContent;
  setContent: (content: AppContent) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [content, setContentState] = useState<AppContent>(INITIAL_CONTENT);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.email === 'saltyfish1987@gmail.com';

  useEffect(() => {
    // Listen for auth changes
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    // Listen for content changes
    const unsubscribeContent = onSnapshot(doc(db, 'config', 'content'), 
      (snapshot) => {
        if (snapshot.exists()) {
          setContentState(snapshot.data() as AppContent);
        }
        // We don't auto-initialize here to avoid permission errors for non-admins
        setLoading(false);
      },
      (error) => {
        console.error("Firestore content sync failed:", error.message);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeContent();
    };
  }, []);

  // AUTO-SYNC: Force the 9 layouts into Firestore without overwriting other sections
  useEffect(() => {
    const syncData = async () => {
      // Only run if we are logged in as admin and layouts are missing in DB
      if (user && isAdmin && loading === false && content.layouts.length < 9) {
        console.log("Database out of sync. Upgrading layouts...");
        try {
          // Merge current content with the new layouts to preserve user's other photos/edits
          const updatedContent = {
            ...content,
            layouts: INITIAL_CONTENT.layouts
          };
          await setDoc(doc(db, 'config', 'content'), updatedContent);
        } catch (e) {
          console.error("Auto-sync failed:", e);
        }
      }
    };
    syncData();
  }, [user, isAdmin, loading, content.layouts.length]);

  const login = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const setContent = async (newContent: AppContent) => {
    if (!isAdmin) return;
    await setDoc(doc(db, 'config', 'content'), newContent);
  };

  const uploadImage = async (file: File): Promise<string> => {
    if (!isAdmin) throw new Error('Unauthorized');
    const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  };

  return (
    <AdminContext.Provider value={{
      user,
      isAdmin,
      content,
      setContent,
      uploadImage,
      login,
      logout,
      loading
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};
