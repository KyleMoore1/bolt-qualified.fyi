import React, { useState } from 'react';
import { LogIn, LogOut, X } from 'lucide-react';
import { Button } from './ui/Button';
import { AuthModal } from './AuthModal';
import { useAuth } from '../hooks/useAuth';

export function AuthButton() {
  const { user, signOut, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);

  if (loading) {
    return <Button disabled>Loading...</Button>;
  }

  if (user) {
    return (
      <Button onClick={signOut} variant="secondary" className="flex items-center gap-2">
        <span className="font-medium">{user.email}</span>
        <LogOut className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <>
      <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
        <LogIn className="h-4 w-4" />
        <span>Sign In</span>
      </Button>
      <AuthModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}