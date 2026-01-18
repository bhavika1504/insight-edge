import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signUp: (email: string, password: string, displayName: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Store user data in Firestore
    const storeUserData = async (user: User, additionalData: any = {}) => {
        if (!db) return;

        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // New user - create document
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: additionalData.displayName || user.displayName || '',
                photoURL: user.photoURL || '',
                createdAt: serverTimestamp(),
                lastLoginAt: serverTimestamp(),
            });
        } else {
            // Existing user - update last login
            await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
        }
    };

    // Sign up with email and password
    const signUp = async (email: string, password: string, displayName: string) => {
        if (!auth) throw new Error('Firebase not initialized');

        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName });
        await storeUserData(result.user, { displayName });
    };

    // Sign in with email and password
    const signIn = async (email: string, password: string) => {
        if (!auth) throw new Error('Firebase not initialized');

        const result = await signInWithEmailAndPassword(auth, email, password);
        await storeUserData(result.user);
    };

    // Sign in with Google
    const signInWithGoogle = async () => {
        if (!auth || !googleProvider) throw new Error('Firebase not initialized');

        const result = await signInWithPopup(auth, googleProvider);
        await storeUserData(result.user);
    };

    // Logout
    const logout = async () => {
        if (!auth) throw new Error('Firebase not initialized');
        await signOut(auth);
    };

    // Listen to auth state changes
    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value: AuthContextType = {
        user,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
